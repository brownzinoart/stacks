# Deploying Stacks to Vercel

This project is a Next.js 15 app in the `stacks-app` subfolder. Vercel will auto-detect Next.js; the only non-default setting is the project root.

## 1) Connect GitHub → Vercel
- In Vercel, click `New Project` → `Import Git Repository` and pick `brownzinoart/stacks`.
- In “Root Directory”, select `stacks-app/` (important for monorepo).
- Framework preset should auto-select `Next.js`.

## 2) Build settings
- Install command: `npm ci`
- Build command: `npm run build`
- Output: Managed by Next.js (no manual setting required)
- Node.js: 20.x (this repo’s `package.json` sets `engines.node` to `20.x`).

## 3) Environment variables
Add the following in Project Settings → Environment Variables and apply to `Production` and `Preview`:
- `NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY`
- `NEXT_PUBLIC_NYT_API_KEY`

These keys are browser-exposed (NEXT_PUBLIC_ prefix), so use non-sensitive values.

## 4) First deploy
- Click `Deploy`. The build should complete in ~1–2 minutes.
- Preview URL will be created for each PR/branch; Production deploys from your chosen branch (typically `main` or `master`).

## 5) Optional improvements
- Add a Production Domain in Vercel → `Domains`.
- Enable GitHub checks for Preview deployments.
- (Optional) Install Vercel CLI locally: `npm i -g vercel`, then `vercel link` to link the project.

## Troubleshooting
- If Vercel picks the wrong directory, set `Root Directory` to `stacks-app` in Project Settings.
- If images from OpenLibrary don’t load, ensure `covers.openlibrary.org` is allowed in `next.config.js` (already configured).
- Missing env vars will degrade external API features (Google Books / NYT); add keys and redeploy.

