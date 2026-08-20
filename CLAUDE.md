# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Spine is a personal book tracker: a static, no-build, client-only Progressive Web App. Search or scan a book,
then track it on one of three shelves (To Read / Reading / Read). Data lives in `localStorage` by default,
with an optional Firebase-backed sync layer (see "Sync & backup" below) — there's still no traditional
backend, account system, or server-side code of our own.

## Project memory

`docs/` is the persistent working memory for this project across sessions — read `docs/README.md` first,
then skim `docs/backlog.md` and `docs/decisions.md` before making changes. Update `docs/changelog.md`,
`docs/backlog.md`, and (if a non-obvious call was made) `docs/decisions.md` when you finish a change.

## PWA update model

This app is installed as a PWA on a phone. `sw.js` uses a **network-first** strategy for the shell
(`app.js`, `index.html`, `manifest.json`, icons): it always tries the network first and only falls back to
the cache when offline. This means **shell changes reach the installed app automatically on the next load —
no version bump or cache-name change is required for correctness.** `CACHE_NAME` in `sw.js` is a fixed
string now, not a counter; only change it if you deliberately want to force-evict old cache entries.

`APP_VERSION` in `app.js` (the on-screen badge, top-right) is purely a manual, optional label for visually
confirming a deploy — bump it only when you want the number to change, not on every commit. Tapping the
badge calls `forceRefresh()`, which does a full unregister + cache wipe + cache-busted reload; use it as a
manual escape hatch if something ever looks stale, but it generally shouldn't be needed given network-first.

## Sync & backup

Settings panel (gear icon in the header) has two independent features — see `docs/architecture.md` for
full detail:
- **Export/Import**: always works, no setup, merges by book id (never deletes on import).
- **Firebase sync**: opt-in, linked by a manually-entered sync code (no login). Requires a real Firebase
  project's config to be filled into `FIREBASE_CONFIG` in `app.js` (currently placeholder values — see
  `docs/backlog.md`) before it'll actually work.

## Commands

There is no build step, package manager, or test suite. To develop:

- Open `index.html` directly in a browser, or serve the folder with any static file server (a real HTTP
  origin is required for the service worker and camera/`BarcodeDetector` access to work, e.g.
  `npx serve .` or `python -m http.server`).
- Deployment is via GitHub Pages: push/upload the root files to a repo and enable Pages on branch `main`,
  folder `/ (root)` (see README.md for exact steps).

## Architecture

- `index.html` — single HTML shell containing all CSS (custom properties for the color theme) and a single
  `<div id="app">` mount point. Loads `app.js` as a plain script (no modules/bundler).
- `app.js` — the entire application: state, rendering, and event wiring, structured as a simple
  hand-rolled render loop rather than a framework:
  - A single global `state` object holds the active tab, the in-memory `library` array, search results, and
    UI flags (searching/scanning/open row).
  - `render()` re-generates the full `#app` innerHTML from `state` on every change, then `attachEvents()`
    re-binds DOM listeners (via `data-*` attributes) since the DOM is fully replaced each render — there is
    no diffing.
  - `state.library` is persisted to `localStorage` (`spine.library`) via `loadLibrary()`/`saveLibrary()` and
    is the single source of truth for shelf contents; `shelves()` derives the three shelf arrays from it by
    filtering on `status`.
  - Book lookup (`lookupBooks`) calls the Google Books API directly from the client using an inline API key
    (`GOOGLE_BOOKS_API_KEY`); ISBN-looking queries are searched as `isbn:...`, otherwise as free text.
  - Barcode scanning (`startScanner`/`stopScanner`) uses `navigator.mediaDevices.getUserMedia` plus the
    browser `BarcodeDetector` API where available, falling back to a message telling the user to type the
    ISBN when unsupported.
  - Export/Import and Firebase sync live in the Settings overlay (`renderSettings()`) — see "Sync & backup"
    above and `docs/architecture.md` for the full design.
  - Tapping a book (search result or shelf row) opens a full-screen detail view (`renderDetail()`) with the
    untruncated description and extra Google Books metadata (publisher, categories, rating, etc.) — see
    `docs/architecture.md` → "Book detail view".
- `sw.js` — service worker implementing a network-first strategy for the app shell files listed in
  `SHELL_FILES` (network first, cache as offline fallback only — see "PWA update model" above) and network
  passthrough for everything else (Google Books API calls, fonts).
- `manifest.json` — PWA manifest (icons, theme colors, standalone display) referenced from `index.html`.

Because there's no build step, changes to colors, fields, or behavior are made by editing `app.js` and
`index.html` directly.
