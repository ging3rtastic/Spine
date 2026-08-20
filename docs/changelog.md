# Changelog

Dated, one-line-per-change log of what actually shipped. Newest first.

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
