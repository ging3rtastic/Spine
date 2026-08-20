# Architecture

Deeper reference than CLAUDE.md. Read CLAUDE.md first for the overview.

## Files and responsibilities

| File | Role |
|---|---|
| `index.html` | HTML shell + all CSS (custom properties for theme colors under `:root`). Single `<div id="app">` mount point. Loads `app.js` as a plain `<script>` — no bundler, no modules. |
| `app.js` | The entire app: state, rendering, event wiring, Google Books lookup, barcode scanning. |
| `sw.js` | Service worker: network-first for app-shell files (offline fallback only), network passthrough for everything else (API calls, fonts). |
| `manifest.json` | PWA manifest — icons, theme colors, standalone display mode. |
| `icons/` | Directory containing `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, referenced by the manifest, HTML head, and service worker's `SHELL_FILES`. |

## Data model

A "book" object, as stored in `state.library` / `localStorage`:

```js
{
  id: string,          // ISBN-13, falls back to ISBN-10, falls back to Google Books volume id
  title: string,
  authors: string,      // comma-joined
  description: string,
  thumbnail: string|null,
  pageCount: number|null,
  status: "to-read" | "reading" | "read",
  addedAt: number,       // Date.now() at insertion
}
```

Persisted as JSON under the `localStorage` key `spine.library`. This is the *only* persistence layer — no
backend, no sync. `loadLibrary()` / `saveLibrary()` in `app.js` are the sole read/write points.

## Render flow

There's no framework and no virtual DOM diffing. The pattern is:

1. A single global `state` object (tab, library, search results, UI flags like `searching`/`scanning`/
   `openRowId`) is the source of truth.
2. Any action (search, add book, change status, remove, toggle row, open scanner) mutates `state` directly,
   then calls `render()`.
3. `render()` regenerates the *entire* `#app.innerHTML` from `state` via template-literal string building
   (`renderAddTab`, `renderShelfTab`, `renderRow`, `renderResultCard`, etc.).
4. Because the DOM is fully replaced, `attachEvents()` re-binds all listeners after every render, using
   `data-*` attributes on elements (`data-tab`, `data-add`, `data-setstatus`, `data-remove`,
   `data-togglerow`) to identify what each element does and which id/status it refers to.

This means: whenever you add a new interactive element, it needs (a) a `data-*` attribute in the template
string and (b) a corresponding `querySelectorAll` + listener in `attachEvents()`. There is no event
delegation — listeners are re-attached on every render.

`shelves()` derives the three shelf arrays (`to-read`/`reading`/`read`) from `state.library` by filtering on
`status` — it is *not* separately stored state.

## External dependencies

- **Google Books API** — called directly from the client in `lookupBooks()`, using an inline API key
  (`GOOGLE_BOOKS_API_KEY` in `app.js`). ISBN-shaped queries (9–13 digits after stripping hyphens) are sent
  as `isbn:<isbn>`; everything else is sent as free text. No server-side proxy.
- **BarcodeDetector API** — browser-native barcode detection (Chrome/Edge on Android, recent Safari). Feature
  detected in `startScanner()`; falls back to a "type it instead" message when unavailable.
- **Google Fonts** — Fraunces (headings) and Inter (body), loaded via `<link>` in `index.html`.

## PWA / offline behavior

`sw.js` is **network-first** for the app-shell files in `SHELL_FILES`: on every request it tries `fetch(...,
{ cache: "no-store" })` first (bypassing the browser's HTTP cache too), stashes a copy of a successful
response in Cache Storage, and only falls back to that cached copy if the network fetch fails (offline).
Practical effect: **while online, the app is always current on the next load — no version bump or
`CACHE_NAME` change needed for correctness.** `CACHE_NAME` (`"spine-shell"`) is a fixed string, not a
counter; on `activate` any cache whose name doesn't match it gets deleted, which only matters if you
deliberately rename it later. Non-shell requests (Google Books API, Google Fonts) always go straight to the
network, uncached, same as before.

This replaced an earlier cache-first strategy that required manually bumping `CACHE_NAME` on every shell
change — that approach was dropped because it was easy to forget (happened twice) and doesn't fit rapid
iteration. See decisions.md.

## Version tag

`app.js` defines `APP_VERSION` (rendered as a small `v{N}` badge in the top-right corner via `.version-tag`
in `index.html`). Because the shell is network-first now, this number is **purely a manual, optional label**
for eyeballing "did a deploy happen" — it does not need to be bumped on every commit, and nothing depends on
it for correctness.

The version tag is a tappable badge (styled like the app's `.pill` elements): tapping it calls
`forceRefresh()`, which unregisters the service worker, deletes Cache Storage, re-registers `sw.js` with
`updateViaCache: "none"`, then navigates to a cache-busted URL (`?_=<timestamp>`) so neither the worker
script nor the reload's own HTTP requests can be served stale. This is **safe for the book library**: it
only touches Cache Storage and the SW registration, never `localStorage` (where `spine.library` lives) —
unlike the browser's "Clear Website Data" setting, which wipes everything for the origin and would delete
the library too. Given network-first, this is now a belt-and-suspenders manual reset rather than the primary
update mechanism.
