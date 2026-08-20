# Changelog

Dated, one-line-per-change log of what actually shipped. Newest first.

## 2026-08-20 (10)

- Added a Settings panel (new gear icon in the header) with two features: **Export/Import** (JSON file
  backup, merge-by-id on import, works immediately with no setup) and **Firebase Firestore sync** (opt-in,
  linked by a sync code, lazy-loads Firebase only when used). `mergeBooks()` backs both so neither can lose
  books. Firebase sync is scaffolded but not yet live — `FIREBASE_CONFIG` in `app.js` needs real values from
  a Firebase project before it works; see `docs/backlog.md`. Bumped `APP_VERSION` to `3`.

## 2026-08-20 (9)

- Fixed the real cause of the bottom-tab-bar-requires-scrolling bug on real mobile devices: `100dvh` alone
  doesn't track the actual usable viewport reliably on some mobile browsers. Added the standard
  `--app-height` (from `window.innerHeight`) workaround in `app.js`. Moving the badge to the tab bar
  (previous entry) did NOT fix this — that was a wrong hypothesis — so moved the badge back to its original
  top-right overlay per preference. Bumped `APP_VERSION` to `2` to confirm the fix visually.

## 2026-08-20 (8)

- Moved the version badge from a top overlay (`position: absolute`, anchored via
  `env(safe-area-inset-top)`) into the fixed tab bar as a normal flex item — the top overlay was causing a
  mobile-browser scroll quirk that crowded the bottom tab bar. Reset `APP_VERSION` to `1` now that it's
  purely cosmetic (no longer tied to cache correctness).

## 2026-08-20 (7)

- Switched `sw.js` from cache-first (required manual `CACHE_NAME`/`APP_VERSION` bumps every shell change) to
  network-first (always tries network, falls back to cache offline). Shell updates now reach the installed
  app automatically on the next load — no more bumping required. `APP_VERSION` is now purely an optional
  cosmetic label; `CACHE_NAME` is a fixed string (`"spine-shell"`). Also fixed `forceRefresh()` to
  cache-bust the reload navigation itself, not just `sw.js` and Cache Storage. See decisions.md.

## 2026-08-20 (6)

- Badge's `forceRefresh()` and the boot-time registration now both pass `updateViaCache: "none"` to
  `serviceWorker.register()`, so `sw.js` itself can never be served from the browser's HTTP cache — closes
  the last gap where a stale service worker script could survive an unregister+clear-caches cycle. Bumped
  to `spine-shell-v5` / `APP_VERSION "5"`.

## 2026-08-20 (5)

- Bumped `CACHE_NAME` to `spine-shell-v4` and `APP_VERSION` to `4` — the badge commit (3582cf7) changed
  `app.js`/`index.html` but forgot to bump `sw.js`, so installed apps stayed stuck on the pre-badge shell.
  This is the second time this exact mistake happened; see the reminder added to CLAUDE.md.

## 2026-08-20 (4)

- Turned the version tag into a tappable pill badge (single tap, no long-press/confirm) and confirmed +
  documented that `forceRefresh()` only clears Cache Storage and the SW registration — it never touches
  `localStorage`, so tapping it can't lose the book library (unlike the browser's "Clear Website Data").

## 2026-08-20 (3)

- Added a long-press gesture on the version tag that unregisters the service worker, clears all caches, and
  reloads (`forceRefresh()` in `app.js`) — a manual "get the latest version" escape hatch for mobile
  browsers, since the SW's own update check can take a load or two to kick in.

## 2026-08-20 (2)

- Added a subtle on-screen version tag (`APP_VERSION` in `app.js`, rendered top-right) so an update can be
  visually confirmed on a device. Must be bumped by hand alongside `sw.js`'s `CACHE_NAME` — see
  architecture.md.

## 2026-08-20

- Set up `docs/` as a persistent project brain (README, architecture, backlog, decisions, changelog) and
  added `CLAUDE.md` at the repo root.
- Fixed missing PWA icons: the three referenced PNGs existed but under a folder named `Icons` (capital I),
  which only worked locally due to Windows' case-insensitive filesystem — GitHub Pages is case-sensitive
  and would have 404'd. Renamed the folder to lowercase `icons/` to match `manifest.json`, `index.html`,
  and `sw.js`.
- Bumped `CACHE_NAME` to `spine-shell-v3` in `sw.js` so the icon fix actually reaches devices that already
  have the app installed (service worker only re-fetches the shell when `sw.js`'s bytes change).
