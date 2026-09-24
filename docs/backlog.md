# Backlog

Loosely prioritized. Not a commitment — just a stash of known issues and ideas so they aren't lost between
sessions. Remove items once done (they'll be recorded in changelog.md instead).

## Known issues

_(none open right now)_

## Ideas (from README.md "Notes" section, not yet built)

- Western Cape Provincial Library (WCLS) as a second entry in `LIBRARY_SYSTEMS`. Left out because its
  SLIMS/Brocade catalogue sits behind a login and the search URL shape couldn't be confirmed — needs
  someone with a provincial card to capture a real search URL, then it's a few lines.
- A Libby/OverDrive link beside the catalogue one, for the ebook rather than the shelf copy. City of
  Cape Town surfaces OverDrive titles inside its own OPAC (an `rm=OVERDRIVE0...` scope) rather than at a
  separate `*.overdrive.com` site, so the URL shape needs confirming before shipping it.
- Notes field per book (personal notes/quotes, distinct from Google's read-only description).
- Search/filter within a shelf. (Sorting is done — shelves are author+series ordered now. A text filter
  is still missing and matters more as the library grows.)
- Series detection only reads title/subtitle. If a lot of books need hand-correcting, worth revisiting
  whether a small built-in series lookup table for common series would pay for itself.
- Filter/highlight a shelf by ownership mark (e.g. a "show only what I need to buy" toggle on To Read).
  The badges + header count cover the glanceable case; a filter would matter once To Read is long.
- Open Library backfill: requests confirmed reaching the live API from a device. Still to confirm that
  values are *extracted* — read the "N from Open Library" count in Settings → Ratings. Zero there,
  alongside checked-but-unrated books, means the response field names differ from what the app reads.
- Minimum-vote threshold for ratings (hide anything backed by fewer than ~5 votes). Proposed when
  low-count ratings were flagged as misleading; the Goodreads link was built instead. Revisit if the
  remaining stars still feel untrustworthy.
- Hardcover (hardcover.app) as a third rating source if Open Library coverage still feels thin —
  free GraphQL API, but needs an account and an API key embedded client-side.
- Your own 1–5 star rating, separate from the community one (would want its own field, not
  `averageRating`, plus a slot in Reading Stats).
- Reading progress tracker (current page/% for "Reading" books) — proposed alongside Reading Stats but not
  picked; would need a way to update progress and likely a small progress bar on the shelf cover.
