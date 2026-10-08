(() => {
  "use strict";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const scrollBehavior = () => (reduceMotion.matches ? "auto" : "smooth");
  const pageNames = {
    home: "Surveying, mapping & geospatial intelligence",
    solutions: "Survey and geospatial solutions",
    akshaa: "Akshaa geospatial intelligence",
    technology: "Our survey methods",
    team: "The Iris Aerial team",
    careers: "Careers at Iris Aerial",
  };
  const pages = [...document.querySelectorAll(".page")];
  const pageLinks = [...document.querySelectorAll("[data-page]")];
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const mainContent = document.querySelector("main");
  const footer = document.querySelector(".site-footer");

  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mobileNav.classList.remove("open");
    mobileNav.inert = true;
    mainContent.inert = false;
    footer.inert = false;
    document.body.classList.remove("menu-open");
  }

  function showPage(id, { focus = true, push = true } = {}) {
    if (!Object.hasOwn(pageNames, id)) id = "home";
    pages.forEach((page) => {
      page.hidden = page.id !== id;
    });
    pageLinks.forEach((link) => {
      if (link.dataset.page === id) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.title = `${pageNames[id]} | Iris Aerial Innovations`;
    document.body.dataset.route = id;
    const openViewer = document.querySelector("#image-viewer[open]");
    if (openViewer) openViewer.close();
    if (push && location.hash !== `#${id}`)
      history.pushState({ page: id }, "", `#${id}`);
    closeMenu();
    if (id === "home") atlas.play();
    else atlas.pause();
    scrollTo({ top: 0, behavior: "instant" });
    if (focus)
      document.querySelector(`#${id} h1`)?.focus({ preventScroll: true });
  }

  pageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      event.preventDefault();
      showPage(link.dataset.page);
    });
  });
  window.irisNavigate = showPage;
  window.irisToggleMenu = () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Open navigation" : "Close navigation",
    );
    mobileNav.classList.toggle("open", !open);
    mobileNav.inert = open;
    mainContent.inert = !open;
    footer.inert = !open;
    document.body.classList.toggle("menu-open", !open);
  };
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuToggle.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menuToggle.focus();
    }
  });
  matchMedia("(min-width: 1001px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
  const header = document.querySelector(".site-header");
  const areaLinks = [...document.querySelectorAll(".ak-subnav button")];
  const areaIds = ["akshaa-urban", "akshaa-defence"];
  const updateHeader = () => {
    header.classList.toggle("scrolled", scrollY > 12);
    let currentArea = -1;
    if (!document.querySelector("#akshaa").hidden) {
      areaIds.forEach((id, index) => {
        if (
          document.getElementById(id).getBoundingClientRect().top <=
          header.offsetHeight + 160
        )
          currentArea = index;
      });
    }
    areaLinks.forEach((link, index) => {
      if (index === currentArea) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  let headerFrame = 0;
  addEventListener(
    "scroll",
    () => {
      if (headerFrame) return;
      headerFrame = requestAnimationFrame(() => {
        headerFrame = 0;
        updateHeader();
      });
    },
    { passive: true },
  );
  updateHeader();
  function openHash({ focus = true } = {}) {
    const id = location.hash.slice(1) || "home";
    const target = document.getElementById(id);
    const owner = target?.closest(".page");
    showPage(owner?.id || id, { focus, push: false });
    if (owner && owner.id !== id) scrollToSection(id);
  }
  addEventListener("hashchange", () => openHash());

  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    const style = getComputedStyle(target);
    if (style.position === "sticky") {
      // A pinned card reports its pinned position, so scrollIntoView would not
      // move. Measure where the card naturally sits and scroll there instead.
      const pin = parseFloat(style.top) || 0;
      target.style.position = "static";
      const top = target.getBoundingClientRect().top + scrollY - pin;
      target.style.position = "";
      scrollTo({ top, behavior: scrollBehavior() });
    } else {
      target.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    }
    const heading = target.querySelector("h2");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }
  window.irisScrollTo = scrollToSection;
  window.irisOpenContact = (topic) => {
    const email = document.querySelector("#project-email-link");
    email.href = `mailto:info@irisaerial.in?subject=${encodeURIComponent(topic || "Project enquiry for Iris Aerial")}`;
    showPage("home", { focus: false });
    scrollToSection("contact");
  };

  // The field gallery supports manual selection and optional playback. It never autoplays.
  function createGallery({
    itemSelector,
    dotsSelector,
    playSelector,
    progressSelector,
    label,
    delay,
    autoplay = false,
    onChange,
  }) {
    const items = [...document.querySelectorAll(itemSelector)];
    const dotsContainer = document.querySelector(dotsSelector);
    if (!dotsContainer) {
      const heroVideo = document.querySelector(".hero-video");
      return {
        pause: () => heroVideo?.pause(),
        play: () => { heroVideo?.play().catch(() => {}); },
        toggle: () => {
          if (!heroVideo) return;
          if (heroVideo.paused) heroVideo.play().catch(() => {});
          else heroVideo.pause();
        },
        next: () => {},
      };
    }
    const playButton = document.querySelector(playSelector);
    const progress = progressSelector
      ? document.querySelector(progressSelector)
      : null;
    const gallery = dotsContainer.closest(".project-atlas");
    if (progress) progress.style.setProperty("--atlas-delay", `${delay}ms`);
    const announcement = document.createElement("span");
    announcement.className = "visually-hidden";
    announcement.setAttribute("role", "status");
    announcement.setAttribute("aria-live", "polite");
    gallery.append(announcement);
    let current = 0;
    let playing = false;
    let timer;
    const dots = items.map((item, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "atlas-dot";
      dot.setAttribute("aria-label", `Show ${label} ${index + 1}`);
      dot.addEventListener("click", () => {
        pause();
        select(index, true);
      });
      dotsContainer.append(dot);
      return dot;
    });
    function select(index, announce = false) {
      current = (index + items.length) % items.length;
      items.forEach((item, i) => {
        item.classList.toggle("active", i === current);
        item.setAttribute("aria-hidden", String(i !== current));
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
        if (i === current) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      onChange?.(current, items.length);
      if (announce) {
        const caption = items[current].querySelector("figcaption");
        announcement.textContent = `${label} ${current + 1} of ${items.length}. ${caption?.textContent.trim() || ""}`;
      }
    }
    function startTimer() {
      clearInterval(timer);
      timer = setInterval(() => select(current + 1), delay);
      if (progress) {
        progress.classList.remove("running");
        void progress.offsetWidth;
        progress.classList.add("running");
      }
    }
    function stopTimer() {
      clearInterval(timer);
      progress?.classList.remove("running");
    }
    function pause() {
      stopTimer();
      playing = false;
      playButton.textContent = "Play";
      playButton.setAttribute("aria-label", `Play ${label} slideshow`);
      playButton.setAttribute("aria-pressed", "false");
    }
    function play() {
      if (reduceMotion.matches || playing) return;
      playing = true;
      playButton.textContent = "Pause";
      playButton.setAttribute("aria-label", `Pause ${label} slideshow`);
      playButton.setAttribute("aria-pressed", "true");
      startTimer();
    }
    function toggle() {
      if (playing) pause();
      else play();
    }
    // Hovering or tabbing into the gallery holds the current frame.
    ["mouseenter", "focusin"].forEach((type) =>
      gallery.addEventListener(type, () => {
        if (playing) stopTimer();
      }),
    );
    ["mouseleave", "focusout"].forEach((type) =>
      gallery.addEventListener(type, () => {
        if (playing && !gallery.contains(document.activeElement)) startTimer();
      }),
    );
    select(0);
    pause();
    if (autoplay) play();
    gallery.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      pause();
      select(current + (event.key === "ArrowRight" ? 1 : -1), true);
    });
    return {
      pause,
      play,
      toggle,
      next: (delta) => {
        select(current + delta, true);
        if (playing) startTimer();
      },
    };
  }
  const atlas = createGallery({
    itemSelector: ".atlas-frame",
    dotsSelector: ".atlas-dots",
    playSelector: ".atlas-control:nth-of-type(3)",
    progressSelector: ".atlas-progress",
    label: "field image",
    delay: 2500,
    autoplay: true,
    onChange: (index, count) => {
      document.querySelector(".atlas-head span:first-child").textContent =
        `On site · ${index + 1} of ${count}`;
    },
  });
  window.irisAtlas = atlas.next;
  window.irisAtlasPause = atlas.toggle;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) atlas.pause();
    else if (document.body.dataset.route === "home") atlas.play();
  });
  reduceMotion.addEventListener("change", () => {
    atlas.pause();
    updateHeader();
  });

  const team = [
    ["Nikhil Saini", "Founder & CEO", "nikhil.png"],
    ["Deep Kumar", "Co-founder & CTO", "deepkummar.png"],
    [
      "Manjeet Singh Dhillon",
      "Former chairman · Ganga Flood Control Commission",
      "manjeet_dhillon.png",
    ],
    ["Saumya J. Verma", "Business development", "saumya.png"],
    ["Aditya Raj", "Business analyst", "adityaraj.png"],
    ["Ashish", "Project manager", "ashish.png"],
    ["Hitesh", "Lead survey expert", "hitesh.png"],
    ["Piyush", "AI division · Technical lead", "piyush.jpeg"],
    ["Vikas", "Surveyor", "vikas.png"],
    ["Arko", "UI/UX & content", "arko.jpeg"],
    ["Lakshay", "Machine learning intern", "lakshay.jpeg"],
    ["Parth", "Machine learning intern", "parth.jpeg"],
    ["Sahil", "MLE intern", "sahil.jpeg"],
  ];
  const teamGrid = document.querySelector("#team-grid");
  team.forEach(([name, role, photo]) => {
    const article = document.createElement("article");
    article.className = "person-row";
    const portrait = document.createElement("div");
    portrait.className = "person-portrait";
    const image = document.createElement("img");
    image.src = `assets/team/${photo}`;
    image.alt = name;
    image.loading = "lazy";
    image.width = 240;
    image.height = 300;
    const imageButton = document.createElement("button");
    imageButton.type = "button";
    imageButton.className = "image-open";
    imageButton.setAttribute("aria-label", `Enlarge portrait of ${name}`);
    imageButton.addEventListener("click", () =>
      window.irisPreviewImage(imageButton),
    );
    imageButton.append(image);
    portrait.append(imageButton);
    const copy = document.createElement("div");
    copy.className = "person-copy";
    const heading = document.createElement("h3");
    heading.textContent = name;
    const designation = document.createElement("span");
    designation.className = "member-role";
    designation.textContent = role;
    copy.append(heading, designation);
    article.append(portrait, copy);
    teamGrid.append(article);
  });

  // One native modal owns inspection of photographs and technical source imagery.
  const imageViewer = document.querySelector("#image-viewer");
  const viewerPhoto = document.querySelector("#image-viewer-photo");
  let viewerOpener;
  window.irisPreviewImage = (button) => {
    const image = button.querySelector("img");
    if (!image) return;
    viewerOpener = button;
    viewerPhoto.src = image.currentSrc || image.src;
    viewerPhoto.alt = image.alt;
    viewerPhoto.width = image.naturalWidth || image.width;
    viewerPhoto.height = image.naturalHeight || image.height;
    document.querySelector("#image-viewer-caption").textContent = image.alt;
    imageViewer.classList.toggle("team-photo-viewer", Boolean(button.closest("#team")));
    imageViewer.showModal();
  };
  window.irisCloseImage = () => imageViewer.close();
  imageViewer.addEventListener("click", (event) => {
    if (event.target !== imageViewer) return;
    const bounds = imageViewer.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      imageViewer.close();
  });
  imageViewer.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      imageViewer.querySelector(".image-viewer-close").focus();
    }
  });
  imageViewer.addEventListener("close", () => {
    viewerPhoto.removeAttribute("src");
    if (viewerOpener?.isConnected && !viewerOpener.closest(".page")?.hidden)
      viewerOpener.focus({ preventScroll: true });
  });

  const appPanel = document.querySelector("#application-panel");
  const form = document.querySelector("#application-form");
  const roleInput = document.querySelector("#app-role");
  const roleLabel = document.querySelector("#application-role-label");
  const applyButtons = [...document.querySelectorAll(".apply-button")];
  let activeApplyButton;
  window.irisApply = (button) => {
    activeApplyButton = button;
    appPanel.hidden = false;
    applyButtons.forEach((item) =>
      item.setAttribute("aria-expanded", String(item === button)),
    );
    roleInput.value = button.dataset.role;
    roleLabel.textContent = button.dataset.role;
    document.querySelector("#form-success").hidden = true;
    appPanel.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    document.querySelector("#app-name").focus({ preventScroll: true });
  };
  window.irisCloseApplication = () => {
    appPanel.hidden = true;
    applyButtons.forEach((button) =>
      button.setAttribute("aria-expanded", "false"),
    );
    activeApplyButton?.focus();
  };

  const resume = document.querySelector("#resume");
  const uploadZone = document.querySelector("#upload-zone");
  const fileSummary = document.querySelector("#file-summary");
  const fileName = document.querySelector("#file-name");
  const resumeError = document.querySelector("#resume-error");
  let selectedFile = null;
  function validateFile(file) {
    if (!file) return "Add your resume in PDF, DOC, or DOCX format.";
    if (!/\.(pdf|doc|docx)$/i.test(file.name))
      return "Choose a PDF, DOC, or DOCX file.";
    if (file.size === 0) return "The selected file is empty.";
    if (file.size > 5 * 1024 * 1024)
      return "The resume must be no larger than 5 MB.";
    return "";
  }
  function setFile(file) {
    const error = validateFile(file);
    resumeError.textContent = error;
    resume.setAttribute("aria-invalid", String(Boolean(error)));
    selectedFile = error ? null : file;
    fileSummary.hidden = Boolean(error);
    if (error) {
      resume.value = "";
      return;
    }
    fileName.textContent = `${file.name} · ${Math.max(1, Math.round(file.size / 1024))} KB`;
    document.querySelector("#form-success").hidden = true;
  }
  resume.addEventListener("change", () => setFile(resume.files[0]));
  ["dragenter", "dragover"].forEach((type) =>
    uploadZone.addEventListener(type, (event) => {
      event.preventDefault();
      uploadZone.classList.add("dragging");
    }),
  );
  ["dragleave", "drop"].forEach((type) =>
    uploadZone.addEventListener(type, (event) => {
      event.preventDefault();
      uploadZone.classList.remove("dragging");
    }),
  );
  uploadZone.addEventListener("drop", (event) => {
    const file = event.dataTransfer.files[0];
    if (file) setFile(file);
  });
  window.irisRemoveFile = () => {
    selectedFile = null;
    resume.value = "";
    fileSummary.hidden = true;
    resumeError.textContent = "";
    resume.removeAttribute("aria-invalid");
    document.querySelector("#form-success").hidden = true;
    resume.focus();
  };

  const rules = {
    "app-name": (value) =>
      value.trim().length >= 2 ? "" : "Enter your full name.",
    "app-email": (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? ""
        : "Enter a valid email address.",
    "app-phone": (value) =>
      value.replace(/\D/g, "").length >= 8 ? "" : "Enter a valid phone number.",
    "app-address": (value) =>
      value.trim().length >= 2 ? "" : "Enter your current city.",
    "app-link": (value) =>
      !value.trim() || /^https?:\/\//i.test(value.trim())
        ? ""
        : "Use a complete link beginning with http:// or https://.",
  };
  function validateField(field) {
    const error = rules[field.id](field.value);
    const errorNode = document.getElementById(
      `${field.id.replace("app-", "")}-error`,
    );
    errorNode.textContent = error;
    field.setAttribute("aria-invalid", String(Boolean(error)));
    return !error;
  }
  Object.keys(rules).forEach((id) => {
    const field = document.getElementById(id);
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });
  form.addEventListener("input", () => {
    document.querySelector("#form-success").hidden = true;
  });
  form.querySelectorAll("textarea").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + 2}px`;
    });
  });
  const toast = document.querySelector("#toast");
  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 5000);
  }
  let openingDraft = false;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (openingDraft) return;
    const fields = Object.keys(rules).map((id) => document.getElementById(id));
    const fieldsValid = fields.map(validateField).every(Boolean);
    const fileError = validateFile(selectedFile);
    resumeError.textContent = fileError;
    resume.setAttribute("aria-invalid", String(Boolean(fileError)));
    if (!fieldsValid || fileError) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      firstInvalid?.focus();
      firstInvalid?.scrollIntoView({
        behavior: scrollBehavior(),
        block: "center",
      });
      return;
    }
    const value = (id) => document.getElementById(id).value.trim();
    const subject = `Application — ${value("app-role")} — ${value("app-name")}`;
    const body = [
      "Hello Iris Aerial careers team,",
      "",
      `I would like to apply for ${value("app-role")}.`,
      "",
      `Name: ${value("app-name")}`,
      `Email: ${value("app-email")}`,
      `Phone: ${value("app-phone")}`,
      `Current city: ${value("app-address")}`,
      value("app-link") ? `LinkedIn / portfolio: ${value("app-link")}` : "",
      value("app-note")
        ? `What I would like to build at Iris Aerial: ${value("app-note")}`
        : "",
      "",
      `Resume selected on the website: ${selectedFile.name}`,
      "Please attach the résumé file to this email before sending.",
    ].join("\n");
    const mailLink = `mailto:careers@irisaerial.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.querySelector("#career-email-fallback").href = mailLink;
    const success = document.querySelector("#form-success");
    success.hidden = false;
    success.scrollIntoView({ behavior: scrollBehavior(), block: "nearest" });
    showToast(
      "Your application email is ready. Attach your résumé before sending.",
    );
    const submit = form.querySelector('[type="submit"]');
    openingDraft = true;
    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    setTimeout(() => {
      window.location.href = mailLink;
    }, 120);
    setTimeout(() => {
      openingDraft = false;
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
    }, 1200);
  });

  document.querySelector("#year").textContent = new Date().getFullYear();
  openHash({ focus: false });
})();


