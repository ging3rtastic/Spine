# Changelog

Dated, one-line-per-change log of what actually shipped. Newest first.

## 2026-08-20 (15)

- Fixed a likely cross-browser bug in the new bookshelf view: long titles could spill out below the spine
  box on some mobile browsers (reported as "tiles with the image and name below" — `text-overflow: ellipsis`
  combined with `writing-mode: vertical-rl` is unreliable across engines). Titles are now truncated in JS
  (`truncate(book.title, 26)`) instead of relying on CSS ellipsis, and `.spine` got `overflow: hidden` as a
  hard backstop regardless of the title-clipping mechanism. Verified with an intentionally long title in
  Playwright before shipping.

## 2026-08-20 (14)

- Replaced the flat shelf-row list on To Read / Reading / Read with an actual bookshelf: books render as
  colored, variable-width spines (`renderSpine()`, width from page count, color from the existing
  `spineColor()` palette) that wrap into shelf rows, each sitting on a wood-toned ledge drawn with a single
  repeating CSS gradient. Vertical Fraunces-italic titles, a gold foil accent line, and a subtle press lift
  (respects `prefers-reduced-motion`) round it out. Tapping a spine opens the same detail view as before.
  Search results are unchanged — the shelf metaphor only applies to books already in the library. Removed
  the now-dead `renderRow()`/`.row-*` list code. Bumped `APP_VERSION` to `6`.

## 2026-08-20 (13)

- Added a book detail view: tapping a book in search results or a shelf opens a full-screen overlay with
  the untruncated description plus extra Google Books metadata (publisher, published date, categories,
  rating, page count, a "View on Google Books" link). Captures more fields from the Google Books API at
  search time (`subtitle`, `publisher`, `publishedDate`, `categories`, `averageRating`, `ratingsCount`,
  `language`, `previewLink`) so they're available later without a second network call. Replaced the old
  shelf-row inline expand (which still truncated at 400 chars) with this single view. Bumped `APP_VERSION`
  to `5`.

## 2026-08-20 (12)

- Confirmed cross-device sync end-to-end: Firebase project setup complete (Anonymous auth enabled, security
  rules published), a device linked via sync code pulled in an existing library, and a change made on one
  device showed up live on the other via `onSnapshot`. Sync is fully live, not just scaffolded.

## 2026-08-20 (11)

- Filled in real `FIREBASE_CONFIG` values (project `spine-aec50`) — sync is now wired to a real backend
  instead of placeholder config. Bumped `APP_VERSION` to `4`.

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
