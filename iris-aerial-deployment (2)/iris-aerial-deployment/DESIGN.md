---
version: alpha
colors:
  ink: "#14243b"
  deep: "#081d36"
  primary: "#1959d1"
  primaryHover: "#163f78"
  focus: "#1249af"
  accent: "#a8ccff"
  surface: "#ffffff"
  surfaceSecondary: "#f3f6fb"
  textSecondary: "#58677c"
  border: "#dce3ed"
  onDark: "#d8e3f4"
  darkBorder: "#3e5575"
  flagshipInk: "#10251d"
  flagshipSurface: "#162e24"
  flagshipGreen: "#28583d"
  flagshipLime: "#a0e66d"
  flagshipText: "#c5d4c9"
  flagshipBorder: "#3b5848"
  success: "#21634e"
  danger: "#b42318"
typography:
  display:
    fontFamily: '"Barlow", "Segoe UI", sans-serif'
    fontWeight: 600
    lineHeight: 1.06
  body:
    fontFamily: '"Source Sans 3", "Segoe UI", sans-serif'
    fontSize: 18px
    lineHeight: 1.6
  technical:
    fontFamily: '"Space Grotesk", "Segoe UI", sans-serif'
    fontWeight: 500
    lineHeight: 1.12
rounded:
  control: 8px
  button: 6px
  card: 8px
spacing:
  sectionDesktop: 96px
  sectionMobile: 56px
  desktopGutter: 56px
  mobileGutter: 20px
---

# Iris Aerial design context

## Overview

Iris is an Indian survey, engineering and geospatial technology company. The website serves infrastructure clients, public-sector and enterprise project teams, prospective employees, and Akshaa users. It is an English-language marketing site with six hash routes and a locally validated application-email workflow. It is not an admin application.

The current October 7 request is the controlling visual direction: the company website is blue; only Akshaa uses green and black. The user rejected the previous collection of oversized slogans, mixed heading fonts, decorative labels and shaped photography. This refinement uses direct headings, a measured type scale and actual survey and team images. Photography, project facts and clear information hierarchy provide the character.

The user rejected the previous restrained split-screen direction as too flat. The new visual signature is a full-width field photograph on Home, with a protected navy reading area and a cobalt service-navigation bar. Interior pages now have distinct compositions: service and technology catalogues, a wide team photograph, and monochrome careers panels. Shared typography, spacing and controls connect them. Akshaa retains its green/black opening and complete technical imagery.

## Colors

The company palette has six principal roles: navy #081d36, cobalt #1959d1, sky accent #a8ccff, white #ffffff, pale blue #f3f6fb and slate #58677c. Dark ink #14243b carries text. Bright accents are used on dark surfaces. Cobalt is sufficiently dark for headings and links on white.

Akshaa uses deep green #10251d, a secondary green-black surface #162e24 and lime #a0e66d. Its headings, controls, lower sections and route-aware shared footer use this identity. The light shared header uses a darker green #28583d for accessible links. No other route uses green or purple as a brand theme. Semantic success/error colors remain available to forms.

Runtime ownership is **Model B**: `styles.css :root` is the canonical token source. `pages.css` owns composition and consumes these values. There is no generated or independent theme system.

| Document role   | Canonical CSS token                                                              | Consumers                                    |
| --------------- | -------------------------------------------------------------------------------- | -------------------------------------------- |
| Ink             | `--ink`                                                                          | Company headings and body labels             |
| Navy            | `--navy`                                                                         | Home hero, Solutions enquiry, shared footer  |
| Brand action    | `--cyan`, `--cyan2`, `--navy2`                                                   | Buttons, links, focus and hover              |
| Light accent    | `--accent`                                                                       | Dark-surface focus and controls              |
| Light surfaces  | `--paper`, `--white`, `--mist`                                                   | Main content and supporting sections         |
| Secondary text  | `--muted`, `--on-dark`                                                           | Descriptions, captions and dark-surface copy |
| Borders         | `--line`, `--dark-line`                                                          | Media, rows, forms and dark surfaces         |
| Product palette | `--ak-ink`, `--ak-surface`, `--ak-green`, `--ak-lime`, `--ak-muted`, `--ak-line` | Akshaa route aliases                         |
| Semantic states | `--success`, `--danger`                                                          | Careers validation and draft feedback        |

