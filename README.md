# Spine — a personal book tracker

Scan or search a book, and keep shelves for **To Read**, **Reading**, and **Read**.
No backend, no account, no cost — everything is saved on your device with `localStorage`,
and book lookups use the free Google Books API (no key required).

## Deploy to GitHub Pages (free, ~5 minutes)

1. Create a new repository on GitHub (e.g. `spine`), public.
2. Upload all the files in this folder (`index.html`, `app.js`, `manifest.json`, `sw.js`, and the `icons/` folder) to the root of that repo.
   - Easiest way: on the repo page, click **Add file → Upload files**, drag in everything, commit.
3. Go to the repo's **Settings → Pages**.
4. Under "Build and deployment," set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`. Save.
5. Wait a minute, then your app will be live at `https://<your-username>.github.io/<repo-name>/`.

## Install it on your phone

- **iPhone (Safari):** open the URL, tap the Share icon, tap **Add to Home Screen**.
- **Android (Chrome):** open the URL, tap the ⋮ menu, tap **Install app** (or **Add to Home Screen**).

Once installed, it opens full-screen like a normal app, and the barcode scanner will have
proper camera access (this only works over HTTPS, which GitHub Pages provides automatically).

## Notes

- **Data lives only on this device.** Since it uses `localStorage`, your library won't sync
  between your phone and laptop unless you visit the same URL and manually re-add books, or
  later swap in a small synced backend.
- **Barcode scanning** requires a browser that supports the `BarcodeDetector` API (Chrome/Edge
  on Android, and recent Safari versions). If it's unsupported, the app tells you and you can
  just type the ISBN or title instead.
- **Costs:** $0. Google Books API is free for this volume of use, and GitHub Pages hosting is free.
- Want changes (colors, adding a "notes" field per book, export/import, etc.)? Just edit `app.js`
  and `index.html` directly — it's plain HTML/CSS/JS, no build step.
