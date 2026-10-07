/* ===========================================================================
   Iris Aerial — character layer
   Everything here is enhancement. Each block looks for its own hooks and
   returns quietly when they are absent, so a failure in one never takes the
   rest of the page with it.
   =========================================================================== */
(() => {
  "use strict";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(pointer: fine)");
  const calm = () => reduceMotion.matches;

  const all = (selector, root = document) => [...root.querySelectorAll(selector)];

  /* -------------------------------------------------------------------------
     1. Contour texture
     Sections opt in by selector here rather than by a class in the markup, so
     the motif can be re-pointed without touching index.html.
     ------------------------------------------------------------------------- */

  const CONTOUR_SECTIONS = [
    ".client-band",
    ".home-about",
    ".trust-strip",
    ".voices",
    ".solutions-hero",
    ".ak-hero",
    ".ak-urban",
    ".ak-defence",
    "#technology .page-hero",
    ".team-stage",
    ".people-section",
    "#careers .page-hero",
  ];

  function initContours() {
    CONTOUR_SECTIONS.forEach((selector) => {
      all(selector).forEach((section) => {
        if (section.querySelector(":scope > .contour-layer")) return;
        section.classList.add("has-contours");
        const layer = document.createElement("div");
        layer.className = "contour-layer";
        if (!calm()) layer.classList.add("drift");
        layer.setAttribute("aria-hidden", "true");
        section.prepend(layer);
      });
    });
  }

  /* -------------------------------------------------------------------------
     2. Headline that assembles itself, word by word
     ------------------------------------------------------------------------- */

  function splitWords(heading, step = 70) {
    if (!heading || heading.dataset.split === "done") return;
    const words = heading.textContent.trim().split(/\s+/);
    if (!words.length) return;
    heading.dataset.split = "done";
    heading.textContent = "";
    words.forEach((word, index) => {
      const wrap = document.createElement("span");
      wrap.className = "word-wrap";
      const inner = document.createElement("span");
      inner.textContent = word;
      inner.style.setProperty("--word-delay", `${index * step}ms`);
      wrap.append(inner);
      heading.append(wrap);
      if (index < words.length - 1) heading.append(document.createTextNode(" "));
    });
  }

  /* -------------------------------------------------------------------------
     3. Scroll position, drawn as a survey chain across the top
     ------------------------------------------------------------------------- */

  function initScrollChain() {
    const chain = document.createElement("div");
    chain.className = "scroll-chain";
    chain.setAttribute("aria-hidden", "true");
    chain.innerHTML = "<i></i>";
    document.body.append(chain);
    let queued = false;
    const update = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      chain.style.setProperty("--progress", max > 0 ? scrollY / max : 0);
    };
    addEventListener(
      "scroll",
      () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(update);
      },
      { passive: true },
    );
    addEventListener("resize", update, { passive: true });
    update();
  }

  /* -------------------------------------------------------------------------
     4. Hero: live readout and pointer parallax
     ------------------------------------------------------------------------- */

  function initHud() {
    const clock = document.querySelector("[data-hud-clock]");
    if (!clock) return;
    const tick = () => {
      // Asia/Kolkata regardless of where the visitor is: it is Iris's clock.
      clock.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    };
    tick();
    setInterval(tick, 1000);
  }

  function initHeroParallax() {
    const atlas = document.querySelector(".project-atlas");
    if (!atlas || calm() || !finePointer.matches) return;
    atlas.classList.add("hero-parallax");
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    const loop = () => {
      x += (targetX - x) * 0.07;
      y += (targetY - y) * 0.07;
      atlas.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.03)`;
      if (Math.abs(targetX - x) > 0.1 || Math.abs(targetY - y) > 0.1) {
        frame = requestAnimationFrame(loop);
      } else {
        frame = 0;
      }
    };
    addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType !== "mouse") return;
        if (document.body.dataset.route !== "home") return;
        targetX = (event.clientX / innerWidth - 0.5) * -22;
        targetY = (event.clientY / innerHeight - 0.5) * -14;
        if (!frame) frame = requestAnimationFrame(loop);
      },
      { passive: true },
    );
  }

  /* -------------------------------------------------------------------------
     5. Counters
     Every figure is counted off the page itself, so none of them can drift out
     of step with the content or become a number nobody can source.
     ------------------------------------------------------------------------- */

  function initTally() {
    const tally = document.querySelector("[data-tally]");
    if (!tally) return;
    const counts = {
      sectors: all(".solution-family").length,
      people: all(".person-row").length,
      clients: all('.client-set:not([aria-hidden="true"]) .client-logo').length,
    };
    const cells = all("[data-count]", tally);
    cells.forEach((cell) => {
      const value = counts[cell.dataset.count] || 0;
      cell.dataset.target = String(value);
      cell.textContent = calm() ? String(value).padStart(2, "0") : "00";
    });
    if (calm()) return;

    const run = () => {
      cells.forEach((cell) => {
        const target = Number(cell.dataset.target);
        const started = performance.now();
        const span = 1100;
        const step = (now) => {
          const t = Math.min(1, (now - started) / span);
          // ease-out so it lands softly instead of stopping dead
          const eased = 1 - Math.pow(1 - t, 3);
          cell.textContent = String(Math.round(target * eased)).padStart(2, "0");
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          run();
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(tally);
    // Same guard as the reveal pass: a background tab never delivers an
    // observer callback, so make sure the numbers still arrive.
    setTimeout(() => {
      if (tally.getBoundingClientRect().top < innerHeight * 2) {
        observer.disconnect();
        run();
      }
    }, 2500);
  }

  /* -------------------------------------------------------------------------
     6. Pointer play: magnetic buttons, tilting cards, a marker on click
     ------------------------------------------------------------------------- */

  const MAGNETIC = ".button, .apply-button, .header-contact, .atlas-control";
  const TILT = ".voice-card, .ak-split-card, .tech-method, .job-card";

  function initMagnets() {
    if (calm() || !finePointer.matches) return;
    all(MAGNETIC).forEach((el) => {
      el.classList.add("magnetic");
      el.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        const box = el.getBoundingClientRect();
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height / 2);
        el.classList.add("pulled");
        el.style.translate = `${dx * 0.22}px ${dy * 0.3}px`;
      });
      el.addEventListener("pointerleave", () => {
        el.classList.remove("pulled");
        el.style.translate = "";
      });
    });
  }

  function initTilt() {
    if (calm() || !finePointer.matches) return;
    all(TILT).forEach((card) => {
      card.classList.add("tilt");
      card.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        const box = card.getBoundingClientRect();
        const dx = (event.clientX - box.left) / box.width - 0.5;
        const dy = (event.clientY - box.top) / box.height - 0.5;
        // Axis-angle: the axis is perpendicular to the direction of the drag.
        const ax = -dy;
        const ay = dx;
        const mag = Math.hypot(ax, ay);
        if (mag < 0.002) return;
        card.classList.add("tipping");
        card.style.rotate = `${ax / mag} ${ay / mag} 0 ${mag * 9}deg`;
      });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("tipping");
        card.style.rotate = "";
      });
    });
  }

  const MARK_SVG = `
<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
  <circle cx="24" cy="24" r="9"/>
  <circle cx="24" cy="24" r="2.4" fill="currentColor" stroke="none"/>
  <path d="M24 2v10M24 36v10M2 24h10M36 24h10" stroke-linecap="round"/>
  <circle cx="24" cy="24" r="20" stroke-dasharray="3 6" opacity=".6"/>
</svg>`;

  function initSurveyMarks() {
    if (calm() || !finePointer.matches) return;
    addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      const mark = document.createElement("div");
      mark.className = "survey-mark";
      mark.setAttribute("aria-hidden", "true");
      mark.innerHTML = MARK_SVG;
      mark.style.left = `${event.clientX}px`;
      mark.style.top = `${event.clientY}px`;
      document.body.append(mark);
      mark.addEventListener("animationend", () => mark.remove(), { once: true });
      setTimeout(() => mark.remove(), 2200);
    });
  }

  /* -------------------------------------------------------------------------
     7. Oversized numerals, added from each item's own index
     ------------------------------------------------------------------------- */

  function numberGroup(selector, format = (n) => String(n).padStart(2, "0")) {
    all(selector).forEach((item, index) => {
      if (item.querySelector(":scope > .ghost-num")) return;
      const num = document.createElement("span");
      num.className = "ghost-num";
      num.setAttribute("aria-hidden", "true");
      num.textContent = format(index + 1);
      item.prepend(num);
    });
  }

  function initGhostNumbers() {
    numberGroup(".solution-family");
    numberGroup(".tech-method");
  }

  /* -------------------------------------------------------------------------
     8. Akshaa radar sweep
     ------------------------------------------------------------------------- */

  function initRadar() {
    // Anchored to the lens figure, so the sweep reads as the product looking
    // at the imagery rather than as wallpaper behind the whole hero.
    const hero = document.querySelector(".ak-hero .ak-lens");
    if (!hero || hero.querySelector(".ak-radar")) return;
    const radar = document.createElement("div");
    radar.className = "ak-radar";
    radar.setAttribute("aria-hidden", "true");
    radar.innerHTML = "<i></i>";
    hero.prepend(radar);
  }

  /* -------------------------------------------------------------------------
     9. Image wipes and the highlight sweep
     ------------------------------------------------------------------------- */

  const WIPE = [
    ".team-moment .image-open",
    ".solution-family .service-media .image-open",
    ".case-visual > .image-open",
    ".delivery-board .field-frame > .image-open",
    ".team-hero-photo .image-open",
  ];

  function initWipes() {
    if (calm()) return;
    const nodes = [];
    WIPE.forEach((selector) =>
      all(selector).forEach((node) => {
        node.classList.add("wipe");
        nodes.push(node);
      }),
    );
    if (!nodes.length) return;

    // A wipe owns its own trigger rather than borrowing the reveal pass's
    // in-view flag: these elements are not all reveal targets, and a masked
    // image with nothing to unmask it would simply never appear.
    const show = (node) => {
      node.classList.add("in-view");
      observer.unobserve(node);
    };
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && show(entry.target)),
      { rootMargin: "0px 0px -40px 0px", threshold: 0.01 },
    );
    nodes.forEach((node) => observer.observe(node));

    const sweep = () =>
      nodes.forEach((node) => {
        if (node.classList.contains("in-view")) return;
        if (node.closest(".page")?.hidden) return;
        const box = node.getBoundingClientRect();
        if (box.height && box.top < innerHeight && box.bottom > 0) show(node);
      });
    new MutationObserver(() => setTimeout(sweep, 0)).observe(document.body, {
      attributes: true,
      attributeFilter: ["data-route"],
    });
    document.addEventListener("visibilitychange", sweep);
    setTimeout(sweep, 1200);
  }

  function initHighlights() {
    // The sweep rides the same in-view flag the reveal pass sets. Anything not
    // inside a revealed block lights immediately so it never stays unpainted.
    all(".hl").forEach((mark) => {
      if (!mark.closest("[data-reveal]")) mark.classList.add("lit");
    });
  }

  /* ----------------------------------------------------------------------- */

  function start() {
    initContours();
    splitWords(document.querySelector("#home .hero-copy h1"));
    initScrollChain();
    initHud();
    initHeroParallax();
    initTally();
    initGhostNumbers();
    initRadar();
    initWipes();
    initHighlights();
    initMagnets();
    initTilt();
    initSurveyMarks();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
