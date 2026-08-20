# Decisions

Short entries on *why*, for choices that weren't obvious. Newest first.

## Service worker: network-first, not cache-first

`sw.js` originally cached the app shell cache-first and required manually bumping `CACHE_NAME` (and the
`APP_VERSION` badge) on every commit that touched the shell, so the service worker's own byte-diff check
would notice and re-cache. This was forgotten twice in a row and installed devices kept serving stale
builds. Switched to network-first (always try network, fall back to the cached copy only when offline) —
now shell updates reach the app automatically on the next load, with zero manual bookkeeping. Trade-off: an
extra network round-trip per shell file on every load instead of serving straight from cache; accepted since
the shell is tiny (a few KB) and offline use still works via the fallback. `APP_VERSION` is now purely an
optional manual label, no longer required for correctness.

## No framework, no build step

The whole app is one `index.html` + one `app.js`, using a hand-rolled `state` + `render()` loop with full
`innerHTML` replacement on every change (see architecture.md). Chosen so the app can be edited directly and
deployed by uploading raw files to GitHub Pages — no npm, no bundler, no CI. Trade-off: `attachEvents()` has
to re-bind listeners on every render since there's no diffing; acceptable at this app's scale (a few dozen
DOM nodes at most).

## localStorage only, no backend

Data lives entirely in the browser (`localStorage` key `spine.library`). Chosen for zero cost and zero
account/auth complexity. Trade-off: no cross-device sync — explicitly accepted, documented in README.md.
Revisit only if sync becomes a real want (see backlog.md).

## Google Books API called directly from the client

`lookupBooks()` in `app.js` calls the Google Books API with an inline key, no server proxy. Acceptable
because the key is a free-tier, low-privilege lookup key with no billing risk beyond quota; a proxy would
require a backend, which contradicts the "no backend" decision above.

## Barcode scanning via native `BarcodeDetector`, no JS library

Uses the browser-native `BarcodeDetector` API instead of a bundled JS decoding library (e.g. ZXing), to keep
zero dependencies / zero build step. Trade-off: unsupported on some browsers (notably desktop Safari,
Firefox); the app detects this and falls back to manual ISBN entry rather than trying to polyfill it.
