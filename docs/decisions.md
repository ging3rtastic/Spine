# Decisions

Short entries on *why*, for choices that weren't obvious. Newest first.

## Spine links out to the library catalogue; it cannot log in to one

The obvious ask, once books are marked "At library", is for Spine to do what Libby does: add your
library, log in with your card, see whether a book is on the shelf. It cannot, and this is not a
matter of effort.

Both relevant catalogues — the City of Cape Town OPAC (SirsiDynix Enterprise) and the provincial
SLIMS/Brocade one — are server-rendered HTML that send no `Access-Control-Allow-Origin` header. A
page served from `github.io` is a different origin, so the browser blocks the read regardless of
whether the request succeeded or the credentials were right. The only ways round it are a proxy we
host, which ends the no-backend design the whole project rests on, or the library publishing a
CORS-enabled API, which will not happen. OverDrive's undocumented Thunder API has the same problem
on its authenticated endpoints.

Storing the credentials would be its own objection: the provincial service uses date of birth as the
password, so that pair is worth more than the feature.

What replaces it is a link out, the same move already made for Goodreads. The point that makes this
more than a consolation prize is that on a phone the catalogue and Libby are *already signed in*, so
the link lands on the real answer — holdings, availability, holds — without Spine ever handling a
card number. What we give up is anything glanceable: no availability badge on the shelf, no hold
status. That needs the auth we can't have.

**The link goes to the catalogue's front door, not to a prefilled search.** Deep-linking
`/client/en_US/a/search/results?qu=<isbn>` was shipped first and tested on a real device: it
triggered a "confirm you are human" check on *every* visit and then dropped the query, landing on the
home page with no search run. The URL shape was right — those URLs are publicly indexed — but cold
hits with no session, and (our own fault) no referrer either, read as scraping.

Answering this with a server would make it worse, not better. A proxy request arrives from a
datacenter IP with no browser fingerprint and no user gesture, which is a *stronger* bot signal than
a phone tapping a link; we'd trade an interstitial for an outright block, and be building something
whose purpose is to defeat a bot check. So the button does the ordinary thing — a plain visit to the
entry point — and the search term rides on the clipboard for the user to paste. `noreferrer` was
dropped from the link too (`noopener` stays): a refererless request is one more strike against us and
a book tracker's referrer gives nothing away.

One tap and a paste, that always works, beats one tap that mostly doesn't.

The check turned out to fire on the home page as well, so it is blanket bot protection on the OPAC
rather than a reaction to anything we were sending. There is nothing further to do about it, and
trying would be the wrong kind of effort.

**What gets copied is the title and author, not the ISBN.** This was the other real-device finding:
the ISBN found nothing in the catalogue. An ISBN identifies one *edition*, and a library holds
whichever edition it happened to buy — a different printing, a large-print run, a local reissue — so
an ISBN search reliably misses books that are physically on the shelf. Title + author is fuzzier and
therefore right: it matches the book rather than one manufactured object. Only the first author is
included, since a catalogue record that lists one of two co-authors would otherwise come back empty.

This is the opposite of the choice made for ratings, where the ISBN is preferred precisely *because*
it is exact. Different question: Open Library is asked "what is this exact book rated", the catalogue
is asked "do you have anything like this".

Only City of Cape Town ships. A provincial/WCLS entry was left out deliberately rather than guessed
at: its OPAC sits behind a login and its search URL shape could not be confirmed, and a link that
404s is worse than no link. `LIBRARY_SYSTEMS` is a table so adding one later is a few lines.

## Link out to Goodreads rather than keep chasing rating data

After improving Open Library matching, coverage was still poor and the ratings that did arrive were
often backed by one or two votes — accurate-looking and meaningless. Checked whether a better source
exists: it doesn't. Goodreads' API closed in 2020, StoryGraph has none, and Hardcover (the only real
alternative, free GraphQL, 5k requests/day) needs a personal bearer token that a static client-only
app can only ship in plain sight, with CORS unverified.

So the feature stops trying to be authoritative. A small outward-arrow link next to the title opens a
Google search for the book plus "goodreads", putting the real page — with its thousands of ratings —
one tap away. This is strictly more useful than any number Spine could show, costs no API, no key and
no quota, and can't go stale or be wrong.

The stars stay for the books that do have a credible rating; the link covers everything else. If
low-vote ratings still grate, the next step is a minimum-vote threshold, not another data source.

## Goodreads is not an option; Open Library matching was improved instead