The original token names `--cyan` and `--cyan2` now resolve to blue. Do not introduce separate hard-coded blues to compensate for the historical names. `--people-surface` is an alias of `--mist` for compatibility.

Global scrollbars use `--scroll-thumb`, `--scroll-track`, `--scroll-hover`, and `--scroll-active`. They remain visible. Forced colors use system styling.

## Typography

- Barlow 600 owns all company headings, including profiles and jobs. Desktop page titles are 60–76px; phone titles are 40–48px. Section headings are 32–46px and article headings 25–34px. Tracking is restrained and phrases wrap naturally.
- Source Sans 3 owns body text, actions, form labels and captions. Body copy is 17–20px, with a larger 22–24px opening paragraph in About Iris. It uses comfortable line lengths and a 1.6 line height.
- Space Grotesk 500 is reserved for Akshaa headings. Its product introduction is 44–66px.
- No serif inserts, ornamental italics, mixed-font phrases, artificially split words or decorative small headings. Headings describe their section without slogan pairs. Do not add numbered labels unless they describe a real ordered workflow.

Fonts are locally hosted in `assets/fonts/` with their licenses. Barlow and Source Sans 3 are preloaded. Paragraphs have comfortable line lengths and 1.6–1.65 line height. Long company or project names wrap naturally. Text is left aligned.

## Layout

The shared maximum content width is 1240px. Geometry is owned by `--content`, `--gutter`, `--section-space` and `--header`. Desktop gutters are 56px, falling to 40px and 32px, then 20px on phones. Desktop sections use 96px vertical space; phones use 56px. The desktop header is 84px, tablet 80px and phone 76px. Navigation changes to a mobile disclosure at 1000px.

- Home: a full-width photographic opening with a navy contrast overlay and manual field carousel; blue service links; static client marks; plain About Iris and vision/mission; one wide featured project followed by two paired projects; the three-stage survey workflow; imagery-analysis preview; contact details.
- Solutions: white introduction with cobalt title and field photograph; sector jump links; one wide railway-survey case and four paired service panels; the five-stage survey sequence; project evidence and case-study download; a cobalt enquiry section.
- Akshaa: its green/black opening with supplied logo and detection collage; sticky area navigation; framed, fully contained infrastructure evidence; defence comparisons and human review. The previous offset lime image shadow is removed.
- Technology: a restrained aircraft introduction and method jump links; four methods in a two-column catalogue, with GIS/AI spanning the final row. Each has concise, consistently styled copy and contained media. GPR and Hydrography remain absent.
- Team: a title/description introduction above one wide group photograph; six equal 4:3 culture positions, including two reserved for upcoming images; three larger initial profiles followed by a four-column directory. Two-column portraits on phones.
- Careers: a company exhibition photograph beside a cobalt page title; monochrome bordered job panels with native role disclosures, clear Apply actions and a sticky introduction on desktop; the existing email-draft application form, which asks for current city.

At narrow widths, split layouts stack in reading order, jobs retain their Apply action, team portraits become two columns, and technical evidence remains fully visible. Reserved photo positions have no fake image, upload action or invented project caption. The Akshaa infrastructure gallery has one reserved additional image position.

## Elevation & Depth

Hierarchy comes from large field imagery, a consistent heading family, white/pale/cobalt/navy sections and purposeful catalogue panels. No image arches, circles, floating photo piles, ambient orbit art, ornamental grids or drop-shadow cards. The Home contrast overlay protects the text while showing the actual field site. Shared photo controls and the image dialog are functional affordances.

## Shapes

Media, fields and catalogue panels use an 8px radius; buttons use 6px. Portraits remain rectangular. Gallery dots are circular controls. Evidence uses `object-fit: contain`; field photographs use deliberate crops and remain available in the image viewer.

## Components

Navigation uses six hash routes, current-route links, route titles and heading focus. Section fragments resolve their owning route when opened directly. Solutions and Technology expose section jump links. On mobile, closed navigation is inert; open navigation makes main/footer inert. Escape closes it and restores toggle focus. Switching to desktop resets menu state.

