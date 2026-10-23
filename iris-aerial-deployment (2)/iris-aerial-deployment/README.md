# Iris Aerial Innovations website

Deployment-ready static website for Iris Aerial Innovations Pvt. Ltd.

## Project contents

- `index.html` — website content and page markup.
- `styles.css` — shared design tokens, navigation, forms, image viewer, and responsive shell.
- `pages.css` — distinct page compositions, typography roles, media geometry, and finite motion.
- `team.css` — route-scoped scrapbook styling, portrait frames, responsive album and accessible motion for Team.
- `site.js` — hash navigation and page transitions, the Home gallery, team directory, and careers email form.
- `motion.css` — the motion layer: client marquee, scroll reveals, and the Akshaa / team / careers treatments.
- `motion.js` — progressive enhancement for that layer. Every block checks for its own markup and exits quietly if absent.
- `character.css` / `character.js` — the character pass: the topographic contour motif, hero instrument readout, live counters, magnetic buttons, tilting cards and image wipes.
- `assets/` — brand artwork, client marks, case-study imagery, Akshaa visuals, team photography, and the home hero clip (`home_video/home-hero.mp4`, cut from 21:14 to 21:48 of the supplied footage).
- `DESIGN.md` — the maintained visual and interaction guidelines for future edits.

The site has no package dependencies and does not require a build command.

## Preview locally

From this folder, run:

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Deploy

Upload the contents of this folder to the public root of any static host.

- Netlify: drag this folder into Netlify Drop, or choose it as the publish directory.
- Vercel: import the folder as an “Other” framework project, leave the build command empty, and use `.` as the output directory.
- GitHub Pages: place these files at the repository root and publish from the root branch directory.
- Apache/Nginx/cPanel: upload `index.html`, `styles.css`, `pages.css`, `motion.css`, `character.css`, `site.js`, `motion.js`, `character.js`, and `assets/` together to the public web directory.

Navigation uses URL hashes such as `#akshaa`, `#team`, and `#careers`, so no server rewrite rules are required.

## Careers email workflow

Career applications open a pre-addressed email draft to `careers@irisaerial.in` after local validation. Browser security prevents a website from silently attaching a local résumé to an email draft, so applicants are clearly prompted to attach the selected résumé before sending.

For fully automatic résumé uploads and server-side email delivery, connect the form to a secure hiring endpoint or approved form service before changing this behaviour.

## Main contact addresses

- General enquiries: `info@irisaerial.in`
- Careers: `careers@irisaerial.in`
- Global enquiries: `global@irisaerial.in`

## Current design

The company pages use cobalt blue, navy and white. Akshaa has its own green/black palette. All company headings use Barlow, body and controls use Source Sans 3, and Akshaa headings use Space Grotesk. Fonts are locally hosted.

Home opens with a manually controllable, automatically transitioning image carousel ahead of the centered video hero, followed by a compact enterprise trust bar with three concise, inline-icon reasons, the Akshaa teaser and a client-logo strip immediately above the contact section. Solutions has a sector catalogue; Technology has a method catalogue. Both support direct section fragments. Team pairs an informal introduction and a candid six-photo grid with an aligned portrait directory. Careers uses monochrome job panels with native role disclosures and a locally validated email-draft form. Image buttons open the complete source in a keyboard-accessible viewer. Page changes and selected scroll sections use restrained entrance transitions; decorative motion respects reduced-motion preferences.

Decorative motion remains enabled by default and respects the visitor's operating-system reduced-motion preference.

One Akshaa infrastructure position awaits an additional supplied image. The markup uses `data-photo-slot` to identify it.

`browser-validation.json` records the latest browser checks, and `premium-audit.json` records the static design audit. All six routes are checked at desktop, tablet and phone widths, with navigation, job disclosures, form validation, galleries and image inspection exercised.

## October 23 Team redesign

Team now has a cobalt scrapbook hero using all six fun_team images, the unchanged 13-person directory, and a 17-image photo album using every remaining picture in team. All images use the existing accessible viewer. team-browser-validation.json records desktop, tablet, 390px and 320px checks, keyboard viewer behavior, reduced motion and route navigation. team-premium-audit.json contains three existing Home-carousel static findings; runtime checks confirm all three controls work. DESIGN.md lint passes without errors or warnings.
