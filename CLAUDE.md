# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Spine is a personal book tracker: a static, no-build, client-only Progressive Web App. Search or scan a book,
then track it on one of three shelves (To Read / Reading / Read). All data is stored in the browser via
`localStorage` — there is no backend, no account system, and no server-side code.

## Project memory

`docs/` is the persistent working memory for this project across sessions — read `docs/README.md` first,
then skim `docs/backlog.md` and `docs/decisions.md` before making changes. Update `docs/changelog.md`,
`docs/backlog.md`, and (if a non-obvious call was made) `docs/decisions.md` when you finish a change.

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
- `sw.js` — service worker implementing a cache-first strategy for the app shell files listed in
  `SHELL_FILES` (bump `CACHE_NAME` when shell files change, so old caches are evicted on `activate`) and
  network passthrough for everything else (Google Books API calls, fonts).
- `manifest.json` — PWA manifest (icons, theme colors, standalone display) referenced from `index.html`.

Because there's no build step, changes to colors, fields, or behavior are made by editing `app.js` and
`index.html` directly.
