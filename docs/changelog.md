# Changelog

Dated, one-line-per-change log of what actually shipped. Newest first.

## 2026-09-24 (5)

- Rating coverage: when the ISBN lookup finds no rating, `fetchOpenLibraryRating()` now retries by
  title + author surname. Open Library attaches ratings to a *work* while an ISBN names one
  *edition*, and its edition records often carry no ISBN — so plenty of rated books were being missed
  entirely. At most two requests per book.
- A title/author hit must pass `docMatchesBook()`: exact title match after normalisation (subtitle,
  punctuation and leading articles stripped) **and** the author surname present. Started with a
  substring title test and tightened it after a test caught "Foundation" matching "Foundation and
  Empire" by the same author — a wrong rating is worse than none.
- Refactored `splitAuthorName()` out of `authorSortKey()` so the shelf sort and the rating matcher
  share one definition of a surname (particles, honorifics).
- Goodreads was considered and is not available: Amazon stopped issuing API keys in Dec 2020 and
  retired existing ones. Noted in decisions.md so it isn't re-investigated.
- Verified in Playwright: 8 matcher cases including three false-positive classes, the two-step chain,
  ISBN-hit short-circuit (no wasted second request), plus the full existing suite. Bumped
  `APP_VERSION` to `18`.

## 2026-09-24 (4)

- Search results (and therefore barcode scans, which hand off to `runSearch`) now get the Open Library
  fallback too, via `enrichResultsWithRatings()`. Previously only books already on a shelf were topped
  up, so a book you searched or scanned showed no rating at the one moment it matters — deciding
  whether to add it. Results paint immediately and ratings fill in behind them.
- Prefers a shelved copy, then a session `ratingCache`, then the network 3 at a time. `searchSeq`
  stops an abandoned search's slow lookup overwriting newer results. Added an 8s timeout to
  `fetchOpenLibraryRating()`.
- Verified in Playwright: enrichment with Google-partial results, Open Library 503, network blocked,
  reuse of a shelved rating, cache hit on a repeat search (0 extra requests, measured), and the
  stale-search guard (slow first search cannot overwrite the second). Bumped `APP_VERSION` to `17`.

## 2026-09-24 (3)

- Settings → Ratings now splits rated books by provenance ("N from Open Library"), shown even at zero.
  Live use confirmed requests reach Open Library (a clean run with nothing pending proves it, given
  failures leave books unmarked), but that could not distinguish "Open Library has no rating for these
  books" from "the response is parsed wrong and never yields a value" — both leave a book checked and
  unrated. The provenance count separates them. Bumped `APP_VERSION` to `16`.

## 2026-09-24 (2)