Actions use the same labels and emphasis everywhere. Company primary actions are blue, while actions on navy can use white. Akshaa actions use lime on dark green. Keyboard focus is visible and dark-surface contrast is preserved.

The Home field gallery starts paused. Previous/next, selection dots and optional Play/Pause controls remain available. Arrow keys select while a gallery control has focus; manual changes are announced. The Team introduction uses a static lead photograph so its six-photo culture grid does not repeat a second carousel. There are no entrance reveals, hero parallax, flight effects, custom cursors, automatic logo motion or rocket animation. Content appears immediately. Reduced-motion preference disables nonessential shared transitions and pauses the field gallery.

The shared image viewer is a native modal with a complete image, descriptive caption, close control, Escape behavior, background isolation and focus restoration. Do not replace it with separate per-page overlays.

The careers form validates locally and prepares an email draft. It never claims to send an application. The selected role is carried into the form. The résumé picker accepts non-empty PDF/DOC/DOCX files up to 5MB and supports removal. Applicants must attach the selected résumé in their email app. Preserve input after validation errors and focus the first invalid field. The form is not a backend upload flow.

## Motion

Motion lives in `motion.css` and `motion.js` so the base layout stays readable without either. The rules:

- **Drone cursor.** On Home only, with a fine pointer and no reduced-motion preference, the pointer becomes a small survey quad that trails the cursor, banks into its direction of travel and raises a scan ring over anything clickable. It is never the only cue for an interactive element.
- **Home gallery.** Cross-fades every 2.5s with a slow drift on the active frame and a hairline progress bar. Hovering or tabbing into the gallery holds the frame; the existing Play/Pause control still owns the reel.
- **Client rail.** One continuous right-to-left run built from the original logo set plus an `aria-hidden` clone. Hover or focus pauses it. Under reduced motion the clone is dropped and the rail scrolls by hand instead.
- **Scroll reveal.** Figures and cards rise into place once, with a short stagger inside each group and a 2.5s settle on the image itself. The hiding attribute is applied by script, so content is always visible if the script does not run.
- **Everything decorative stops under `prefers-reduced-motion: reduce`** — drone, confetti, starfield, orbit, progress bar and reveals — while colour, layout and hierarchy stay exactly as they are.

The reveal pass must never strand content at `opacity: 0`. The hiding attribute is applied by script, and the re-check runs off a timer plus `visibilitychange`, never `requestAnimationFrame` — a background tab pauses the rendering loop, which also suspends IntersectionObserver delivery, so a frame-based fallback would never arrive.

`.hero` and `.project-atlas` both carry `overflow: hidden`. The gallery scales its active frame, and without clipping on both boxes the drifting image spills past the hero and lands on top of the service rail below it.

Easing values are written out at each use rather than pulled from a custom property: `animation` and `transition` are comma-separated, so a `var()` holding a `cubic-bezier(...)` is fragile there.

## The contour motif

`assets/texture/contours.svg` is the site's signature. It is not a decorative squiggle: a sum-of-Gaussians height field is run through marching squares to extract real isolines, with every fourth level drawn heavier as an index contour — the thing Iris actually sells, used as the ground the site sits on.

It is applied as a **mask**, not an image, so each section paints it in its own colour:

```css
.section { --contour-ink: var(--cyan); --contour-opacity: 0.07; }
```

`character.js` lists the sections that opt in and injects the layer, so the motif can be re-pointed without touching `index.html`. Keep the opacity between 0.05 and 0.12 — above that it competes with the type.

To regenerate it, change the peaks in the generator and re-run the marching-squares pass, then simplify the polylines (Ramer–Douglas–Peucker, epsilon 2) and round to integers. Unsimplified output is roughly six times the size for no visible gain.

## Character and play

The brief that produced this layer was that the site read as monotonous and machine-made. The fixes were deliberate and are worth keeping:

- **Nothing repeats at the same scale.** Oversized numerals crop off the top of each sector and method card; the About tally sets three figures at 72px against 16px body copy. A grid of equally-weighted cards is what made it feel generated.
- **Small type speaks like an instrument.** Technical kickers with survey ticks, uppercase coordinates, tabular numerals.
- **The hero is the drone's point of view.** The headline assembles word by word over the field video. The coordinate and clock readout was removed at the user's request.
- **Interactions reward poking.** Buttons lean toward the cursor, cards tip in 3D, images wipe rather than fade, and a left-click drops a survey benchmark that fades out.
- **The drone cursor flies the whole site**, not just Home — but it stands down over anything you type into, and the real caret comes back.

