# Backlog

Loosely prioritized. Not a commitment — just a stash of known issues and ideas so they aren't lost between
sessions. Remove items once done (they'll be recorded in changelog.md instead).

## Known issues

- **Firebase sync isn't live yet.** `FIREBASE_CONFIG` in `app.js` still has `"REPLACE_ME"` placeholders.
  Sync will fail with "Sync error" until a real Firebase project is created and its config + security rules
  are applied — see `docs/architecture.md` → "Cross-device sync" for the exact setup steps.

## Ideas (from README.md "Notes" section, not yet built)

- Notes field per book.
