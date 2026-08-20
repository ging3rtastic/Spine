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
  id: string,           // ISBN-13, falls back to ISBN-10, falls back to Google Books volume id
  title: string,
  subtitle: string,       // "" if none
  authors: string,         // comma-joined
  description: string,
  thumbnail: string|null,
  pageCount: number|null,
  publisher: string,        // "" if unknown
  publishedDate: string,     // "" if unknown, Google's raw string (often just a year)
  categories: string,         // comma-joined genre tags, "" if none
  averageRating: number|null,  // 0–5
  ratingsCount: number|null,
  language: string,             // ISO 639-1 code e.g. "en", "" if unknown
  previewLink: string|null,      // Google Books page URL
  status: "to-read" | "reading" | "read",
  addedAt: number,                // Date.now() at insertion
}
```

The metadata fields (subtitle through previewLink) were added for the book detail view (see below) and are
only as complete as what Google Books returned at add time — books added before this field set existed will
just render those rows blank in the detail view rather than erroring.

Persisted as JSON under the `localStorage` key `spine.library`. `localStorage` remains the source of truth
for instant boot-time reads; Firestore (see "Cross-device sync" below) is an optional layer on top, only
active once a sync code is set. `loadLibrary()` / `saveLibrary()` in `app.js` are the sole read/write points
for local storage — `saveLibrary()` also triggers a debounced cloud push when sync is on.

## Render flow

There's no framework and no virtual DOM diffing. The pattern is:

1. A single global `state` object (tab, library, search results, UI flags like `searching`/`scanning`/
   `detailId`) is the source of truth.
2. Any action (search, add book, change status, remove, open scanner, open detail) mutates `state` directly,
   then calls `render()`.
3. `render()` regenerates the *entire* `#app.innerHTML` from `state` via template-literal string building
   (`renderAddTab`, `renderShelfTab`, `renderRow`, `renderResultCard`, `renderDetail`, etc.).
4. Because the DOM is fully replaced, `attachEvents()` re-binds all listeners after every render, using
   `data-*` attributes on elements (`data-tab`, `data-add`, `data-setstatus`, `data-remove`, `data-detail`)
   to identify what each element does and which id/status it refers to.

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
- **Firebase Firestore (compat SDK)** — lazy-loaded from `gstatic.com` only when sync is used; see
  "Cross-device sync" below.

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

## Viewport height fix

On some real mobile browsers (notably installed PWAs), `100dvh` alone doesn't reliably track the actual
usable viewport, which left the bottom tab bar cut off and requiring a scroll to reach it — reproducible
only on real devices, not desktop responsive-mode emulation. Fixed with the standard workaround: `app.js`
sets a `--app-height` CSS custom property from `window.innerHeight` on load/`resize`/`orientationchange`,
and `#app` uses `height: var(--app-height, 100dvh)` (the plain `100dvh` declaration stays as a pre-JS
fallback for the very first paint).

## Version tag

`app.js` defines `APP_VERSION` (rendered as a small `v{N}` badge, `position: absolute` in the top-right
corner of `#app` via `.version-tag` in `index.html`). Because the shell is network-first now, this number is
**purely a manual, optional label** for eyeballing "did a deploy happen" — it does not need to be bumped on
every commit, and nothing depends on it for correctness.

It was briefly moved into the bottom tab bar on a hunch that the top overlay was the cause of a
mobile-scroll bug (see "Viewport height fix" above); that turned out to be unrelated, so it's back at the
top per preference.

