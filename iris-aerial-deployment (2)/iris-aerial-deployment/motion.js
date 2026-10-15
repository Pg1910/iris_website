/* ===========================================================================
   Iris Aerial — motion layer
   Progressive enhancement only: every block below checks for its own hooks and
   exits quietly if the markup is not on the page. Nothing here is required for
   the site to be readable or operable.
   =========================================================================== */
(() => {
  "use strict";

  const systemReduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const reduceMotion = () =>
    document.documentElement.dataset.motion === "reduce" ||
    (document.documentElement.dataset.motion !== "full" &&
      systemReduceMotion.matches);
  const body = document.body;

  /* -------------------------------------------------------------------------
     1. Client marquee — one continuous right-to-left run, paused on hover
     ------------------------------------------------------------------------- */

  function initMarquee() {
    const marquee = document.querySelector(".client-band .marquee");
    const set = marquee?.querySelector(".client-set");
    if (!set) return;

    const track = document.createElement("div");
    track.className = "marquee-track";
    set.replaceWith(track);
    track.append(set);

    // The clone is decorative: screen readers read the original set only.
    const clone = set.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone
      .querySelectorAll("img")
      .forEach((img) => img.setAttribute("alt", ""));
    track.append(clone);

    const setDuration = () => {
      const distance = set.scrollWidth;
      if (!distance) return;
      // Constant speed (~58px/s) regardless of how many logos are on the rail.
      track.style.setProperty(
        "--marquee-duration",
        `${Math.max(24, Math.round(distance / 58))}s`,
      );
    };
    setDuration();
    addEventListener("resize", setDuration, { passive: true });
    if (document.fonts?.ready) document.fonts.ready.then(setDuration);
  }

  /* -------------------------------------------------------------------------
     3. Scroll reveal — imagery and cards arrive as you reach them
     ------------------------------------------------------------------------- */

  const REVEAL_GROUPS = [
    [".home-about .shell > *", ""],
    [".page .section-head > *", ""],
    [".page .ak-section-head > *", ""],
    [".home-projects .project-story", "zoom"],
    [".delivery-section .shell > *", ""],
    [".change-copy", "left"],
    [".change-collage", "right"],
    [".visit-grid > *", ""],
    [".solution-family", ""],
    [".case-gallery figure", "zoom"],
    [".ak-split-card", ""],
    [".ak-story-grid > *", ""],
    [".ak-evidence", "zoom"],
    [".ak-feature-ribbon article", ""],
    [".defence-collage figure", "zoom"],
    [".defence-need", "right"],
    [".defence-phase", ""],
    [".hil-note", ""],
    [".tech-method", ""],
    [".team-moment", ""],
    [".person-row", ""],
    [".job-card", ""],
    [".careers-pitch span", ""],
  ];

  function initReveal() {
    if (reduceMotion()) return;
    const targets = [];
    REVEAL_GROUPS.forEach(([selector, mode]) => {
      const nodes = [...document.querySelectorAll(selector)];
      nodes.forEach((node, index) => {
        if (node.hasAttribute("data-reveal")) return;
        node.setAttribute("data-reveal", mode);
        // Stagger within a group, but never let the tail wait too long.
        node.style.setProperty(
          "--reveal-delay",
          `${Math.min(index, 6) * 80}ms`,
        );
        targets.push(node);
      });
    });
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        });
      },
      // A fractional threshold can stall on blocks taller than the viewport,
      // so trigger on any sliver that clears the fold by 60px.
      { rootMargin: "0px 0px -60px 0px", threshold: 0.01 },
    );
    targets.forEach((node) => observer.observe(node));

    // A hidden page has no layout, so its items never intersect. Re-check on
    // route change and reveal anything already inside the viewport.
    //
    // This deliberately avoids requestAnimationFrame: in a background tab the
    // rendering loop is paused, which also suspends IntersectionObserver
    // delivery. A timer still fires, so content never gets stranded at
    // opacity 0 waiting for a frame that is not coming.
    function revealVisible() {
      targets.forEach((node) => {
        if (node.classList.contains("in-view")) return;
        if (node.closest(".page")?.hidden) return;
        const box = node.getBoundingClientRect();
        if (box.height === 0 && box.width === 0) return;
        if (box.top < innerHeight && box.bottom > 0) {
          node.classList.add("in-view");
          observer.unobserve(node);
        }
      });
    }
    new MutationObserver(() => setTimeout(revealVisible, 0)).observe(body, {
      attributes: true,
      attributeFilter: ["data-route"],
    });
    document.addEventListener("visibilitychange", revealVisible);
    addEventListener("pageshow", revealVisible);
    setTimeout(revealVisible, 1200);
  }

  /* -------------------------------------------------------------------------
     4. Decorative particles — team confetti, careers starfield
     ------------------------------------------------------------------------- */

  function scatter(host, count, build) {
    if (!host || reduceMotion()) return;
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < count; index += 1) {
      const node = document.createElement("i");
      build(node, index);
      fragment.append(node);
    }
    host.append(fragment);
  }

  function initParticles() {
    const palette = ["#ff7a4d", "#ffc24d", "#3fc39b", "#5aa9ff", "#ff6b9d"];
    scatter(document.querySelector(".confetti"), 16, (node, index) => {
      node.style.left = `${(index * 6.4 + ((index * 37) % 11)) % 98}%`;
      node.style.top = `${((index * 23) % 86) + 4}%`;
      node.style.background = palette[index % palette.length];
      node.style.animationDelay = `${(index % 9) * 0.45}s`;
      node.style.animationDuration = `${7 + (index % 5)}s`;
      const size = 7 + (index % 4) * 3;
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
    });
    scatter(document.querySelector(".careers-starfield"), 34, (node, index) => {
      node.style.left = `${(index * 17) % 99}%`;
      node.style.top = `${(index * 31) % 95}%`;
      node.style.animationDelay = `${(index % 12) * 0.28}s`;
      const size = 2 + (index % 3);
      node.style.width = `${size}px`;
      node.style.height = `${size}px`;
    });
  }

  /* -------------------------------------------------------------------------
     5. Team cards pick up a colour so the grid stops reading as a spreadsheet
     ------------------------------------------------------------------------- */

  function initPeopleColour() {
    const accents = [
      ["#ff7a4d", "#fff0e8"],
      ["#5aa9ff", "#eaf3ff"],
      ["#3fc39b", "#e6f8f1"],
      ["#ffc24d", "#fff6e2"],
      ["#ff6b9d", "#ffeef4"],
    ];
    document.querySelectorAll(".person-row").forEach((row, index) => {
      const [accent, tint] = accents[index % accents.length];
      row.style.setProperty("--person-accent", accent);
      row.style.setProperty("--person-tint", tint);
    });
  }

  /* -------------------------------------------------------------------------
     6. Scan-line travel distance for the Akshaa teaser tiles
     ------------------------------------------------------------------------- */

  function initScanTravel() {
    const tiles = [
      ...document.querySelectorAll(".change-section .detection-triptych .image-open"),
    ];
    if (!tiles.length) return;
    const measure = () =>
      tiles.forEach((tile) =>
        tile.style.setProperty(
          "--scan-travel",
          `${Math.max(60, tile.clientHeight - 18)}px`,
        ),
      );
    measure();
    // The tiles only reach full height once their images resolve the
    // aspect-ratio, so keep the sweep length in step with the real box.
    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(measure);
      tiles.forEach((tile) => observer.observe(tile));
    } else {
      addEventListener("resize", measure, { passive: true });
    }
  }

  /* ----------------------------------------------------------------------- */

  function start() {
    initMarquee();
    initReveal();
    initParticles();
    initPeopleColour();
    initScanTravel();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
