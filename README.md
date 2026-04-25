# QuoteGate (Single-file reset)

This repository has been reset to a **single-file QuoteGate app**.

## What this reset means
- The app is now `index.html` only.
- All HTML, CSS, and JavaScript are inline in that one file.
- No React, Vite, Next.js, Prisma, backend, or build tooling is required.
- No build step is required.

## Run locally
Open `index.html` directly in a browser.

## GitHub Pages deployment
This repo includes a GitHub Actions workflow at:
- `.github/workflows/deploy.yml`

Recommended setting:
- **Settings → Pages → Source → GitHub Actions**

Legacy alternative:
- main/root branch deploy can work, but GitHub Actions is recommended.

## Test URLs
Replace placeholders with your repo:
- `https://USERNAME.github.io/REPO_NAME/`
- `https://USERNAME.github.io/REPO_NAME/version.txt`

## If old app still appears
1. Open `version.txt` first.
2. If version says QuoteGate, deployment is new and browser cache is stale.
3. Clear browser site data and unregister service workers.
4. Android Chrome: Site settings → Storage → Clear data.
5. Try incognito/private mode.
6. Add `?fresh=20260425` to URL.
