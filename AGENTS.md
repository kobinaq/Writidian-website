<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a frontend-only Next.js (App Router) marketing site — no backend, database, or external services. Dependencies are installed by the startup update script (`npm install`).

- Dev server: `npm run dev` (Next 16 with Turbopack) serves on `http://localhost:3000`. Standard scripts are in `package.json` (`dev`, `build`, `start`, `lint`).
- Lint (`npm run lint`) currently reports pre-existing issues in `components/nav.tsx` (a `react-hooks/set-state-in-effect` error) and `lib/ambient-audio.ts` (an unused-var warning); these exist on `main` and are unrelated to environment setup.
- The primary CTA links out to the external app at `https://app.writidian.com` — leaving the site is expected behavior, not a bug.