- Added Settings → **Ratings**: how many books have a rating, how many can't be looked up (no ISBN),
  the last backfill result, and a "Check for ratings now" button (`ratingStatus`,
  `renderRatingsSection()`, `ratingCounts()` in `app.js`). The backfill previously failed silently,
  which is undiagnosable on a phone — the error text now distinguishes CORS/network ("Failed to
  fetch") from a server refusal ("HTTP 403") from offline.
- Fixed `.settings-hint-error` being declared *before* `.settings-hint`: same specificity, so the
  later rule won and the error line rendered muted instead of rust. Verified by reading computed
  colour, not by eye.
- Verified in Playwright across working / blocked / rate-limited / offline, plus the manual button.
  Bumped `APP_VERSION` to `15`.

## 2026-09-24

- Community ratings now show on the shelf (`★ 4.5` under the caption) and on search result cards, not
  just in the detail view. Shared helpers `ratingOf()`/`starGlyphs()`/`formatCount()` in `app.js`;
  star glyphs round to whole stars with the exact value printed alongside.
- The shelf caption grew a line, so `.shelf-item` height went 168px → 184px and the ledge gradient's
  period 182px → 198px. **These must stay in step** (item height + 14px row-gap = period) or the wood
  ledge drifts; verified by measuring actual row pitch in the browser.
- Added `backfillRatings()`: books with no Google rating and an ISBN-shaped id are topped up from Open
  Library in the background, one request per book ever (`ratingChecked`), 500ms apart, 40 per run,
  stopping cleanly on any failure. New fields `ratingSource`, `ratingChecked`.
- Verified in Playwright: ledge alignment measured, all three rating surfaces, and the backfill against
  mocked Open Library responses (happy path / found-but-unrated / not-found / 503 / network failure).
  **The live Open Library call is unverified** — the sandbox network policy denies `openlibrary.org`.
  Bumped `APP_VERSION` to `14`.

## 2026-09-21

- Reworked the ownership badges after feedback that they were hard to see. They were a dark chip with a
  thin coloured outline, which disappeared against dark cover art — the colour was carried by a 13px
  2px-stroke glyph, which is very little ink. Inverted: the chip is now a solid fill in the mark's colour
  with the glyph punched out dark, 26px instead of 22px, stroke 2.5, ringed in `--bg` so it also separates
  from light covers. Brightened `--sage` (#6FA07C → #7BBE90) and `--sky` (#6E93BE → #78A8DC) to suit a
  filled chip; `--gold` is used app-wide and was left alone. Compared old vs. new in Playwright over
  white / black / mid-grey / busy / no-cover art at phone scale. Bumped `APP_VERSION` to `13`.

## 2026-09-20 (2)

- Shelves are now sorted like a real bookshelf instead of by insertion order: by author surname, with
  each series kept together in number order (`compareBooks()`/`authorSortKey()`/`titleSortKey()` in
  `app.js`, applied in `shelves()` to all three shelves). Surname handling covers particles (`Le Guin`)
  and honorifics (`Jr.`); leading articles are ignored library-style.
- Series are auto-detected from the already-stored `title`/`subtitle` (`detectSeries()`), so it works
  retroactively with no re-fetch or migration — plus a Series name/number field in the detail view
  (`setSeries()`, `series`/`seriesNumber`) to correct what detection misses. Google Books' own
  `seriesInfo` was evaluated and rejected: undocumented, sparse, and returns an id rather than a name.
- Fixed: `setSeries()` must not `render()`, or tabbing from the series name field to the number field
  destroys the input mid-edit (keyboard closes on mobile, entry lost).
- Added `escAttr()` for HTML attribute values — `esc()` doesn't escape quotes, so a title or series name
  containing `"` broke out of `value="..."`. Also applied to the existing search input's `value`.
- Verified in Playwright: 8 author-key cases, 11 series-detection cases, full 16-book ordering
  (numeric #8-before-#13, article stripping, manual override beating publication date, unknown author
  last), quote round-trip, and manual entry surviving a reload. Bumped `APP_VERSION` to `12`.

## 2026-09-20

- Added ownership marks: each book can be tagged "Own it" / "At library" / "Need to buy" (`owned` on the
  book object, `OWNERSHIP_META` in `app.js`), shown as a small colored symbol badge on the top-right corner
  of its shelf cover. Set from a new "Where is it?" pill row in the book detail view; tapping the active
  mark clears it. The To Read header also shows a `· N to buy` count. Purpose is shopping — glance at the
  shelf and know what to look for in a store. Rides along with export/import and Firebase sync for free
  since it's just another field on the book. Verified in Playwright (all four states render, badge count,
  set/clear/reset round-trips through `localStorage`). Bumped `APP_VERSION` to `11`.

## 2026-08-20 (18)

- Added a Reading Stats view (Settings → "View reading stats"): books read, total pages, top genres, and
  longest book read, toggleable between "This Year" and "All Time" (`computeStats()`, `renderStats()` in
  `app.js`). Added `finishedAt`, stamped whenever a book's status becomes "read", so stats can bucket by the
  year a book was actually finished rather than the year it was added; books marked "read" before this field
  existed fall back to `addedAt`. Verified against known test data (this-year/all-time counts, genre tally,
  longest book, legacy no-`finishedAt` book, empty state) in Playwright before shipping. Bumped
  `APP_VERSION` to `10`.

## 2026-08-20 (17)

- Replaced the vertical-spine bookshelf with face-out book covers, after feedback that reading rotated
  spine text on a phone required physically tilting your head. Books now stand with the full cover visible
  (`.shelf-cover`, 80×120px) and a normal horizontal title/author caption below — same wood-ledge shelf
  visual, no rotated text. Removed `renderSpine()`/`spineWidth()`/`.spine-*` in favor of
  `renderShelfItem()`/`.shelf-item`/`.shelf-cover*`. Verified with mock covers (including long titles/authors
  and a no-cover fallback) at two viewport widths, plus detail-view tap-through, in Playwright before
  shipping. Bumped `APP_VERSION` to `9`.

## 2026-08-20 (16)

- Added a small cover-art "crest" (`.spine-cover`, 46px) to the top of spines that have a `thumbnail`,
  after feedback that the color-only spine was missing the book's cover. Spines without a thumbnail are
  unchanged (solid color, full-height title). Verified with mock cover images in Playwright across
  with-cover and without-cover spines before shipping. Bumped `APP_VERSION` to `8`.

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