Two implementation notes that are easy to undo by accident:

- The tilt drives the standalone `rotate` property, never `transform`, so each card's existing hover lift keeps working alongside it.
- `.wipe` owns its own IntersectionObserver. It must never borrow the reveal pass's `in-view` flag, because not every wiped element is a reveal target and a masked image with nothing to unmask it simply never appears.

**The About tally uses user-supplied company totals:** 10+ sectors, 50+ people, 10+ client organisations. These figures describe Iris as a company, rather than the subset of sectors, portraits or client logos displayed on this site. Keep the values visible in the HTML and consistent with `initTally()` in `character.js`.

## The company blue is sky blue

The cobalt #1959d1 is retired. `motion.css` overrides the shared tokens:

- `--cyan` **#0a7ab0** — buttons, links, headings on white. 4.7:1 on white, so it clears AA for body text as well as headings.
- `--cyan2` **#065e86** — hover and pressed states. 6.9:1 on white.
- `--accent` **#8fd8f5** — accents on dark surfaces only.
- `--sky-tint` **#e8f6fd**, `--sky-line` **#bfe4f5**, `--sky-bright` **#42b9e8** — section grounds, hairlines and highlights.

Navy #081d36 stays as the dark ink: it is the ground under photography and the footer, not a theme colour. Do not reintroduce cobalt.

## Colour outside the company blue