Goodreads is the obvious place to want ratings from, and it is closed. Amazon stopped issuing new API
keys in December 2020 and retired the existing ones; there is no application process and scraping
breaches their terms. Any guide suggesting otherwise predates 2020. Hardcover is the plausible modern
alternative (free GraphQL API, Goodreads-scale data) but needs an account and a key embedded in
client JS, so it was left as a possible later step.

What was done instead is cheaper and needs no third party: fix the matching. Open Library attaches
ratings to a *work*, an ISBN identifies one *edition*, and its edition records frequently carry no
ISBN — so an ISBN-only lookup misses rated books that are sitting right there. Falling back to
title + author recovers those.

The matcher requires an exact title match after normalisation, not a substring. The substring version
was written first and a test caught it accepting "Foundation" for "Foundation and Empire" — same
author, different book, plausible-looking rating. Coverage is the goal, but not at the price of
confidently showing the wrong number.

## Ratings are backfilled once per book, and failures are not recorded

Open Library is a free community service, so the backfill is deliberately stingy: one request per book
for the lifetime of that book, 500ms apart, capped per run, and the result — *including "no rating
exists"* — is written to the book so it is never asked again. The flag syncs, so a second device
doesn't repeat the work.

The asymmetry matters: a definitive answer is recorded, a *failure* is not. If the request dies from
being offline, CORS, a rate limit or an outage, the book stays unmarked and a later session retries.
Marking on failure would permanently write off books for a transient reason, which is the one outcome
there is no way to recover from without a manual reset.

Ratings are community ratings only. A personal 1–5 rating was considered and not built: it is a
different feature (it wants its own UI, and it belongs in Reading Stats), and conflating the two in one
`averageRating` field would make it impossible to tell whose opinion a star represents.

## Ownership badges are filled, not outlined

The badges started as a dark translucent chip with a thin coloured border and a matching coloured glyph —
which looked tidy in isolation and was nearly invisible in use. Two compounding reasons: the chip's dark
backdrop sat on dark cover art with almost no edge, and all of the colour was carried by a 13px glyph at
2px stroke, which is a very small amount of ink to identify a colour from.

Inverting it — solid colour fill, dark glyph punched out, ringed in the page background — fixes both: the
fill is a large block of unambiguous colour, and the ring guarantees an edge against covers at either
end of the lightness range. Worth remembering if a future pass is tempted by the more restrained
outlined look: it was tried, and it failed on a real phone.

## Series detected from the title, not from Google's `seriesInfo`

Google Books volumes sometimes carry a `volumeInfo.seriesInfo`, which looks like the obvious source for
series order. It isn't: it's undocumented, present on only a fraction of volumes, and identifies the series
by an opaque `seriesId` rather than a name — grouping by it would need a second API call per book, and the
API is already geo-restricted enough that it couldn't even be probed from the dev container.

More decisively, it only helps books added *after* the change. Parsing `title`/`subtitle` — which every
book already has stored — works retroactively on a library built up over years, with no re-fetch and no
migration. Patterns are kept conservative on the principle that a wrong grouping is worse than no
grouping: a book wrongly filed under a series is confusing, a book left unfiled just sorts by title.

The manual field exists because detection will always miss things; it's the escape hatch that makes the
imperfect heuristic acceptable. An explicit `series` key (including `""`) always wins, so a correction is
never re-guessed.

## Sorting lives in `shelves()`, not in `state.library`

Sorting the stored array would have been simpler to write, but `state.library` is what gets exported and
pushed to Firestore, and its order is also what `addBook()`'s `unshift` assumes. Sorting the derived copy
in `shelves()` keeps the stored order stable, so a re-sort never produces a spurious sync write or a
diff-only-by-ordering export.

## Ownership is its own field, not a fourth shelf

The ask was a way to see, while out shopping, which To Read books you already own, which are available at a
library, and which you'd need to buy. The cheap version would have been a fourth status ("To Buy"), but
status and ownership are independent axes — you can own a book you're currently reading, and a book you
need to buy doesn't stop being "to read". Folding them together would have meant a book could only be in
one of the two, and would have polluted the shelf tabs and Reading Stats with a non-reading concept.

So `owned` is a separate optional field with its own vocabulary, rendered as a badge rather than a shelf.
It's deliberately *not* required: an unmarked book shows no badge, so nothing changes for anyone who never
touches the feature, and there's no migration for existing libraries.

Badges render on all three shelves rather than To Read only. The field is per book, not per shelf, and
hiding it elsewhere would make it look like the mark had been lost when a book moved to Reading.

## `finishedAt` falls back to `addedAt`, no migration

