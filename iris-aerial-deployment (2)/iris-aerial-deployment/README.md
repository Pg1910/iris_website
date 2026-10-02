# Iris Aerial Innovations website

Deployment-ready static website for Iris Aerial Innovations Pvt. Ltd.

## Project contents

- `index.html` — complete website markup, styling, navigation, animations, and form behaviour.
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
- Apache/Nginx/cPanel: upload `index.html` and `assets/` together to the public web directory.

Navigation uses URL hashes such as `#akshaa`, `#team`, and `#careers`, so no server rewrite rules are required.

## Careers email workflow

Career applications open a pre-addressed email draft to `careers@irisaerial.in` after local validation. Browser security prevents a website from silently attaching a local résumé to an email draft, so applicants are clearly prompted to attach the selected résumé before sending.

For fully automatic résumé uploads and server-side email delivery, connect the form to a secure hiring endpoint or approved form service before changing this behaviour.

## Main contact addresses

- General enquiries: `info@irisaerial.in`
- Careers: `careers@irisaerial.in`
- Global enquiries: `global@irisaerial.in`