/* ---------------------------------------------------------------------------
   Flight plan: the animated drone mission in the Solutions call to action.
   Styles live in the Solutions stylesheet under "flight plan".
   The drone takes off from the first point, flies the survey lines, pauses at
   each waypoint to light up one workflow stage, then lands and stops.
   Stage names are read from the workflow section on the page, so the two
   always match. Plays once, the first time the card scrolls into view.
   --------------------------------------------------------------------------- */
(() => {
  const host = document.querySelector("#solutions .solutions-project-fit .shell");
  if (!host || host.querySelector(".fit-flight")) return;

  const fallback = ["Frame", "Control", "Acquire", "Model", "Deliver"];
  const found = [
    ...document.querySelectorAll("#solutions .chain-stop .stop-card strong"),
  ].map((el) => el.textContent.trim());
  const names = found.length === 5 ? found : fallback;

  // Each stop: where it is on the route, and where its label sits.
  const stops = [
    { x: 82, y: 84, lx: 124, ly: 66, anchor: "start", cls: "ff-start" },
    { x: 353, y: 93, lx: 338, ly: 98, anchor: "end" },
    { x: 87, y: 153, lx: 103, ly: 157, anchor: "start" },
    { x: 359, y: 185, lx: 344, ly: 190, anchor: "end" },
    { x: 106, y: 222, lx: 148, ly: 247, anchor: "start", cls: "ff-end" },
  ];
  const route =
    "M82 84 L338 70 Q352 69 353 83 L354 102 Q355 116 341 117 L100 130 " +
    "Q86 131 87 145 L88 162 Q89 176 103 175 L344 162 Q358 161 359 175 " +
    "L360 194 Q361 208 347 209 L106 222";

  const stopMarkup = stops
    .map(
      (s, i) => `
      <g class="ff-stop ${s.cls || ""}">
        <circle class="ff-ring" cx="${s.x}" cy="${s.y}" r="10"></circle>
        <circle class="ff-dot" cx="${s.x}" cy="${s.y}" r="5"></circle>
        <text class="ff-label" x="${s.lx}" y="${s.ly}" text-anchor="${s.anchor}"><tspan>0${i + 1}</tspan> ${names[i]}</text>
      </g>`,
    )
    .join("");

  const figure = document.createElement("div");
  figure.className = "fit-flight";
  figure.setAttribute("aria-hidden", "true");
  figure.innerHTML = `
    <svg viewBox="0 0 420 300" xmlns="http://www.w3.org/2000/svg">
      <path class="ff-area" d="M38 46 L372 28 L392 252 L58 272 Z"></path>
      <g class="ff-corner">
        <rect x="33" y="41" width="10" height="10"></rect>
        <rect x="367" y="23" width="10" height="10"></rect>
        <rect x="387" y="247" width="10" height="10"></rect>
        <rect x="53" y="267" width="10" height="10"></rect>
      </g>
      <path class="ff-plan" d="${route}"></path>
      <path class="ff-flown" d="${route}"></path>
      ${stopMarkup}
      <g class="ff-drone" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 19L41 41M41 19L19 41" stroke="#fff" stroke-width="7"></path>
        <path d="M19 19L41 41M41 19L19 41" stroke="#17485f" stroke-width="4"></path>
        <g fill="#0a293b" stroke="#42d2e7" stroke-width="2">
          <g transform="rotate(-35 13 13)"><ellipse class="ff-rotor" cx="13" cy="13" rx="10" ry="5"></ellipse></g>
          <g transform="rotate(35 47 13)"><ellipse class="ff-rotor" cx="47" cy="13" rx="10" ry="5"></ellipse></g>
          <g transform="rotate(35 13 47)"><ellipse class="ff-rotor" cx="13" cy="47" rx="10" ry="5"></ellipse></g>
          <g transform="rotate(-35 47 47)"><ellipse class="ff-rotor" cx="47" cy="47" rx="10" ry="5"></ellipse></g>
        </g>
        <path d="M23 23Q30 18 37 23L36 36Q30 41 24 36Z" fill="#fff" stroke="#17485f" stroke-width="2"></path>
        <path d="M26 25H34M27 29H33" stroke="#086582" stroke-width="2"></path>
        <circle cx="30" cy="36" r="3" fill="#0a293b" stroke="#42d2e7" stroke-width="1.5"></circle>
      </g>
    </svg>`;
  host.append(figure);

  const flown = figure.querySelector(".ff-flown");
  const drone = figure.querySelector(".ff-drone");
  const stopEls = [...figure.querySelectorAll(".ff-stop")];
  const total = flown.getTotalLength();

  // Find how far along the route each stop sits.
  const marks = stops.map((s) => {
    let best = 0;
    let bestGap = Infinity;
    for (let d = 0; d <= total; d += 1) {
      const p = flown.getPointAtLength(d);
      const gap = Math.hypot(p.x - s.x, p.y - s.y);
      if (gap < bestGap) {
        bestGap = gap;
        best = d;
      }
    }
    return best;
  });
  marks[0] = 0;
  marks[marks.length - 1] = total;

  flown.style.strokeDasharray = `${total} ${total}`;

  function place(distance) {
    const p = flown.getPointAtLength(distance);
    drone.setAttribute(
      "transform",
      `translate(${p.x} ${p.y}) scale(1.15) translate(-30 -30)`,
    );
    flown.style.strokeDashoffset = total - distance;
  }
  function reach(index) {
    stopEls[index].classList.add("is-reached");
  }
  function finish() {
    place(total);
    stopEls.forEach((el) => el.classList.add("is-reached"));
    figure.classList.remove("is-flying");
  }

  place(0);

  const SPEED = 190; // route units per second
  const PAUSE = 550; // milliseconds spent at each waypoint
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

  function fly() {
    let leg = 0;
    let legStart = null;
    reach(0);
    figure.classList.add("is-flying");

    function frame(now) {
      if (legStart === null) legStart = now + PAUSE; // hold at the stop first
      const from = marks[leg];
      const to = marks[leg + 1];
      const duration = ((to - from) / SPEED) * 1000;
      const t = Math.min(Math.max((now - legStart) / duration, 0), 1);
      place(from + (to - from) * ease(t));
      if (t === 1) {
        leg += 1;
        reach(leg);
        legStart = null;
        if (leg === marks.length - 1) {
          // Landed: rotors wind down and the drone stays put.
          setTimeout(() => figure.classList.remove("is-flying"), 350);
          return;
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finish();
    return;
  }
  const watcher = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      watcher.disconnect();
      fly();
    },
    { threshold: 0.6 },
  );
  watcher.observe(figure);
})();