Added `finishedAt` (stamped in `setStatus`/`addBook` whenever a book's status becomes "read") so reading
stats could bucket "books read" by year without misattributing books that sat on a shelf a long time before
being finished. Books already marked "read" before this field existed don't have it. Considered writing a
one-time migration to backfill `finishedAt` from `addedAt` for those, but that would bake in a value that's
actively wrong (when the book was *added*, not finished) as if it were real data. Simpler and more honest to
leave it missing and let `computeStats()` fall back to `addedAt` only at read time — an acknowledged
approximation for old data, not a permanent falsehood written into storage. Not worth more engineering than
that for a single-user app.

## Face-out covers, not vertical spines

The bookshelf view originally rendered books as literal spines: solid color, title rotated
`writing-mode: vertical-rl` to read bottom-to-top like a real spine's edge. Visually authentic, but the user
pushed back hard after using it for real — reading rotated text on a phone meant tilting your head, "just
like in the store," which is a fun physical quirk of an actual bookshelf but bad UX for something you glance
at often. There was also a parallel complaint that a solid-color spine felt like it was hiding the book's
cover (a small cover-art crest was added as a partial fix, but didn't fully address either problem).

Rather than iterate further on spines, switched to face-out display: books stand with the cover fully
visible and a normal horizontal title/author caption underneath — no rotated text anywhere. This is still a
real, common bookstore/library fixture (face-out shelving), so it keeps the "bookshelf" identity and the
wood-ledge visual the user liked, while directly fixing both complaints: the cover art is now the primary
visual per book, and nothing needs to be read sideways. Net simplification too — no more `spineWidth()`
page-count-based sizing (covers are a fixed size) and no more cross-browser risk from
`writing-mode` + `text-overflow: ellipsis` interactions.

## Bookshelf view replaces the shelf list, doesn't toggle with it

The three shelf tabs render books as spines on a shelf instead of a flat row list. Considered adding a
list/shelf toggle to keep both, but decided against it — asked the user directly, and a full replacement was
preferred. A toggle would mean two layouts to maintain and would dilute the one thing the redesign was
supposed to commit to. The bookshelf leans on things the app already had (the `spineColor()` hash palette,
the app's own name) rather than introducing a new visual language, and the existing detail view (shipped
just before this) absorbs everything the old list's inline expand used to show, so nothing was lost by
removing the list — just relocated one tap away.

Search results deliberately kept the old flat-card layout: the bookshelf metaphor only makes sense for books
you already own a copy of, not a list you're comparing before deciding what to add.

## Cross-device sync via Firebase + sync code, not a real account system

Revises "localStorage only, no backend" below: added an *optional* Firestore-backed sync layer once real
data loss became a real worry. Chose a short random **sync code** (Firestore doc id under `libraries/`)
that you enter on each device you want linked, instead of email/password or OAuth — a full account system
would be more secure but is a lot more weight (UI, password resets, session handling) for a single-user app.

Trade-off accepted: Firestore security rules require anonymous auth but don't check *who* is asking for a
given code — anyone with the exact code can read/write that library. Mitigated by codes being long and
random by default (`generateSyncCode()`, ~10 chars, 32-symbol alphabet), making guessing impractical, but
this is genuinely weaker than per-user auth. Acceptable given the data (a personal book list) is
low-sensitivity. `mergeBooks()` (id-based, union, never drops existing entries) is used for both this and
Import specifically so that linking a second device — or restoring a backup — can never lose books, which
was the whole point of adding this.

Conflict resolution is last-write-wins on the whole array, not per-field. A CRDT-style or per-book merge
would handle true concurrent edits better, but is overkill for one person syncing between a couple of
devices.

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

## localStorage only, no backend (superseded, see above)

Data originally lived entirely in the browser (`localStorage` key `spine.library`), chosen for zero cost and
zero account/auth complexity, with no cross-device sync as an explicitly accepted trade-off. Revisited once
sync became a real want — see "Cross-device sync via Firebase + sync code" above. `localStorage` is still
the source of truth for instant reads; Firestore is an optional layer on top, not a replacement.

## Google Books API called directly from the client

`lookupBooks()` in `app.js` calls the Google Books API with an inline key, no server proxy. Acceptable
because the key is a free-tier, low-privilege lookup key with no billing risk beyond quota; a proxy would
require a backend, which contradicts the "no backend" decision above.

## Barcode scanning via native `BarcodeDetector`, no JS library

Uses the browser-native `BarcodeDetector` API instead of a bundled JS decoding library (e.g. ZXing), to keep
zero dependencies / zero build step. Trade-off: unsupported on some browsers (notably desktop Safari,
Firefox); the app detects this and falls back to manual ISBN entry rather than trying to polyfill it.
