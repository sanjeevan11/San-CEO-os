# QuoteGate v1 (Static PWA)

QuoteGate is a mobile-first static Progressive Web App for driveway, patio, and landscaping contractors.

## Core promise
**“Stop wasting site visits on low-budget enquiries.”**

This v1 runs fully on the client (no backend), stores demo data in `localStorage`, and deploys to GitHub Pages.

## Stack
- Vite
- React + TypeScript
- Tailwind CSS
- React Router `HashRouter` (GitHub Pages-safe routing)
- Service worker + manifest for installable PWA

## Routes
- `/#/` Marketing page
- `/#/demo` Homeowner quote flow demo
- `/#/admin` Dashboard
- `/#/admin/leads` Lead inbox
- `/#/admin/pricing` Pricing editor
- `/#/admin/settings` Settings
- `/#/admin/analytics` Analytics
- `/#/admin/export` Export/import/clear demo data

## Local run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
Outputs static files to `dist/`.

## GitHub Pages deploy
This repo uses `.github/workflows/deploy.yml`.
The workflow:
1. Installs dependencies
2. Builds Vite app
3. Uploads `dist/` as Pages artifact
4. Deploys with GitHub Pages Actions

`vite.config.ts` uses `base: '/San-CEO-os/'`, and app routing uses `HashRouter` to avoid project URL refresh 404 issues on project Pages URLs.

## PWA install instructions
1. Open deployed app in Chrome/Edge/Android browser.
2. Use browser install prompt or the **Install app** button when shown.
3. App installs with standalone display mode.
4. Offline fallback page appears if network is unavailable.

## Demo data and seed
On first load, app seeds:
- Contractor profile: **Birmingham Driveway Pros**
- Service postcodes: `B1, B2, B3, B4, B5, B11, B12, B13, B14, B15, B16, B17, B18, B19, B20, B21, B28, B29, B30, B31`
- 8 demo leads (hot/warm/poor fit mix)

## Export / backup
From `/#/admin/export`:
- Export leads as CSV
- Export full demo state as JSON
- Import JSON backup
- Clear all demo data

## Embed preview (static v1)
Use iframe embed for first static version:
```html
<iframe src="YOUR_QUOTEGATE_URL/#/demo" width="100%" height="760"></iframe>
```

## Static v1 limitations
- No backend/database
- No real authentication
- Data only in browser localStorage
- Photo uploads are demo-local only (base64/local preview)
- No real multi-tenant slug hosting yet


## Cache troubleshooting
If you still see an old app after deploy:
1. Open browser DevTools → Application → Service Workers.
2. Unregister old workers for this site.
3. Hard refresh (Ctrl/Cmd+Shift+R).
4. Verify `version.txt` on deployed URL updates after each deployment.
