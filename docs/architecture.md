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
  finishedAt: number|undefined,    // Date.now() when status last became "read" — see Reading stats below
  owned: "own"|"library"|"buy"|null, // where the physical copy is — see Ownership marks below
  series: string|undefined,          // manual override; "" means "explicitly not a series"
  seriesNumber: number|null,         // position within `series` — see Shelf ordering below
  ratingSource: "google"|"openlibrary"|undefined, // who supplied averageRating
  ratingChecked: true|undefined,     // Open Library has been asked once — see Ratings below
}
```

The metadata fields (subtitle through previewLink) were added for the book detail view (see below) and are
only as complete as what Google Books returned at add time — books added before this field set existed will
just render those rows blank in the detail view rather than erroring. Same story for `finishedAt`: books
marked "read" before it existed simply don't have it, and callers fall back to `addedAt` rather than treating
its absence as an error.

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

## Bookshelf view

The three shelf tabs (To Read / Reading / Read) render books as an actual bookshelf rather than a flat list:
`renderShelfItem(book)` (in `app.js`) outputs a fixed-size `<button class="shelf-item">` — a face-out book
cover (`.shelf-cover`, 80×120px `object-fit: cover`) with a normal horizontal title/author caption below it,
truncated with CSS ellipsis. These sit in a `flex-wrap` container (`.shelf-case` in `index.html`) with no JS
row-chunking — the browser wraps items into new rows on its own once a row's width fills up. Books without a
`thumbnail` get a `.shelf-cover-fallback` tile instead: a solid block colored via the existing `spineColor()`
hash function with a book icon, same size as a real cover.

**This replaced an earlier vertical-spine design** (title rotated `writing-mode: vertical-rl`, à la a real
book's spine edge) after user feedback that reading rotated text on a phone — "have to turn your head... just
like in the store" — wasn't good mobile UX, even though it was visually authentic. Face-out display (books
standing with their cover facing out) is also a real, common bookstore/library fixture, so the pivot kept the
"bookshelf" identity while fixing the actual complaint: no rotated text anywhere now, and the cover art —
which a color-only spine had been criticized for hiding — is now the primary visual per item, not a small
crest. See decisions.md for the fuller before/after reasoning.

The wood ledge under every row is **one** `repeating-linear-gradient` on `.shelf-case`'s background, not a
per-row element: cover height (120px) + a 14px ledge zone (2px highlight lip + 12px wood board) + caption
height (~34px) are baked into each `.shelf-item`'s own fixed height (168px), and the gradient's 182px repeat
cycle (168px item + 14px row-gap) lines up under every wrapped row automatically — including the last row,
since the ledge lives inside each item's own box rather than in trailing space after it (the earlier spine
version needed an explicit `padding-bottom` hack for exactly this reason; this version doesn't).

Tapping an item reuses `data-detail`/`data-detail-source="library"` exactly as both earlier list designs did,
so `attachEvents()`'s detail-opening listener needed no changes across any of these redesigns. A small
`translateY(-4px)` press lift (mimics pulling a book partway off the shelf) is suppressed under
`prefers-reduced-motion`.

Search results on the Add tab were deliberately left as flat cards throughout all of this: that view's job is
comparing/picking from search hits, not browsing books you already own, so the shelf metaphor doesn't apply
there.

## Book detail view

Tapping a book — the cover/title area of a search result card (`.card-open` in `renderResultCard`) or a
spine on a shelf (`.spine` in `renderSpine`, see "Bookshelf view" below) — opens a full-screen detail overlay
(`renderDetail()`, reuses
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

## Reading stats

Settings panel → "View reading stats" opens `renderStats()` (same `.scanner-overlay` full-screen pattern as
Detail/Settings/Scanner). `computeStats(scope)` is a pure function: filters `state.library` to
`status === "read"`, and for `scope === "year"` further filters to books where
`finishedAt || addedAt` falls in the current calendar year (`scope === "all"` skips that filter). From the
scoped set it derives: count, total pages (summing `pageCount`, treating missing as 0), a genre tally (split
each book's `categories` on `,`, count occurrences, take the top 5), and the single longest book by
`pageCount`. Nothing beyond `finishedAt` is persisted for this — everything else is computed on demand each
time the overlay opens, so there's no separate stats state to keep in sync with the library.

`state.statsScope` ("year" | "all", default "year") drives the scope toggle, styled as two `.pill` buttons
reusing the same active/inactive styling as status pills elsewhere. Opening Stats closes Settings first
(`stats-btn`'s click handler sets `settingsOpen = false` alongside `statsOpen = true`) since both are
full-screen `.scanner-overlay`s and only one should be up at a time — same one-overlay-at-a-time convention
already implicit for Scanner/Detail/Settings.

See "Data model" above for `finishedAt` and decisions.md for why it falls back to `addedAt` rather than
triggering a migration for books marked "read" before this feature existed.

## Ratings

Community ratings (not the user's own — there is no personal rating feature). Shown on all three
surfaces, each with a different amount of room:

| surface | renderer | form |
|---|---|---|
| shelf caption (80px) | `renderRatingCompact()` | `★ 4.5` |
| search result card | `renderRatingInline()` | `★★★★★ 4.5 (12.8k)` |
| detail view | inline in `renderDetail()` | `★★★★☆ 4.2 · 1.3m ratings · Open Library` |

`ratingOf(book)` is the single accessor; it returns `null` for a missing or non-positive value so
every surface degrades to showing nothing. `starGlyphs()` rounds to whole stars — a `½` glyph is a
different size and baseline from `★` and reads as a typo — and the exact value is always printed
alongside, so nothing is lost. `formatCount()` abbreviates (1875 → `1.9k`).

The shelf caption reserves the rating line's height even when empty (`.shelf-item-rating-empty`),
so unrated books don't break row alignment.

### Open Library backfill

Google Books only carries a rating for some volumes, and a book already on a shelf never gains one.
`backfillRatings()` tops up the rest from Open Library's search API, which exposes community ratings
by ISBN:

    GET https://openlibrary.org/search.json?q=isbn:<isbn>&fields=ratings_average,ratings_count&limit=1

Rules that keep it cheap and polite:

- Only books with no rating, not yet checked, and an **ISBN-shaped id** (`isIsbnId()`) are eligible —
  a Google volume id can't be looked up this way and is skipped permanently.
- `ratingChecked: true` is set even when Open Library has no rating, so each book costs **one request
  ever**. The flag rides along through export/import and Firestore sync, so other devices don't
  repeat the work.
- 500ms between requests, 40 per run, saving and re-rendering every 5 so stars appear progressively.
- Any failure (offline, CORS, rate limit, outage) stops the run and leaves the remaining books
  *unmarked*, so a later session retries rather than permanently writing them off.

Kicked off 2s after boot, and 1s after a cloud snapshot merge or an import.

### Diagnosing it

A background job that fails silently is undiagnosable on a phone, so Settings → **Ratings** shows
what the backfill is actually doing: how many books have a rating, how many can't be looked up (no
ISBN), and the last run's outcome — held in the `ratingStatus` module object and rendered by
`renderRatingsSection()`. A **Check for ratings now** button runs `backfillRatings({ manual: true })`
on demand instead of waiting for the boot timer.

The error text is the diagnosis, and the distinction matters:

| shown | means |
|---|---|
| `Checked N books, found M ratings` | working |
| `Last check failed: Failed to fetch` | CORS or the network — the request never completed |
| `Last check failed: HTTP 403` / `HTTP 429` | reached Open Library, which refused — rate limit or block |
| `Last check failed: Device is offline` | `navigator.onLine` is false |
| `N books still to check` | not run yet this session |

**Unverified from the dev container:** `openlibrary.org` is denied by the sandbox network policy, so
the response shape above is coded from the documented API and exercised against mocked responses
(happy path, 503, network failure), not against the live service. If the live shape differs the
backfill simply finds nothing and logs a warning — it cannot corrupt stored data. Worth confirming
on a real device.

## Shelf ordering

All three shelves are sorted like a physical bookshelf rather than by insertion order. `shelves()`
sorts with `compareBooks()`; `filter()` already returns a new array, so `state.library`'s stored order is
never touched and export/import/sync are unaffected.

Sort order, in priority:

1. **Author surname.** `authorSortKey()` takes the first of the comma-joined authors and moves the
   surname to the front. It drops trailing honorifics (`Jr.`, `III`) and keeps surname particles attached
   (`Ursula K. Le Guin` → `le guin ursula k.`). Mononyms (`Homer`) sort as-is; unknown authors sort last
   via a `\uffff` key.
2. **Group.** A book in a series groups under the series name; a standalone groups under its own title.
   So series blocks and one-offs interleave alphabetically within an author instead of segregating.
   `titleSortKey()` strips a leading `the`/`a`/`an`, library-style — which also makes grouping
   article-insensitive, so `The Wheel of Time` and `Wheel of Time` still group together.
3. **Series number**, ascending. Numeric, so #8 precedes #13. A numbered book precedes an unnumbered one
   in the same series.
4. **Publication year** (`pubYear()`, first 4-digit run in `publishedDate`). A decent proxy for reading
   order when there's no series number, since series are usually published in order. Undated sorts last.
5. **Title**, as a final tiebreak.

### Series detection

`seriesOf(book)` returns the manual override when the `series` key is present (including `""`, meaning
"explicitly not a series"), otherwise falls back to `detectSeries()`. Detection reads only `title` and
`subtitle`, which are already stored — so it works retroactively on books added years ago, with no
re-fetch and no migration. Google Books' own `volumeInfo.seriesInfo` is undocumented, sparsely populated,
and gives a `seriesId` rather than a name, so it isn't used.

Patterns, tried in order, deliberately conservative (a wrong grouping is worse than none):

| pattern | example |
|---|---|
| parenthetical with a keyword | `Mistborn: The Final Empire (Mistborn, Book 1)`, `(Discworld #8)` |
| "Book N of/in ..." | `Book Two of the Stormlight Archive` |
| "Name, Book N" | `The Wheel of Time, Book 3` |
| name only, unnumbered | `A Discworld Novel` |

`toNumber()` accepts digits or the words one–twenty. `cleanSeriesName()` trims trailing
`Series`/`Trilogy`/`Cycle`/etc. A parenthetical without a keyword (`(Modern Library Classics)`,
`(A Novel)`) is ignored.

### Manual fix-up

The detail view has a Series name + number field (`setSeries()`). Writing either marks the book manually
set, which wins over detection permanently. `setSeries()` deliberately does **not** call `render()`:
moving from the name field to the number field blurs the first and commits, and re-rendering at that
moment would replace the input being tapped into — on a phone the keyboard closes and the entry is lost.
The shelf re-sorts on the next render, which closing the detail view triggers.

## Ownership marks

Orthogonal to `status`: `status` is where a book is in your *reading*, `owned` is where the physical copy
is. Three values, defined once in `OWNERSHIP_META` in `app.js` (label, icon, color):

| value     | meaning       | icon  | color     |
|-----------|---------------|-------|-----------|
| `"own"`   | Own it        | home  | `--sage` (#7BBE90) |
| `"library"` | At library  | columns | `--sky` (#78A8DC) |
| `"buy"`   | Need to buy   | cart  | `--gold` (#C9A24B) |

Absent or `null` means "not marked yet" and renders no badge. The point is shopping: glance at the To Read
shelf and see what to look out for in a bookstore.

Two surfaces:
- **Shelf badge** — `renderShelfItem()` wraps the cover in `.shelf-cover-wrap` and overlays a
  `.shelf-badge` chip (26px, top-right): a **solid fill in the mark's colour with the glyph punched out
  dark**, ringed in `--bg` and given a heavier 2.5 stroke. The colour is passed as a `--badge` custom
  property on the span. Rendered on every shelf, not just To Read — the field is set per book, not per
  shelf.
- **Detail view** — `renderDetail()` renders a "Where is it?" `.own-row` of `.own-pill`s below the status
  pills, for library books only (a search result isn't on a shelf yet). Tapping the active mark clears it.

`setOwnership()` writes an explicit `null` on clear rather than `delete`-ing the key, because `mergeBooks()`
merges with `{ ...existing, ...incoming }` — a missing key would let the other device's stale value win
instead of propagating the clear. (Firestore also rejects `undefined`.)

The To Read tab's header subtitle appends `· N to buy` when any book on it is marked `"buy"`, so the
shopping count is visible without opening anything.

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
