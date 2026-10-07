# Iris Aerial Innovations website

Deployment-ready static website for Iris Aerial Innovations Pvt. Ltd.

## Project contents

- `index.html` — website content and page markup.
- `styles.css` — shared design tokens, navigation, forms, image viewer, and responsive shell.
- `pages.css` — distinct page compositions, typography roles, media geometry, and finite motion.
- `site.js` — hash navigation, the Home gallery, team directory, and careers email form.
- `motion.css` — the motion and character layer: drone cursor, client marquee, scroll reveals, and the Akshaa / team / careers treatments.
- `motion.js` — progressive enhancement for that layer. Every block checks for its own markup and exits quietly if absent.
- `character.css` / `character.js` — the character pass: the topographic contour motif, hero instrument readout, live counters, magnetic buttons, tilting cards, image wipes and the drone cursor's survey marker.
- `assets/` — brand artwork, client marks, case-study imagery, Akshaa visuals, and team photography.
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

Home uses a full-width field photograph, a manual gallery and a blue service bar. Solutions has a sector catalogue; Technology has a method catalogue. Both offer section jump links and support direct section fragments. Team uses a wide lead photograph, a six-position culture grid and an aligned portrait directory. Careers uses monochrome job panels with native role disclosures and a locally validated email-draft form. Image buttons open the complete source in a keyboard-accessible viewer. There are no flight effects, custom cursors or entrance animations.

Two of the six central Team photo positions and one Akshaa infrastructure position await additional supplied images. The markup uses `data-photo-slot` to identify these positions.

`browser-validation.json` records the latest browser checks, and `premium-audit.json` records the static design audit. All six routes are checked at desktop, tablet and phone widths, with navigation, job disclosures, form validation, galleries and image inspection exercised.
