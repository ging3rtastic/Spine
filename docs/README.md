# docs/ — Spine project brain

This folder is the persistent memory for working on Spine across sessions. `CLAUDE.md` at the repo root
stays short (orientation for a fresh session); this folder holds everything that accumulates over time.

## Files

- **architecture.md** — how the app actually works: data model, render flow, file responsibilities. Update
  when the structure of the app changes (new state fields, new files, changed data flow) — not for every
  small edit.
- **backlog.md** — ideas, known issues, and planned work, loosely prioritized. Add to it whenever a bug or
  idea comes up that isn't being fixed immediately. Remove/check off items once done (see changelog.md
  instead of leaving completed items here).
- **decisions.md** — short entries explaining *why* something was built a certain way, especially when the
  choice wasn't obvious (e.g. "no framework", "no sync backend"). Add an entry when a non-trivial choice is
  made; don't log routine edits.
- **changelog.md** — dated, one-line-per-change log of what actually shipped. Add an entry at the end of a
  session that changed the app.

## Workflow for future sessions

1. Read `CLAUDE.md` first for orientation, then skim `docs/backlog.md` and `docs/decisions.md` for context
   before making changes.
2. When you finish work, update `docs/changelog.md` (what changed) and `docs/backlog.md` (remove
   done items, add new ones you noticed), and add a `docs/decisions.md` entry if you made a non-obvious
   call.
3. Keep entries terse. This is a working log, not a report — optimize for a future session skimming it in
   under a minute.