The version tag is a tappable badge (styled like the app's `.pill` elements): tapping it calls
`forceRefresh()`, which unregisters the service worker, deletes Cache Storage, re-registers `sw.js` with
`updateViaCache: "none"`, then navigates to a cache-busted URL (`?_=<timestamp>`) so neither the worker
script nor the reload's own HTTP requests can be served stale. This is **safe for the book library**: it
only touches Cache Storage and the SW registration, never `localStorage` (where `spine.library` lives) —
unlike the browser's "Clear Website Data" setting, which wipes everything for the origin and would delete
the library too. Given network-first, this is now a belt-and-suspenders manual reset rather than the primary
update mechanism.

## Book detail view

Tapping a book — the cover/title area of a search result card (`.card-open` in `renderResultCard`) or an
entire shelf row (`.row-btn` in `renderRow`) — opens a full-screen detail overlay (`renderDetail()`, reuses
the `.scanner-overlay` pattern) with the untruncated description plus whatever extra metadata Google Books
returned (publisher, published date, page count, categories, language, rating, a "View on Google Books"
link). This replaced the old shelf-row behavior of expanding an inline `.row-detail` panel in place (which
still truncated the description at 400 chars) — one full view now covers both entry points instead of two
different truncation levels.

- `state.detailId` + `state.detailSource` (`"results"` or `"library"`) identify which book and which list
  it came from; `openDetail(id, source)` sets them. `getDetailBook()` re-looks-up the book from that source
  list on every render (rather than snapshotting it at open time), so status changes made from inside the
  detail view show up immediately, and removing a library book while its detail is open closes the overlay
  automatically (the lookup just returns `null`).
- The action pills inside the detail view reuse the exact same `data-add` / `data-setstatus` / `data-remove`
  attributes (and therefore the exact same `attachEvents()` listeners) as the list cards — no new action
  logic, just a second place those buttons can render.
- Search results show add-to-shelf pills; library books show status-change pills + Remove, matching what
  the source list already offered — a book opened from search never shows Remove, since it isn't saved yet.

## Backup (Export / Import)

Settings panel (gear icon in the header, `renderSettings()` in `app.js`, reuses the `.scanner-overlay`
visual pattern) → Backup section:

- **Export** builds `JSON.stringify(state.library)`, wraps it in a `Blob`, and triggers a download via a
  temporary `<a download>` — no dependencies, works offline.
- **Import** reads a JSON file with `FileReader`, validates it's an array of book-shaped objects, then
  merges it into `state.library` via `mergeBooks()` rather than replacing — importing can never silently
  delete a book that isn't in the file being imported.

`mergeBooks(existing, incoming)` (in `app.js`) merges by `id`; `incoming` wins on a field conflict, but
every id already in `existing` is always kept. This same function backs both Import and the first-time sync
link below, so "restore a backup" and "link a second device" share one non-destructive code path.

## Cross-device sync (Firebase Firestore)

Optional, opt-in layer on top of `localStorage`, using Firestore's free Spark tier. Linked by a short
**sync code** rather than a full account/login system — no signup flow, at the cost of anyone who has the
exact code being able to read/write that library (accepted trade-off for a personal, low-sensitivity book
list; see decisions.md). **Live and confirmed working** (project `spine-aec50`): setup is complete, and a
device linking via sync code plus a live cross-device update via `onSnapshot` have both been tested
end-to-end.

**One-time setup that was required** (can't be automated — needed a Google account; all done):
1. Create a free project at console.firebase.google.com (Spark plan, no card).
2. Firestore Database → create in Native mode.
3. Authentication → Sign-in method → enable **Anonymous**.
4. Project settings → add a Web App → copy the config object into `FIREBASE_CONFIG` in `app.js`.
5. Firestore → Rules →
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /libraries/{syncCode} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
   Requires the silent anonymous sign-in but does not restrict *which* code an authenticated client can
   touch — security instead comes from codes being long and random (see `generateSyncCode()`, ~10 chars
   from a 32-symbol alphabet with ambiguous characters removed).

**How it works** (`app.js`):
- `state.syncCode`, persisted in `localStorage` (`spine.syncCode`). Unset = sync off, byte-identical to
  pre-sync behavior — nothing Firebase-related runs.
- Firebase's compat SDK is lazy-loaded via `loadScript()`/`loadFirebase()` (plain `<script>` tags injected
  at runtime, not `type="module"`) only the first time sync is actually used — an already-linked device on
  boot, or a user tapping "Start syncing"/"Link". Keeps sync entirely opt-in cost, and avoids converting
  `app.js` to an ES module.
- `enableSync(code)` fetches `libraries/{code}` from Firestore, merges it into the local library with
  `mergeBooks()` (so linking can never drop existing local books), pushes the merged result back up, then
  calls `subscribeToCloud()`. It's written to be safe to re-run on every boot for an already-linked device
  (idempotent reconcile), which is exactly what happens — see the bottom of `app.js`.
- `subscribeToCloud()` uses Firestore's `onSnapshot` to apply remote changes live while the app is open,
  merging (not replacing) into local state, with a `JSON.stringify` equality check to avoid redundant
  re-renders/saves when a snapshot event is just an echo of this device's own write.
- `pushToCloud()`, called from `saveLibrary()`, debounces writes ~800ms so rapid taps don't spam Firestore.
- Conflict resolution is **last-write-wins on the whole array** (no per-field/per-book merge across
  devices) — acceptable at this app's scale (one person, a couple of devices); the merge-by-id logic only
  protects against *losing* books, not against a genuinely concurrent edit to the same book on two devices
  at once.
- `sw.js` needs no changes for this — Firebase's `gstatic.com` requests are cross-origin, already covered
  by the existing network-passthrough branch in the fetch handler.