- **Akshaa green** opens the Akshaa page and the Home Akshaa teaser, and runs through the subnav.
- **Akshaa Urban** breaks to daylight: white to pale blue, civic teal #0f7ea8, rounded cards, soft shadow. It is for planning authorities and project teams.
- **Akshaa Defence** returns to Akshaa green (#13271c → #09180f) with lime #a0e66d. Because the hue is shared with the hero, the separation from Urban is carried by everything else: dark versus daylight, 2px corners versus rounded, uppercase technical labels, scanlines, numbered phases. It is for analysts working repeat captures.
- **Pista green** (`--ak-pista` #dcebc5 → `--ak-pista-light` #edf4e2) carries the "Discuss Akshaa with our team" close-out above the site footer. Dark green `--ak-pista-ink` #203b28 and `--ak-pista-muted` #435e42 provide accessible text and button colours. `motion.css :root` owns these tokens.

The footer keeps Iris navy on every route, including Akshaa.

## Home sequence

Hero → clients → about → projects → delivery → Akshaa teaser (green) → enterprise trust (compact navy panel) → testimonials (sky tint) → contact. The trust section pairs “Precision on site. Confidence in design.” with three short promises: measured right, ready for design, and one team all the way. Navy, sky-blue survey icons and fine dividers distinguish this compact panel. Evidence columns become compact icon-led rows on phones. `pages.css` owns this composition, using shared tokens from `styles.css` and `motion.css`.

Home opens with the approved headline "Pioneering the Future with Geospatial Excellence." and the supplied survey and engineering consultancy introduction. The hero has extra copy width and responsive type to accommodate the longer text. The "Selected work" and "How we work" kickers are removed.

> **The three testimonials on Home are placeholders.** Names, roles, organisations and quotes are invented for layout. An HTML comment above the block says so. Replace every one with an approved client reference, or delete the section, before this page goes live.

## Solutions

Sectors are full-width rows that alternate: copy left / image right, then image left / copy right. The DOM order stays image-then-copy for everyone and the swap is done with grid `order`, so the reading order is unchanged when the rows stack.

"How a survey comes together" is a winding road rather than a row of columns. The SVG uses `viewBox="0 0 1200 660"` with `preserveAspectRatio="none"`, so y maps 1:1 to pixels and x simply stretches; `--road-high` and `--road-low` in CSS are the same two values the path alternates between, and the stop cards hang off them. **Their separation must exceed two card heights plus two gaps** — otherwise the above-road and below-road cards land in the same band and the alternation disappears. That is why the stop copy is capped at two short lines. Below 1100px the road is dropped for a straight vertical dashed run.

## Do's and Don'ts

- Use supplied company copy, roles, project facts, photography and contacts.
- Prefer descriptive headings such as “Survey technology” and “Selected project work.”
- Preserve source images, technical meaning and complete-image inspection.
- Do not add fake statistics, testimonials, credentials, job terms or biography.
- Avoid slogan pairs, repeated eyebrows, decorative metrics and arbitrary image shapes.
- Keep page layouts related through a shared type scale and spacing system.
- Keep design or implementation commentary out of public copy.

## Business and interaction evidence

The latest user prompt owns the blue-versus-Akshaa-green palette and broader design changes. The previous prompt owns the six team photo positions, forthcoming Akshaa imagery, About Iris / vision / mission content and role corrections. Index content, source imagery and existing contact destinations own the remaining business facts.

Team roles: Nikhil Saini — Founder & CEO; Aditya Raj — Business analyst; Ashish — Project manager; Hitesh — Lead survey expert; Vikas — Surveyor. Piyush appears before Vikas after their requested swap. Other roles are preserved.

Contact destinations: general enquiries `info@irisaerial.in`; global enquiries `global@irisaerial.in`; applications `careers@irisaerial.in`; product enquiries `akshaa@irisaerial.in`. The office address remains B-142, Sector 8, Dwarka, opposite Pathway Library, New Delhi 110077. Solutions enquiries open Home contact with a relevant email subject. Case studies remain a direct PDF download.

## Reconciliation

The renewed redesign request supersedes the earlier flat split-screen composition and small typography. It authorizes a full photographic Home opening, stronger cobalt identity, Barlow across company headings, distinct catalogue layouts, and wider Team photography. Blue remains the controlling company palette; only Akshaa is green/black. Company facts, corrected roles, reserved image positions and application-email behavior remain intact. `pages.css` is replaced as a single responsive composition system, rather than receiving another override layer.

## October 8 imagery and role update

The Team culture grid now uses all six positions: its final two photographs show office UNO (`iris_fun23.jpeg`) and the exhibition booth (`expo-booth-01.jpg`). The Urban development evidence gallery includes the supplied `_12_masked.jpg` segmentation. The subsequently added `_182157.png` aircraft detection was removed at the user’s request. The analyst-review image remains a direct gallery item. The remaining additions use the existing accessible full-image viewer and explicit source dimensions. Technology uses `lidar-uav.png` in the LiDAR method panel.

The Technology header drone runs a single 4.8-second hover-and-bank flight whenever its route opens, then rests. `motion.css` owns this effect, which uses transforms without changing layout and is disabled by reduced-motion preference. Vikas's directory title is Surveyor; `site.js` owns the directory data.

## October 8 copy, trust and culture update

The current user request supplies the company introduction, company totals and establishment year (2023). NH 154A, Aizawl and Dhansiri–Naojan descriptions are expanded consistently on Home and Solutions. Aizawl retains approximately 50 km and a minimum 200 m ROW, 100 m either side of the centreline. Dhansiri–Naojan covers aerial and ground survey for railway doubling EPC work; the repeated highway paragraph in the pasted brief is excluded from this railway description.

Team copy focuses on shared chai breaks, UNO, cricket, Holi and expo trips using existing photography. Team images reuse the shared native dialog: `site.js` sets `team-photo-viewer`, and `motion.css` adds a short photo-print bounce and backdrop fade. Reduced motion disables both effects; Escape, focus trapping and focus restoration retain the shared viewer behavior. Careers removes the four pitch badges and the Open roles kicker while preserving job disclosures and applications.

## October 8 compact trust and Akshaa close-out refinement

The user requested a shorter, sleeker enterprise section and a pista Akshaa closing section. `pages.css` owns the compact navy trust panel, shared sky accents and three evidence columns; it uses the existing Barlow/Source Sans typography and stacks at narrow widths. Copy is intentionally brief and retains verifiable survey, deliverable and team capabilities. `motion.css` replaces the violet close-out styling and removes its ambient rotating wash. The recently added bomber detection figure is removed from the Defence gallery; its source asset remains available in the project.
