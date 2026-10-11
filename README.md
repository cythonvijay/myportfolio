# Vijay Pandiselvam: Portfolio (Vercel-ready)

Static, dependency-free site (HTML/CSS/JS) with a small build step that minifies assets and fingerprints them for long-term caching.

```
src/                    ← edit these
  index.html            page markup + SEO meta + JSON-LD
  assets/style.css      all styles
  assets/app.js         scenes, animations, project / skill data
  assets/vijay.jpg|webp your photo (640×640)
  Vijay_Pandiselvam_Resume.pdf   downloadable resume (static file)
  og-image.png · favicon.svg · apple-touch-icon.png · robots.txt · sitemap.xml · 404.html
scripts/build.mjs       src → public (minify + ?v=hash cache-busting)
vercel.json             build config, security headers, caching, /resume redirect
```

## Deploy (recommended: GitHub → Vercel)
1. `git init && git add . && git commit -m "Portfolio"` then push to a new GitHub repo.
2. vercel.com → **Add New → Project** → import the repo. Settings are read from `vercel.json`
   (Install `npm install`, Build `npm run build`, Output `public`). Click **Deploy**.
3. Every push to `main` redeploys automatically; pull requests get preview URLs.

### Or with the CLI
```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production
```

## Before going live (2 minutes)
- **Set your real domain.** The placeholder `https://vijay-portfolio.vercel.app` appears in `src/index.html`
  (canonical, og:url, og:image, JSON-LD), `src/robots.txt` and `src/sitemap.xml`. Find & replace it with your
  final URL (Vercel project name, or your custom domain under *Settings → Domains*).
- Open the live link in the LinkedIn Post Inspector / any link-preview tool to confirm the social card.
- Run Lighthouse on the production URL.

## Editing content
- **Projects, technical skills, process steps**: arrays near the top of `src/assets/app.js` (`P`, `TS`, `STEPS`).
- **Internship experience** (the metro scene): the `MS` array in `src/assets/app.js`. Each entry has `name`, `short` (route-map label), `role`, `duration`, `mode`, `summary`, `points`, `tags`. The route map, LED sign and stops follow the array; if you change the count, update `STOPS` and `HW` and the stop thresholds in `metro()`.
- **Certifications** (the walking-with-a-box scene): the `<ul>` inside `.cert-box` in `src/index.html`.
- **Photo**: replace `src/assets/vijay.jpg` and `vijay.webp` (square, ~640 px).
- **Resume**: replace `src/Vijay_Pandiselvam_Resume.pdf` (keep the filename, or update the links).
- After any edit run `npm run build` (Vercel does this for you on deploy). `npm run dev` builds and serves locally at http://localhost:3000.

## What "production-ready" covers here
- **Security headers** (vercel.json): strict CSP (`script-src 'self'`, no inline scripts, Google Fonts only), HSTS, X-Content-Type-Options, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, COOP.
- **Caching**: `/assets/*` are fingerprinted and served `immutable` for 1 year; HTML always revalidates, so deploys show instantly.
- **Performance**: minified CSS/JS, WebP photo with JPG fallback, preloaded hero image, font preconnect, no third-party JS.
- **SEO**: title/description, canonical, Open Graph + Twitter card, JSON-LD `Person`, sitemap, robots, 404 page, `<noscript>` fallback with project links.
- **Accessibility**: alt text, reduced-motion support, semantic links with `rel="noopener"`.
- `/resume` and `/cv` redirect to the PDF.

## Notes
- The CSP allows `style-src-attr 'unsafe-inline'` because the animations set inline style attributes. Scripts remain strictly self-hosted.
- If you add analytics or embeds, add their hosts to the CSP in `vercel.json`.
