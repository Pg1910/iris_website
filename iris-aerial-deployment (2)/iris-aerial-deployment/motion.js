/* ===========================================================================
   Iris Aerial — motion layer
   Progressive enhancement only: every block below checks for its own hooks and
   exits quietly if the markup is not on the page. Nothing here is required for
   the site to be readable or operable.
   =========================================================================== */
(() => {
  "use strict";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(pointer: fine)");
  const body = document.body;

  /* -------------------------------------------------------------------------
     1. Drone cursor — the pointer becomes a survey drone on the home page
     ------------------------------------------------------------------------- */

  const DRONE_SVG = `
<svg class="drone-cursor-body" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="droneShell" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2f9fd0"/>
      <stop offset="1" stop-color="#0a5d87"/>
    </linearGradient>
    <linearGradient id="droneTop" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e8f1ff"/>
      <stop offset="1" stop-color="#b9e4f3"/>
    </linearGradient>
  </defs>
  <!-- arms -->
  <g stroke="#064a6d" stroke-width="3.4" stroke-linecap="round">
    <path d="M23 23 41 41M41 23 23 41"/>
  </g>
  <!-- rotor discs -->
  <g>
    <g class="drone-rotor"><circle cx="17" cy="17" r="10.5" fill="#0a7ab0" fill-opacity=".14"/><path d="M8 17h18" stroke="#0a7ab0" stroke-width="2.4" stroke-linecap="round"/><path d="M17 8v18" stroke="#42d2e7" stroke-width="1.8" stroke-linecap="round"/></g>
    <g class="drone-rotor slow"><circle cx="47" cy="17" r="10.5" fill="#0a7ab0" fill-opacity=".14"/><path d="M38 17h18" stroke="#0a7ab0" stroke-width="2.4" stroke-linecap="round"/><path d="M47 8v18" stroke="#42d2e7" stroke-width="1.8" stroke-linecap="round"/></g>
    <g class="drone-rotor slow"><circle cx="17" cy="47" r="10.5" fill="#0a7ab0" fill-opacity=".14"/><path d="M8 47h18" stroke="#0a7ab0" stroke-width="2.4" stroke-linecap="round"/><path d="M17 38v18" stroke="#42d2e7" stroke-width="1.8" stroke-linecap="round"/></g>
    <g class="drone-rotor"><circle cx="47" cy="47" r="10.5" fill="#0a7ab0" fill-opacity=".14"/><path d="M38 47h18" stroke="#0a7ab0" stroke-width="2.4" stroke-linecap="round"/><path d="M47 38v18" stroke="#42d2e7" stroke-width="1.8" stroke-linecap="round"/></g>
  </g>
  <!-- motor hubs -->
  <g fill="#0a293b">
    <circle cx="17" cy="17" r="2.6"/><circle cx="47" cy="17" r="2.6"/>
    <circle cx="17" cy="47" r="2.6"/><circle cx="47" cy="47" r="2.6"/>
  </g>
  <!-- body -->
  <path d="M24.5 24.5h15a3 3 0 0 1 3 3v8.5a6 6 0 0 1-6 6h-9a6 6 0 0 1-6-6V27.5a3 3 0 0 1 3-3Z" fill="url(#droneShell)" stroke="#0a293b" stroke-width="1.4"/>
  <path d="M26 26h12a2 2 0 0 1 2 2v2.6H24V28a2 2 0 0 1 2-2Z" fill="url(#droneTop)"/>
  <!-- gimbal camera -->
  <circle cx="32" cy="37" r="5.4" fill="#0a293b" stroke="#42d2e7" stroke-width="1.6"/>
  <circle cx="32" cy="37" r="2.2" fill="#42d2e7"/>
  <circle cx="30.6" cy="35.6" r=".9" fill="#eaf8fb"/>
  <!-- status light -->
  <circle class="drone-led" cx="40.4" cy="28.6" r="1.5" fill="#a0e66d"/>
</svg>`;

  function initDroneCursor() {
    if (!finePointer.matches || reduceMotion.matches) return;

    const drone = document.createElement("div");
    drone.className = "drone-cursor";
    drone.setAttribute("aria-hidden", "true");
    drone.innerHTML = DRONE_SVG;

    const scan = document.createElement("div");
    scan.className = "drone-scan";
    scan.setAttribute("aria-hidden", "true");
    scan.innerHTML =
      '<span class="drone-tick tl"></span><span class="drone-tick tr"></span>' +
      '<span class="drone-tick bl"></span><span class="drone-tick br"></span>';

    document.body.append(scan, drone);
    const shell = drone.querySelector(".drone-cursor-body");

    let pointerX = innerWidth / 2;
    let pointerY = innerHeight / 2;
    let x = pointerX;
    let y = pointerY;
    let scanX = pointerX;
    let scanY = pointerY;
    let tilt = 0;
    let bob = 0;
    let frame = 0;
    let seen = false;

    // Text entry keeps the real caret; a drone is no use for picking a
    // character out of the middle of an email address.
    const TYPING = "input, textarea, select, [contenteditable]";

    function loop() {
      frame = requestAnimationFrame(loop);
      // The drone trails the pointer slightly — it flies to the target.
      const dx = pointerX - x;
      const dy = pointerY - y;
      x += dx * 0.22;
      y += dy * 0.22;
      scanX += (pointerX - scanX) * 0.12;
      scanY += (pointerY - scanY) * 0.12;
      // Bank into the direction of travel, like a real quad.
      tilt += (Math.max(-26, Math.min(26, dx * 0.9)) - tilt) * 0.12;
      bob += 0.055;
      const lift = Math.sin(bob) * 1.6;
      drone.style.transform = `translate3d(${x}px, ${y + lift}px, 0)`;
      scan.style.transform = `translate3d(${scanX}px, ${scanY}px, 0)`;
      shell.style.rotate = `${tilt}deg`;
    }

    function activate() {
      body.classList.add("drone-active");
      drone.classList.add("ready");
      if (!frame) loop();
    }
    function deactivate() {
      body.classList.remove("drone-active", "drone-locked");
      drone.classList.remove("ready");
      cancelAnimationFrame(frame);
      frame = 0;
    }

    addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType !== "mouse") return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!seen) {
          seen = true;
          x = pointerX;
          y = pointerY;
          scanX = pointerX;
          scanY = pointerY;
        }
        const target = event.target instanceof Element ? event.target : null;
        if (target?.closest(TYPING)) {
          deactivate();
          return;
        }
        activate();
        const interactive = target?.closest(
          "a, button, summary, label, [role='button']",
        );
        body.classList.toggle("drone-locked", Boolean(interactive));
      },
      { passive: true },
    );

    addEventListener("pointerdown", () => {
      shell.animate(
        [{ scale: "1" }, { scale: "0.84" }, { scale: "1" }],
        { duration: 260, easing: "cubic-bezier(.34,1.56,.64,1)" },
      );
    });
    addEventListener("blur", deactivate);
    document.addEventListener("mouseleave", deactivate);
    document.addEventListener("mouseenter", activate);


    reduceMotion.addEventListener("change", (event) => {
      if (event.matches) {
        deactivate();
        drone.remove();
        scan.remove();
      }
    });
  }

  /* -------------------------------------------------------------------------
     2. Client marquee — one continuous right-to-left run, paused on hover
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
    if (reduceMotion.matches) return;
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
    if (!host || reduceMotion.matches) return;
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
    initDroneCursor();
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
