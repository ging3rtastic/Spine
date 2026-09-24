# Backlog

Loosely prioritized. Not a commitment — just a stash of known issues and ideas so they aren't lost between
sessions. Remove items once done (they'll be recorded in changelog.md instead).

## Known issues

_(none open right now)_

## Ideas (from README.md "Notes" section, not yet built)

- Notes field per book (personal notes/quotes, distinct from Google's read-only description).
- Search/filter within a shelf. (Sorting is done — shelves are author+series ordered now. A text filter
  is still missing and matters more as the library grows.)
- Series detection only reads title/subtitle. If a lot of books need hand-correcting, worth revisiting
  whether a small built-in series lookup table for common series would pay for itself.
- Filter/highlight a shelf by ownership mark (e.g. a "show only what I need to buy" toggle on To Read).
  The badges + header count cover the glanceable case; a filter would matter once To Read is long.
- Confirm the Open Library backfill works against the live API (it could only be tested against mocks —
  `openlibrary.org` is blocked from the dev sandbox). Check a book with no Google rating picks one up.
- Your own 1–5 star rating, separate from the community one (would want its own field, not
  `averageRating`, plus a slot in Reading Stats).
- Reading progress tracker (current page/% for "Reading" books) — proposed alongside Reading Stats but not
  picked; would need a way to update progress and likely a small progress bar on the shelf cover.
