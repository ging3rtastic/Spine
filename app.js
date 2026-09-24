// Bump alongside sw.js's CACHE_NAME so the on-screen tag confirms an update landed.
const APP_VERSION = "18";

// ---------- Icons (inline SVG, stroke style to match lucide look) ----------
const ICON = {
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  camera: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  x: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  trash: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>`,
  bookmark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  book: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  plus: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`,
  alert: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>`,
  loader: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
  gear: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  home: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>`,
  library: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10 12 3l10 7"/><path d="M5 10v11M10 10v11M14 10v11M19 10v11"/><path d="M3 21h18"/></svg>`,
  cart: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/><path d="M1.5 3H4l2.5 11.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.5L21 7H5.2"/></svg>`,
};

const SPINES = ["#8B3A3A", "#2D5A4A", "#4A5D8B", "#8B6F3A", "#5C3A8B", "#3A7D8B", "#A8553D"];
function spineColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return SPINES[Math.abs(h) % SPINES.length];
}

const STATUS_META = {
  "to-read": { label: "To Read", icon: ICON.bookmark },
  reading: { label: "Reading", icon: ICON.book },
  read: { label: "Read", icon: ICON.check },
};
// Where a book physically is — orthogonal to which shelf it's on. Purely an aid for
// knowing what to look out for when shopping; `null`/absent means "not marked yet".
const OWNERSHIP_META = {
  own: { label: "Own it", short: "Own", icon: ICON.home, color: "var(--sage)" },
  library: { label: "At library", short: "Library", icon: ICON.library, color: "var(--sky)" },
  buy: { label: "Need to buy", short: "Buy", icon: ICON.cart, color: "var(--gold)" },
};

const TABS = [
  { key: "add", label: "Add", icon: ICON.plus },
  { key: "to-read", label: "To Read", icon: ICON.bookmark },
  { key: "reading", label: "Reading", icon: ICON.book },
  { key: "read", label: "Read", icon: ICON.check },
];

// ---------- State ----------
const state = {
  tab: "add",
  library: loadLibrary(),
  query: "",
  results: [],
  searching: false,
  searchError: null,
  scanning: false,
  justAdded: {},
  detailId: null,
  detailSource: null, // "results" | "library"
  settingsOpen: false,
  syncCode: localStorage.getItem("spine.syncCode") || null,
  syncStatus: "idle",
  syncCodeInput: "",
  statsOpen: false,
  statsScope: "year", // "year" | "all"
};

function loadLibrary() {
  try {
    const raw = localStorage.getItem("spine.library");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
function saveLibrary(opts = {}) {
  try {
    localStorage.setItem("spine.library", JSON.stringify(state.library));
  } catch (e) {
    console.error("Couldn't save library", e);
  }
  if (state.syncCode && !opts.skipCloudPush) pushToCloud();
}

// Merges `incoming` into `existing` by id — incoming wins on id conflict, but nothing already in
// `existing` is ever dropped. Shared by Import and first-time sync linking so neither can lose books.
function mergeBooks(existing, incoming) {
  const byId = new Map(existing.map(b => [b.id, b]));
  let added = 0, updated = 0;
  for (const book of incoming) {
    if (!book || !book.id) continue;
    if (byId.has(book.id)) updated++; else added++;
    byId.set(book.id, { ...byId.get(book.id), ...book });
  }
  return { merged: Array.from(byId.values()), added, updated };
}

function exportLibrary() {
  const data = JSON.stringify(state.library, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `spine-library-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importLibraryFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    let incoming;
    try {
      incoming = JSON.parse(reader.result);
      if (!Array.isArray(incoming)) throw new Error("not an array");
    } catch (e) {
      alert("That file doesn't look like a Spine library export.");
      return;
    }
    const { merged, added, updated } = mergeBooks(state.library, incoming);
    const msg = `This will add ${added} new book${added === 1 ? "" : "s"} and update ${updated} existing one${updated === 1 ? "" : "s"}. Continue?`;
    if (!confirm(msg)) return;
    state.library = merged;
    saveLibrary();
    render();
    setTimeout(backfillRatings, 1000);
  };
  reader.readAsText(file);
}

// ---------- Cross-device sync (Firebase Firestore, free Spark tier) ----------
// Public web config, not a secret — same pattern as GOOGLE_BOOKS_API_KEY below. Protection comes
// from Firestore security rules requiring anonymous auth, not from hiding these values. Fill in
// after creating a free project at console.firebase.google.com — see docs/architecture.md.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyByLPNFFs6KfoubsGcPuoBbqrp7GCMwC9s",
  authDomain: "spine-aec50.firebaseapp.com",
  projectId: "spine-aec50",
  storageBucket: "spine-aec50.firebasestorage.app",
  messagingSenderId: "223528506805",
  appId: "1:223528506805:web:4083acecbf06814eb375fc",
};

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

// Firebase is only fetched the first time sync is actually used (existing sync code on boot, or
// tapping "Start syncing"/"Link"), not on every load — sync stays entirely opt-in cost.
let firebasePromise = null;
function loadFirebase() {
  if (!firebasePromise) {
    firebasePromise = (async () => {
      const base = "https://www.gstatic.com/firebasejs/10.14.1/";
      await loadScript(base + "firebase-app-compat.js");
      await loadScript(base + "firebase-auth-compat.js");
      await loadScript(base + "firebase-firestore-compat.js");
      if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      await firebase.auth().signInAnonymously();
      return firebase.firestore();
    })();
  }
  return firebasePromise;
}

function generateSyncCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I)
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => chars[b % chars.length]).join("");
}

let unsubscribeCloud = null;
let pushTimer = null;

// Links this device to `code`: pulls whatever's already stored under that code, merges it into
// the local library (never drops local books — same mergeBooks() as Import), pushes the merged
// result back up, then subscribes to future changes. Safe to call again on every boot for a
// device that's already linked — it's an idempotent reconcile, not a one-time setup step.
async function enableSync(code) {
  state.syncCode = code;
  localStorage.setItem("spine.syncCode", code);
  state.syncStatus = "syncing";
  render();
  try {
    const db = await loadFirebase();
    const ref = db.collection("libraries").doc(code);
    const snap = await ref.get();
    const remoteBooks = (snap.exists && snap.data().books) || [];
    const { merged } = mergeBooks(state.library, remoteBooks);
    state.library = merged;
    saveLibrary({ skipCloudPush: true });
    await ref.set({ books: state.library, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
    subscribeToCloud(ref);
    state.syncStatus = "synced";
  } catch (e) {
    console.error("Sync setup failed", e);
    state.syncStatus = "error";
  }
  render();
}

function subscribeToCloud(ref) {
  if (unsubscribeCloud) unsubscribeCloud();
  unsubscribeCloud = ref.onSnapshot(snap => {
    if (!snap.exists) return;
    const remoteBooks = snap.data().books || [];
    const { merged } = mergeBooks(state.library, remoteBooks);
    if (JSON.stringify(merged) !== JSON.stringify(state.library)) {
      state.library = merged;
      saveLibrary({ skipCloudPush: true });
      render();
      setTimeout(backfillRatings, 1000);
    }
    state.syncStatus = "synced";
  }, e => {
    console.error("Sync listener error", e);
    state.syncStatus = "error";
    render();
  });
}

function pushToCloud() {
  if (!state.syncCode) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    try {
      const db = await loadFirebase();
      await db.collection("libraries").doc(state.syncCode)
        .set({ books: state.library, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
      state.syncStatus = "synced";
    } catch (e) {
      console.error("Sync push failed", e);
      state.syncStatus = "error";
    }
  }, 800);
}

function disableSync() {
  if (unsubscribeCloud) { unsubscribeCloud(); unsubscribeCloud = null; }
  state.syncCode = null;
  state.syncStatus = "idle";
  localStorage.removeItem("spine.syncCode");
  render();
}

// ---------- Google Books lookup ----------
// Free key from console.cloud.google.com (Books API enabled). Restrict it to your
// GitHub Pages URL under "HTTP referrers" in the Cloud Console for safety.
const GOOGLE_BOOKS_API_KEY = "AIzaSyCyZgyc4qQZBFRfpTW4TaOTy9iTiNtqH5g";

async function lookupBooks(query) {
  const isIsbn = /^[0-9]{9,13}$/.test(query.replace(/-/g, ""));
  const q = isIsbn ? `isbn:${query.replace(/-/g, "")}` : query;
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=10&key=${GOOGLE_BOOKS_API_KEY}`);
  if (!res.ok) throw new Error("network");
  const data = await res.json();
  if (!data.items) return [];
  return data.items.map(item => {
    const v = item.volumeInfo || {};
    const ids = v.industryIdentifiers || [];
    const isbn13 = ids.find(i => i.type === "ISBN_13")?.identifier;
    const isbn10 = ids.find(i => i.type === "ISBN_10")?.identifier;
    return {
      id: isbn13 || isbn10 || item.id,
      title: v.title || "Untitled",
      subtitle: v.subtitle || "",
      authors: (v.authors || []).join(", "),
      description: v.description || "",
      thumbnail: v.imageLinks?.thumbnail?.replace("http://", "https://") || null,
      pageCount: v.pageCount || null,
      publisher: v.publisher || "",
      publishedDate: v.publishedDate || "",
      categories: (v.categories || []).join(", "),
      averageRating: v.averageRating || null,
      ratingsCount: v.ratingsCount || null,
      language: v.language || "",
      previewLink: v.previewLink || null,
    };
  });
}

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s ?? "";
  return d.innerHTML;
}
// esc() is for text content; attribute values additionally need quotes escaped or a value
// containing one breaks out of value="...".
function escAttr(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function truncate(s, n) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

// ---------- Actions ----------
async function runSearch(q) {
  if (!q.trim()) return;
  const seq = ++searchSeq;
  state.searching = true;
  state.searchError = null;
  state.results = [];
  render();
  try {
    const r = await lookupBooks(q.trim());
    state.results = r;
    if (r.length === 0) state.searchError = "No books found. Try a different title, author, or ISBN.";
  } catch (e) {
    state.searchError = "Couldn't reach Google Books. Check your connection and try again.";
  } finally {
    state.searching = false;
    render();
    // Deliberately not awaited: results are on screen already, stars fill in behind them.
    if (state.results.length) enrichResultsWithRatings(seq);
  }
}

function addBook(book, status) {
  const existing = state.library.find(b => b.id === book.id);
  if (existing) {
    existing.status = status;
    if (status === "read") existing.finishedAt = Date.now();
  } else {
    const entry = { ...book, status, addedAt: Date.now() };
    if (status === "read") entry.finishedAt = Date.now();
    state.library.unshift(entry);
  }
  saveLibrary();
  state.justAdded[book.id] = status;
  render();
}
function setStatus(id, status) {
  const b = state.library.find(x => x.id === id);
  if (b) {
    b.status = status;
    // Overwritten each time a book re-enters "read" — represents "most recently finished,"
    // which is what stats care about. Not cleared on leaving "read", so history isn't lost.
    if (status === "read") b.finishedAt = Date.now();
  }
  saveLibrary();
  render();
}
function setOwnership(id, mark) {
  const b = state.library.find(x => x.id === id);
  if (b) b.owned = b.owned === mark ? null : mark;
  saveLibrary();
  render();
}
// Writing `series` (even as "") marks it manually set, which permanently wins over
// detection for this book — including "" meaning "this is not part of a series".
function setSeries(id, name, number) {
  const b = state.library.find(x => x.id === id);
  if (!b) return;
  b.series = String(name || "").trim();
  const n = parseInt(number, 10);
  b.seriesNumber = Number.isFinite(n) && n > 0 ? n : null;
  saveLibrary();
  // Deliberately no render(): these are text inputs, and moving from the name field to the
  // number field blurs the first, which commits here. Re-rendering at that moment would
  // replace the very input the user is tapping into — on a phone the keyboard closes and the
  // entry is lost. The shelf re-sorts on the next render, which closing the detail view does.
}
function removeBook(id) {
  state.library = state.library.filter(b => b.id !== id);
  saveLibrary();
  render();
}

// ---------- Ratings ----------
// Community ratings, not the user's own. Google Books supplies them at add time when it has
// them; Open Library backfills the rest (see backfillRatings). Rendered three ways because the
// space available differs wildly: 80px on a shelf caption, a full card in search, centred in
// the detail view.

function ratingOf(book) {
  const r = Number(book.averageRating);
  if (!Number.isFinite(r) || r <= 0) return null;
  return { value: r, count: Number(book.ratingsCount) || 0, source: book.ratingSource || "google" };
}

function formatCount(n) {
  if (!n) return "";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}m`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

// Five glyphs, rounded to whole stars. A half-star glyph (\u00bd) is a different size and
// baseline from \u2605 and reads as a typo next to it; the exact value is always printed
// alongside, so rounding the glyphs costs no information.
function starGlyphs(value) {
  const filled = Math.max(0, Math.min(5, Math.round(value)));
  return "\u2605".repeat(filled) + "\u2606".repeat(5 - filled);
}

// Shelf captions are 80px wide — one star and the number is all that fits legibly.
function renderRatingCompact(book) {
  const r = ratingOf(book);
  if (!r) return `<span class="shelf-item-rating shelf-item-rating-empty"></span>`;
  return `<span class="shelf-item-rating" title="${escAttr(`${r.value.toFixed(1)} out of 5`)}">\u2605 ${r.value.toFixed(1)}</span>`;
}

function renderRatingInline(book) {
  const r = ratingOf(book);
  if (!r) return "";
  return `<div class="result-rating">${starGlyphs(r.value)}<span>${r.value.toFixed(1)}${
    r.count ? ` (${formatCount(r.count)})` : ""}</span></div>`;
}

// ---------- Open Library rating backfill ----------
// Google Books only has a rating for some volumes, and never gets one retroactively for books
// already on a shelf. Open Library's search API exposes community ratings by ISBN, so unrated
// books are topped up in the background, once each, and the answer is stored on the book — so
// it costs one request per book ever, syncs to other devices, and works offline afterwards.

const OPEN_LIBRARY_SEARCH = "https://openlibrary.org/search.json";
const RATING_LOOKUP_GAP_MS = 500;   // be a polite client of a free community API
const RATING_LOOKUP_PER_RUN = 40;   // a big library finishes over a few sessions, not one burst
const RATING_SAVE_EVERY = 5;        // surface stars as they arrive rather than all at the end
const RATING_TIMEOUT_MS = 8000;
const RESULT_RATING_CONCURRENCY = 3; // a search returns up to 10; don't do them one at a time

// Ratings looked up this session, keyed by ISBN, so repeating a search (or scanning the same
// book twice) costs nothing. A cached entry of {value:null} means "asked, nobody has rated it".
const ratingCache = new Map();
// Guards against a slow lookup from an abandoned search overwriting newer results.
let searchSeq = 0;

let ratingBackfillRunning = false;

// A background job that fails silently is undiagnosable on a phone, where there are no dev
// tools. Every run records its outcome here and the Settings panel shows it, so "no stars
// appeared" can be told apart from "the request was blocked" without a debugger.
const ratingStatus = { running: false, lastError: null, lastOk: null, found: 0, asked: 0 };

function ratingCounts() {
  const lib = state.library;
  const rated = lib.filter(b => ratingOf(b));
  return {
    total: lib.length,
    rated: rated.length,
    pending: lib.filter(needsRatingLookup).length,
    unsupported: lib.filter(b => !ratingOf(b) && !isIsbnId(b.id)).length,
    // Split by provenance. This is the only way to tell "Open Library genuinely has no rating
    // for these books" apart from "the response is being parsed wrong and never yields one" —
    // both leave a book checked-but-unrated, but only the first still produces hits elsewhere.
    fromOpenLibrary: rated.filter(b => b.ratingSource === "openlibrary").length,
    checkedNoRating: lib.filter(b => !ratingOf(b) && b.ratingChecked).length,
  };
}

// Only an ISBN can be looked up this way; a Google volume id can't, so it's left alone.
function isIsbnId(id) {
  return /^(?:\d{9}[\dXx]|\d{13})$/.test(String(id || ""));
}

function needsRatingLookup(b) {
  return b && !ratingOf(b) && !b.ratingChecked && isIsbnId(b.id);
}

async function olSearch(query) {
  const url = `${OPEN_LIBRARY_SEARCH}?${query}` +
    `&fields=title,author_name,ratings_average,ratings_count&limit=5`;
  // Without a timeout a hung request stalls the whole batch behind it.
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), RATING_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(url, { signal: ctrl.signal });
  } catch (e) {
    throw new Error(e.name === "AbortError" ? "Timed out" : e.message);
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data && Array.isArray(data.docs) ? data.docs : [];
}

// Liberal about the shape: read the documented fields but tolerate the nested variant.
function parseRatingDoc(doc) {
  if (!doc) return null;
  const value = Number(doc.ratings_average ?? doc.ratings?.average);
  const count = Number(doc.ratings_count ?? doc.ratings?.count) || 0;
  return { value: Number.isFinite(value) && value > 0 ? value : null, count };
}

// Sources disagree on subtitle, punctuation and articles, so compare a reduced form. The
// split covers the usual subtitle separators — colon, comma ("The Hobbit, or There and
// Back Again"), bracket and dashes — leaving just the main title.
function normalizeTitle(t) {
  return String(t || "")
    .toLowerCase()
    .split(/[:,;(\u2013\u2014]/)[0]
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\b(the|a|an)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// A title-only match happily returns a different book of the same name, so a hit that did not
// come from an ISBN has to agree on the author too.
function docMatchesBook(doc, book) {
  const want = normalizeTitle(book.title);
  const got = normalizeTitle(doc.title);
  if (!want || !got) return false;
  // Exact match only, post-normalisation. A substring rule looks tempting but quietly accepts
  // a series sibling by the same author ("Foundation" vs "Foundation and Empire"), and a
  // confidently wrong rating is worse than none — same principle as series detection.
  if (want !== got) return false;
  const surname = surnameOf(book.authors);
  if (!surname) return false;
  return (doc.author_name || []).join(" ").toLowerCase().includes(surname);
}

async function fetchOpenLibraryRating(book) {
  // 1. By ISBN — precise, when the edition happens to be indexed with one.
  const isbnHit = parseRatingDoc((await olSearch(`q=isbn:${encodeURIComponent(book.id)}`))[0]);
  if (isbnHit && isbnHit.value) return isbnHit;

  // 2. Ratings attach to a *work*, but an ISBN identifies one *edition*, and Open Library's
  //    edition records frequently carry no ISBN — so a miss above doesn't mean the book is
  //    absent. Duplicate work records mean an unrated hit doesn't mean nobody rated it either.
  //    Retry by title + author surname, accepting a doc only when both line up.
  const title = String(book.title || "").trim();
  const surname = surnameOf(book.authors);
  if (title && surname) {
    const docs = await olSearch(
      `title=${encodeURIComponent(title)}&author=${encodeURIComponent(surname)}`);
    const hit = parseRatingDoc(docs.find(d => docMatchesBook(d, book) && Number(d.ratings_average) > 0));
    if (hit && hit.value) return hit;
  }
  return { value: null, count: 0 };
}

// Google has dropped ratings for most volumes, so a search result usually arrives with none —
// which is exactly when a rating is useful, since that's the moment of deciding whether to add
// the book. Results are shown immediately and ratings filled in behind them.
async function enrichResultsWithRatings(seq) {
  const apply = (r, hit) => {
    if (!hit) return false;
    r.ratingChecked = true;   // carried into the library on add, so it isn't asked twice
    if (!hit.value) return false;
    r.averageRating = hit.value;
    r.ratingsCount = hit.count;
    r.ratingSource = "openlibrary";
    return true;
  };

  const need = state.results.filter(r => !ratingOf(r) && isIsbnId(r.id));
  if (!need.length) return;

  // Free answers first: a copy already on a shelf, or something looked up earlier this session.
  let changed = false;
  const remaining = [];
  for (const r of need) {
    const shelved = state.library.find(b => b.id === r.id);
    const known = shelved && ratingOf(shelved);
    if (known) {
      r.averageRating = known.value;
      r.ratingsCount = known.count;
      r.ratingSource = known.source;
      changed = true;
    } else if (ratingCache.has(r.id)) {
      changed = apply(r, ratingCache.get(r.id)) || changed;
    } else {
      remaining.push(r);
    }
  }
  if (changed && seq === searchSeq) render();

  for (let i = 0; i < remaining.length; i += RESULT_RATING_CONCURRENCY) {
    if (seq !== searchSeq) return;   // a newer search has replaced these results
    const batch = remaining.slice(i, i + RESULT_RATING_CONCURRENCY);
    const hits = await Promise.all(batch.map(r =>
      fetchOpenLibraryRating(r).catch(() => undefined)));  // undefined = transient, don't cache
    let any = false;
    batch.forEach((r, j) => {
      if (hits[j] === undefined) return;
      ratingCache.set(r.id, hits[j]);
      any = apply(r, hits[j]) || any;
    });
    if (any && seq === searchSeq) render();
  }
}

async function backfillRatings(opts = {}) {
  if (ratingBackfillRunning) return;
  if (navigator.onLine === false) {
    if (opts.manual) { ratingStatus.lastError = "Device is offline"; render(); }
    return;
  }
  ratingBackfillRunning = true;
  ratingStatus.running = true;
  ratingStatus.lastError = null;
  ratingStatus.found = 0;
  ratingStatus.asked = 0;
  if (opts.manual) render();

  // Work from a snapshot of ids and re-resolve each book, since the library can change
  // (a sync snapshot, an add, a remove) during the awaits.
  const ids = state.library.filter(needsRatingLookup).map(b => b.id).slice(0, RATING_LOOKUP_PER_RUN);
  let pending = 0;
  const flush = () => { if (pending) { pending = 0; saveLibrary(); render(); } };

  try {
    for (const id of ids) {
      const book = state.library.find(b => b.id === id);
      if (!needsRatingLookup(book)) continue;
      let r;
      try {
        r = await fetchOpenLibraryRating(book);
      } catch (e) {
        // Offline, CORS, rate limit, outage: leave the remaining books unmarked so a later
        // session retries, and stop rather than hammering an API that is evidently unhappy.
        console.warn("Rating backfill stopped:", e.message);
        ratingStatus.lastError = e.message;
        break;
      }
      ratingStatus.asked++;
      // Mark it checked even when Open Library has no rating, so it isn't asked again.
      book.ratingChecked = true;
      if (r.value) {
        book.averageRating = r.value;
        book.ratingsCount = r.count;
        book.ratingSource = "openlibrary";
        ratingStatus.found++;
      }
      if (++pending >= RATING_SAVE_EVERY) flush();
      await new Promise(done => setTimeout(done, RATING_LOOKUP_GAP_MS));
    }
  } finally {
    ratingBackfillRunning = false;
    ratingStatus.running = false;
    if (!ratingStatus.lastError) ratingStatus.lastOk = Date.now();
    flush();
    render();
  }
}

// ---------- Shelf ordering ----------
// Shelves are sorted like a real bookshelf: by the author's surname, then with each series
// kept together in reading order. Sorting happens in shelves() on a derived copy — the stored
// order of state.library is never touched, so export/import and sync are unaffected.

// Trailing honorifics to ignore when finding a surname ("Martin Luther King Jr." -> King).
// Deliberately excludes bare "I"/"V" — too likely to be a real name fragment.
const NAME_SUFFIXES = new Set(["jr", "sr", "ii", "iii", "iv", "phd", "md", "esq"]);
// Surname particles that belong with the surname ("Ursula K. Le Guin" -> Le Guin).
const NAME_PARTICLES = new Set(["de", "del", "della", "der", "di", "du", "da", "dos", "la", "le",
  "van", "von", "ten", "ter", "bin", "al", "mac", "mc", "st"]);

// "Book Three of ..." is as common as "Book 3 of ..." in Google's titles.
const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20,
};
function toNumber(tok) {
  const t = String(tok ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  if (/^\d{1,3}$/.test(t)) return parseInt(t, 10);
  return NUMBER_WORDS[t] ?? null;
}

// Sorts on the surname, falling back to the whole string for mononyms. Unknown authors sort last.
// Splits the primary author into surname + rest, handling honorifics and surname particles.
// Shared by the shelf sort and by the Open Library title/author matcher.
function splitAuthorName(authors) {
  const primary = String(authors || "").split(",")[0].trim();
  if (!primary) return null;
  const parts = primary.split(/\s+/).filter(Boolean);
  while (parts.length > 1 && NAME_SUFFIXES.has(parts[parts.length - 1].toLowerCase().replace(/[.,]/g, ""))) {
    parts.pop();
  }
  if (parts.length === 1) return { surname: parts[0].toLowerCase(), rest: "" };
  let i = parts.length - 1;
  while (i > 0 && NAME_PARTICLES.has(parts[i - 1].toLowerCase().replace(/\.$/, ""))) i--;
  return {
    surname: parts.slice(i).join(" ").toLowerCase(),
    rest: parts.slice(0, i).join(" ").toLowerCase(),
  };
}

function surnameOf(authors) {
  const n = splitAuthorName(authors);
  return n ? n.surname : "";
}

// Sorts on the surname, falling back to the whole string for mononyms. Unknown authors sort last.
function authorSortKey(authors) {
  const n = splitAuthorName(authors);
  if (!n) return "￿";
  return `${n.surname} ${n.rest}`.trim();
}

// Library-style: a leading article doesn't count for alphabetisation.
function titleSortKey(t) {
  return String(t || "").toLowerCase().replace(/^(the|an|a)\s+/, "").trim();
}

function cleanSeriesName(name) {
  return String(name || "")
    .replace(/[\s,:;.–—-]+$/, "")
    .replace(/\s+(series|saga|trilogy|cycle|sequence|chronicles?|novels?|books?)$/i, "")
    .trim();
}

// Best-effort series detection from the metadata we already store, so it works on books
// that were added long before this feature existed. Patterns are deliberately conservative:
// a wrong grouping is worse than no grouping, and anything it misses can be typed in by hand.
function detectSeries(book) {
  const hay = [book.title || "", book.subtitle || ""];

  // "Mistborn: The Final Empire (Mistborn, Book 1)" / "(Discworld #5)" / "(Dune Chronicles, Vol. 2)"
  for (const s of hay) {
    const m = s.match(/\(([^()]{2,60}?)[,;]?\s*(?:#|book|bk\.?|vol(?:ume)?\.?|part|no\.?)\s*(\d{1,3}|[a-z]+)\s*\)/i);
    const n = m && toNumber(m[2]);
    const name = m && cleanSeriesName(m[1]);
    if (name && n) return { name, number: n };
  }
  // "Book Two of the Stormlight Archive" — the article is captured, not dropped, so the name
  // matches the spelling the other patterns produce. (Grouping is article-insensitive anyway.)
  for (const s of hay) {
    const m = s.match(/\b(?:book|volume|vol\.?|part)\s+(\d{1,3}|[a-z]+)\s+(?:of|in)\s+((?:the\s+)?.{2,60}?)\s*$/i);
    const n = m && toNumber(m[1]);
    const name = m && cleanSeriesName(m[2]);
    if (name && n) return { name, number: n };
  }
  // "The Wheel of Time, Book 3" — usually the subtitle.
  for (const s of hay) {
    const m = s.match(/^(.{2,60}?)[,:]\s*(?:book|volume|vol\.?|part|#)\s*(\d{1,3}|[a-z]+)\s*$/i);
    const n = m && toNumber(m[2]);
    const name = m && cleanSeriesName(m[1]);
    if (name && n) return { name, number: n };
  }
  // Named but unnumbered: "A Discworld Novel".
  for (const s of hay) {
    const m = s.match(/\ban?\s+(.{2,40}?)\s+novel\b/i);
    const name = m && cleanSeriesName(m[1]);
    if (name) return { name, number: null };
  }
  return null;
}

// A `series` key present on the book (including "") is a manual override and always wins;
// absent means "nothing typed yet, use detection".
function seriesOf(book) {
  if (book.series !== undefined && book.series !== null) {
    const name = String(book.series).trim();
    if (!name) return null;
    const n = book.seriesNumber;
    return { name, number: Number.isFinite(n) ? n : null };
  }
  return detectSeries(book);
}

function pubYear(b) {
  const m = String(b.publishedDate || "").match(/\d{4}/);
  return m ? parseInt(m[0], 10) : Infinity;
}

function compareBooks(a, b) {
  const ak = authorSortKey(a.authors), bk = authorSortKey(b.authors);
  if (ak !== bk) return ak.localeCompare(bk);

  // Within one author, a series sorts under the series name and a standalone under its own
  // title, so series blocks and one-offs interleave alphabetically rather than segregating.
  const as = seriesOf(a), bs = seriesOf(b);
  const ag = titleSortKey(as ? as.name : a.title);
  const bg = titleSortKey(bs ? bs.name : b.title);
  if (ag !== bg) return ag.localeCompare(bg);

  const an = as && as.number, bn = bs && bs.number;
  if (an != null && bn != null && an !== bn) return an - bn;
  if (an != null && bn == null) return -1;
  if (an == null && bn != null) return 1;

  // No series number to go on: publication order is a decent proxy for reading order.
  const ay = pubYear(a), by = pubYear(b);
  if (ay !== by) return ay - by;
  return titleSortKey(a.title).localeCompare(titleSortKey(b.title));
}

// ---------- Rendering ----------
function shelves() {
  // filter() already returns a fresh array, so sorting here never reorders state.library.
  const shelf = status => state.library.filter(b => b.status === status).sort(compareBooks);
  return { "to-read": shelf("to-read"), reading: shelf("reading"), read: shelf("read") };
}

// Derives everything the Stats view shows from state.library on demand — no separate persisted
// state beyond finishedAt. Books finished before finishedAt existed fall back to addedAt; an
// acknowledged approximation rather than a migration, since this is a single-user app.
function computeStats(scope) {
  const currentYear = new Date().getFullYear();
  const read = state.library.filter(b => b.status === "read");
  const scoped = scope === "year"
    ? read.filter(b => new Date(b.finishedAt || b.addedAt).getFullYear() === currentYear)
    : read;

  const totalPages = scoped.reduce((sum, b) => sum + (b.pageCount || 0), 0);

  const genreCounts = new Map();
  for (const b of scoped) {
    for (const g of (b.categories || "").split(",").map(s => s.trim()).filter(Boolean)) {
      genreCounts.set(g, (genreCounts.get(g) || 0) + 1);
    }
  }
  const topGenres = Array.from(genreCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const longest = scoped.reduce((max, b) => (b.pageCount || 0) > (max?.pageCount || 0) ? b : max, null);

  return { count: scoped.length, totalPages, topGenres, longest };
}

function openDetail(id, source) {
  state.detailId = id;
  state.detailSource = source;
  render();
}

// Looks the book up fresh from its source list each render, rather than snapshotting it at open
// time, so status changes made from within the detail view are reflected immediately.
function getDetailBook() {
  if (!state.detailId) return null;
  const list = state.detailSource === "results" ? state.results : state.library;
  return list.find(b => b.id === state.detailId) || null;
}

function renderResultCard(r) {
  const cover = r.thumbnail
    ? `<img class="cover" src="${esc(r.thumbnail)}" alt="" />`
    : `<div class="cover-fallback">${ICON.book}</div>`;
  const desc = r.description ? `<p class="result-desc">${esc(truncate(r.description, 140))}</p>` : "";
  const added = state.justAdded[r.id];
  const pills = Object.entries(STATUS_META).map(([key, meta]) => `
    <button class="pill ${added === key ? "active" : ""}" data-add="${esc(r.id)}" data-status="${key}">
      ${added === key ? ICON.check : ICON.plus} ${meta.label}
    </button>`).join("");

  return `
    <div class="card result-card">
      <button class="card-open" data-detail="${esc(r.id)}" data-detail-source="results">
        ${cover}
        <div style="flex:1;min-width:0;">
          <div class="result-title">${esc(r.title)}</div>
          <div class="result-author">${esc(r.authors || "Unknown author")}</div>
          ${renderRatingInline(r)}
          ${desc}
        </div>
      </button>
      <div class="pill-row">${pills}</div>
    </div>`;
}

// Face-out book on the shelf: cover art stands upright with a normal horizontal title/author
// caption below it, like a bookstore's face-out display — avoids the readability problems of
// spine-style vertical text while keeping the wood-shelf visual identity.
function renderShelfItem(book) {
  const label = `${book.title} by ${book.authors || "Unknown author"}`;
  const cover = book.thumbnail
    ? `<img class="shelf-cover" src="${esc(book.thumbnail)}" alt="" />`
    : `<div class="shelf-cover shelf-cover-fallback" style="background:${spineColor(book.title || book.id)}">${ICON.book}</div>`;
  const mark = OWNERSHIP_META[book.owned];
  const badge = mark
    ? `<span class="shelf-badge" style="--badge:${mark.color}" aria-hidden="true">${mark.icon}</span>`
    : "";
  return `
    <button class="shelf-item" data-detail="${esc(book.id)}" data-detail-source="library" aria-label="${esc(mark ? `${label} — ${mark.label}` : label)}">
      <span class="shelf-cover-wrap">${cover}${badge}</span>
      <span class="shelf-item-title">${esc(book.title)}</span>
      <span class="shelf-item-author">${esc(book.authors || "Unknown author")}</span>
      ${renderRatingCompact(book)}
    </button>`;
}

function renderEmpty(icon, text) {
  return `<div class="empty">${icon}<span>${text}</span></div>`;
}

function renderHeader(title, subtitle) {
  return `
    <div class="header">
      <div class="header-row">
        <div>
          <h1>${title}</h1>
          <p>${subtitle}</p>
        </div>
        <button class="icon-btn settings-btn" id="settings-btn" aria-label="Settings">${ICON.gear}</button>
      </div>
    </div>`;
}

function renderAddTab() {
  let resultsHtml = "";
  if (state.searching) {
    resultsHtml = `<div class="status-line">${ICON.loader}<span class="spin-wrap"></span> Searching…</div>`;
  } else if (state.searchError) {
    resultsHtml = `<div class="status-line error">${ICON.alert} ${esc(state.searchError)}</div>`;
  } else if (state.results.length > 0) {
    resultsHtml = state.results.map(renderResultCard).join("");
  } else {
    resultsHtml = renderEmpty(ICON.search, "Search by title, author, or ISBN — or tap the camera to scan a barcode.");
  }

  return `
    ${renderHeader("Spine", "Scan a barcode or search to add a book to your shelves.")}
    <div class="search-row">
      <div class="search-box">
        <div class="search-input-wrap">
          ${ICON.search}
          <input id="search-input" placeholder="Title, author, or ISBN" value="${escAttr(state.query)}" />
        </div>
        <button class="icon-btn" id="scan-btn" aria-label="Scan barcode">${ICON.camera}</button>
      </div>
      <button class="primary-btn" id="search-btn">Search</button>
    </div>
    <div class="list">${resultsHtml}</div>
  `;
}

function renderShelfTab() {
  const s = shelves()[state.tab];
  const meta = STATUS_META[state.tab];
  const emptyText = {
    "to-read": "Nothing queued yet. Search or scan a book to add it here.",
    reading: "Not reading anything right now. Move a book here when you start it.",
    read: "Your finished shelf is empty. Books you finish will land here.",
  }[state.tab];

  const body = s.length === 0
    ? renderEmpty(meta.icon, emptyText)
    : `<div class="shelf-case">${s.map(renderShelfItem).join("")}</div>`;

  const count = `${s.length} book${s.length === 1 ? "" : "s"}`;
  const toBuy = state.tab === "to-read" ? s.filter(b => b.owned === "buy").length : 0;
  const subtitle = toBuy ? `${count} · ${toBuy} to buy` : count;

  return `
    ${renderHeader(meta.label, subtitle)}
    <div class="list">${body}</div>
  `;
}

function renderScanner() {
  if (!state.scanning) return "";
  return `
    <div class="scanner-overlay" id="scanner-overlay">
      <div class="scanner-close-row">
        <button class="scanner-close" id="scanner-close">${ICON.x}</button>
      </div>
      <div class="scanner-body" id="scanner-body">
        <div class="scanner-msg">
          ${ICON.loader}
          <p style="margin-top:10px;">Opening camera…</p>
        </div>
      </div>
      <div class="scanner-hint" id="scanner-hint"></div>
    </div>
  `;
}

function renderDetail() {
  const book = getDetailBook();
  if (!book) return "";

  const cover = book.thumbnail
    ? `<img class="detail-cover" src="${esc(book.thumbnail)}" alt="" />`
    : `<div class="detail-cover-fallback">${ICON.book}</div>`;

  const metaRows = [];
  if (book.publisher || book.publishedDate) metaRows.push([book.publisher, book.publishedDate].filter(Boolean).join(" · "));
  if (book.pageCount) metaRows.push(`${book.pageCount} pages`);
  if (book.categories) metaRows.push(book.categories);
  if (book.language) metaRows.push(book.language.toUpperCase());

  const r = ratingOf(book);
  const rating = r ? `
    <div class="detail-rating">${starGlyphs(r.value)}
      <span>${esc(r.value.toFixed(1))}${r.count ? ` \u00b7 ${formatCount(r.count)} ratings` : ""}${
        r.source === "openlibrary" ? " \u00b7 Open Library" : ""}</span>
    </div>` : "";

  const desc = book.description
    ? `<p class="detail-desc">${esc(book.description)}</p>`
    : `<p class="detail-desc detail-desc-empty">No description available.</p>`;

  const isLibraryBook = state.detailSource === "library";
  const added = state.justAdded[book.id];
  const actionPills = isLibraryBook
    ? Object.entries(STATUS_META).map(([key, meta]) => `
        <button class="pill ${book.status === key ? "active" : ""}" data-setstatus="${esc(book.id)}" data-status="${key}">
          ${meta.icon} ${meta.label}
        </button>`).join("") + `<button class="pill danger" data-remove="${esc(book.id)}">${ICON.trash} Remove</button>`
    : Object.entries(STATUS_META).map(([key, meta]) => `
        <button class="pill ${added === key ? "active" : ""}" data-add="${esc(book.id)}" data-status="${key}">
          ${added === key ? ICON.check : ICON.plus} ${meta.label}
        </button>`).join("");

  const ownRow = isLibraryBook
    ? `<div class="detail-field">
        <span class="detail-field-label">Where is it?</span>
        <div class="pill-row">${Object.entries(OWNERSHIP_META).map(([key, meta]) => `
          <button class="pill own-pill ${book.owned === key ? "active" : ""}"
                  style="${book.owned === key ? `--own-color:${meta.color}` : ""}"
                  data-owned="${esc(book.id)}" data-mark="${key}"
                  aria-pressed="${book.owned === key}">
            ${meta.icon} ${meta.label}
          </button>`).join("")}</div>
      </div>`
    : "";

  const ser = isLibraryBook ? seriesOf(book) : null;
  const detected = isLibraryBook && book.series === undefined && ser;
  const seriesBlock = isLibraryBook
    ? `<div class="detail-field">
        <span class="detail-field-label">Series</span>
        <div class="series-row">
          <input class="series-input" id="series-name" value="${escAttr(ser ? ser.name : "")}"
                 placeholder="Not in a series" aria-label="Series name" />
          <input class="series-input series-num" id="series-num" type="number" min="1" step="1"
                 inputmode="numeric" value="${ser && ser.number != null ? ser.number : ""}"
                 placeholder="#" aria-label="Number in series" />
        </div>
        <span class="series-hint">${detected
          ? "Detected from the title — correct it here if it's wrong."
          : "Books in a series sort together, in number order."}</span>
      </div>`
    : "";

  const link = book.previewLink
    ? `<a class="detail-link" href="${esc(book.previewLink)}" target="_blank" rel="noopener">View on Google Books</a>`
    : "";

  return `
    <div class="scanner-overlay" id="detail-overlay">
      <div class="scanner-close-row">
        <button class="scanner-close" id="detail-close">${ICON.x}</button>
      </div>
      <div class="detail-body">
        ${cover}
        <h2 class="detail-title">${esc(book.title)}</h2>
        ${book.subtitle ? `<p class="detail-subtitle">${esc(book.subtitle)}</p>` : ""}
        <p class="detail-author">${esc(book.authors || "Unknown author")}</p>
        ${metaRows.length ? `<p class="detail-meta">${esc(metaRows.join(" · "))}</p>` : ""}
        ${rating}
        ${desc}
        <div class="pill-row">${actionPills}</div>
        ${ownRow}
        ${seriesBlock}
        ${link}
      </div>
    </div>
  `;
}

function renderSyncSection() {
  if (state.syncCode) {
    const statusText = {
      idle: "Not synced yet",
      syncing: "Syncing…",
      synced: "Synced",
      error: "Sync error — check your connection",
    }[state.syncStatus] || "";
    return `
      <p class="settings-hint">This device is linked. Enter the same code on another device to sync it too.</p>
      <div class="sync-code-row">
        <code class="sync-code">${esc(state.syncCode)}</code>
        <button class="pill" id="copy-code-btn">Copy</button>
      </div>
      <p class="sync-status">${esc(statusText)}</p>
      <button class="pill danger" id="stop-sync-btn">Stop syncing this device</button>
    `;
  }
  return `
    <p class="settings-hint">Link this device to another to keep your library in sync automatically.</p>
    <button class="primary-btn" id="start-sync-btn">Start syncing (new code)</button>
    <div class="sync-join-row">
      <input id="sync-code-input" placeholder="Enter a sync code" value="${esc(state.syncCodeInput)}" />
      <button class="secondary-btn" id="join-sync-btn">Link</button>
    </div>
  `;
}

function renderRatingsSection() {
  const c = ratingCounts();
  let line;
  if (ratingStatus.running) {
    line = `Checking Open Library\u2026`;
  } else if (ratingStatus.lastError) {
    line = `Last check failed: ${esc(ratingStatus.lastError)}`;
  } else if (ratingStatus.asked) {
    line = `Checked ${ratingStatus.asked} book${ratingStatus.asked === 1 ? "" : "s"}, found ${ratingStatus.found} rating${ratingStatus.found === 1 ? "" : "s"}.`;
  } else if (c.pending) {
    line = `${c.pending} book${c.pending === 1 ? "" : "s"} still to check.`;
  } else {
    line = `Nothing left to check.`;
  }

  const breakdown = [
    // Shown even at zero once anything has been checked: "0 from Open Library" alongside a
    // pile of checked books is the signature of a parsing problem, and silence would hide it.
    (c.fromOpenLibrary || c.checkedNoRating) ? `${c.fromOpenLibrary} from Open Library` : "",
    c.checkedNoRating ? `${c.checkedNoRating} checked, no rating found` : "",
    c.unsupported ? `${c.unsupported} can't be looked up (no ISBN)` : "",
  ].filter(Boolean).join(" \u00b7 ");

  return `
    <p class="settings-hint">
      ${c.rated} of ${c.total} book${c.total === 1 ? "" : "s"} have a rating.
      ${breakdown ? `<br><span class="settings-subhint">${breakdown}.</span>` : ""}
    </p>
    <p class="settings-hint ${ratingStatus.lastError ? "settings-hint-error" : ""}">${line}</p>
    <button class="secondary-btn" id="ratings-check-btn" ${ratingStatus.running ? "disabled" : ""}>
      ${ratingStatus.running ? "Checking\u2026" : "Check for ratings now"}
    </button>`;
}

function renderSettings() {
  if (!state.settingsOpen) return "";
  return `
    <div class="scanner-overlay" id="settings-overlay">
      <div class="scanner-close-row">
        <button class="scanner-close" id="settings-close">${ICON.x}</button>
      </div>
      <div class="settings-body">
        <h2 class="settings-title">Settings</h2>
        <div class="settings-section">
          <h3>Reading stats</h3>
          <p class="settings-hint">See how much you've read — books finished, pages, favorite genres.</p>
          <button class="secondary-btn" id="stats-btn">View reading stats</button>
        </div>
        <div class="settings-section">
          <h3>Backup</h3>
          <p class="settings-hint">Save your library as a file, or restore one you saved earlier.</p>
          <div class="settings-actions">
            <button class="primary-btn" id="export-btn">Export library</button>
            <button class="secondary-btn" id="import-btn">Import library</button>
            <input type="file" id="import-file" accept="application/json" style="display:none" />
          </div>
        </div>
        <div class="settings-section">
          <h3>Ratings</h3>
          ${renderRatingsSection()}
        </div>
        <div class="settings-section">
          <h3>Sync across devices</h3>
          ${renderSyncSection()}
        </div>
      </div>
    </div>
  `;
}

function renderStats() {
  if (!state.statsOpen) return "";
  const stats = computeStats(state.statsScope);

  const body = stats.count === 0
    ? renderEmpty(ICON.check, state.statsScope === "year"
        ? "No books finished yet this year — mark one Read to see your stats here."
        : "No books finished yet — mark one Read to see your stats here.")
    : `
      <div class="stat-tiles">
        <div class="stat-tile">
          <div class="stat-number">${stats.count}</div>
          <div class="stat-label">book${stats.count === 1 ? "" : "s"} read</div>
        </div>
        <div class="stat-tile">
          <div class="stat-number">${stats.totalPages.toLocaleString()}</div>
          <div class="stat-label">pages read</div>
        </div>
      </div>
      ${stats.topGenres.length ? `
        <div class="settings-section">
          <h3>Top genres</h3>
          <div class="stats-genre-list">
            ${stats.topGenres.map(([g, c]) => `
              <div class="stats-genre-row">
                <span>${esc(g)}</span>
                <span class="stats-genre-count">${c}</span>
              </div>`).join("")}
          </div>
        </div>` : ""}
      ${stats.longest && stats.longest.pageCount ? `
        <p class="stats-fact">Longest read: <strong>${esc(stats.longest.title)}</strong> (${stats.longest.pageCount} pages)</p>
      ` : ""}
    `;

  return `
    <div class="scanner-overlay" id="stats-overlay">
      <div class="scanner-close-row">
        <button class="scanner-close" id="stats-close">${ICON.x}</button>
      </div>
      <div class="stats-body">
        <h2 class="settings-title">Reading Stats</h2>
        <div class="pill-row stats-scope-row">
          <button class="pill ${state.statsScope === "year" ? "active" : ""}" data-statsscope="year">This Year</button>
          <button class="pill ${state.statsScope === "all" ? "active" : ""}" data-statsscope="all">All Time</button>
        </div>
        ${body}
      </div>
    </div>
  `;
}

function render() {
  const app = document.getElementById("app");
  const sh = shelves();
  const tabsHtml = TABS.map(t => {
    const active = state.tab === t.key;
    const count = t.key !== "add" ? sh[t.key].length : null;
    return `
      <button class="tab-btn ${active ? "active" : ""}" data-tab="${t.key}">
        ${t.icon}
        <span>${t.label}${count ? " · " + count : ""}</span>
      </button>`;
  }).join("");

  app.innerHTML = `
    <div class="content">
      ${state.tab === "add" ? renderAddTab() : renderShelfTab()}
    </div>
    <div class="tabbar">${tabsHtml}</div>
    <div class="version-tag">v${APP_VERSION}</div>
    ${renderScanner()}
    ${renderDetail()}
    ${renderSettings()}
    ${renderStats()}
  `;

  attachEvents();
  if (state.scanning) startScanner();
}

function attachEvents() {
  document.querySelectorAll("[data-tab]").forEach(el => {
    el.addEventListener("click", () => { state.tab = el.dataset.tab; render(); });
  });

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", e => { state.query = e.target.value; });
    searchInput.addEventListener("keydown", e => {
      if (e.key === "Enter") runSearch(state.query);
    });
    // restore focus/cursor if it was focused before re-render
  }
  const searchBtn = document.getElementById("search-btn");
  if (searchBtn) searchBtn.addEventListener("click", () => runSearch(state.query));

  const scanBtn = document.getElementById("scan-btn");
  if (scanBtn) scanBtn.addEventListener("click", () => { state.scanning = true; render(); });

  document.querySelectorAll("[data-add]").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.dataset.add;
      const status = el.dataset.status;
      const book = state.results.find(r => r.id === id);
      if (book) addBook(book, status);
    });
  });
  document.querySelectorAll("[data-setstatus]").forEach(el => {
    el.addEventListener("click", () => setStatus(el.dataset.setstatus, el.dataset.status));
  });
  document.querySelectorAll("[data-owned]").forEach(el => {
    el.addEventListener("click", () => setOwnership(el.dataset.owned, el.dataset.mark));
  });
  const seriesName = document.getElementById("series-name");
  const seriesNum = document.getElementById("series-num");
  if (seriesName && seriesNum) {
    // "change" (not "input") so a save + re-render only happens once the field is committed.
    const saveSeries = () => setSeries(state.detailId, seriesName.value, seriesNum.value);
    seriesName.addEventListener("change", saveSeries);
    seriesNum.addEventListener("change", saveSeries);
  }
  document.querySelectorAll("[data-remove]").forEach(el => {
    el.addEventListener("click", () => removeBook(el.dataset.remove));
  });

  const scannerClose = document.getElementById("scanner-close");
  if (scannerClose) scannerClose.addEventListener("click", stopScanner);

  document.querySelectorAll("[data-detail]").forEach(el => {
    el.addEventListener("click", () => openDetail(el.dataset.detail, el.dataset.detailSource));
  });
  const detailClose = document.getElementById("detail-close");
  if (detailClose) detailClose.addEventListener("click", () => { state.detailId = null; render(); });

  const versionTag = document.querySelector(".version-tag");
  if (versionTag) versionTag.addEventListener("click", forceRefresh);

  const ratingsCheckBtn = document.getElementById("ratings-check-btn");
  if (ratingsCheckBtn) ratingsCheckBtn.addEventListener("click", () => backfillRatings({ manual: true }));

  const settingsBtn = document.getElementById("settings-btn");
  if (settingsBtn) settingsBtn.addEventListener("click", () => { state.settingsOpen = true; render(); });
  const settingsClose = document.getElementById("settings-close");
  if (settingsClose) settingsClose.addEventListener("click", () => { state.settingsOpen = false; render(); });

  const exportBtn = document.getElementById("export-btn");
  if (exportBtn) exportBtn.addEventListener("click", exportLibrary);

  const importBtn = document.getElementById("import-btn");
  const importFile = document.getElementById("import-file");
  if (importBtn && importFile) {
    importBtn.addEventListener("click", () => importFile.click());
    importFile.addEventListener("change", () => {
      const file = importFile.files[0];
      if (file) importLibraryFile(file);
      importFile.value = "";
    });
  }

  const startSyncBtn = document.getElementById("start-sync-btn");
  if (startSyncBtn) startSyncBtn.addEventListener("click", () => enableSync(generateSyncCode()));

  const syncCodeInput = document.getElementById("sync-code-input");
  if (syncCodeInput) syncCodeInput.addEventListener("input", e => { state.syncCodeInput = e.target.value; });

  const joinSyncBtn = document.getElementById("join-sync-btn");
  if (joinSyncBtn) joinSyncBtn.addEventListener("click", () => {
    const code = state.syncCodeInput.trim().toUpperCase();
    if (code) enableSync(code);
  });

  const copyCodeBtn = document.getElementById("copy-code-btn");
  if (copyCodeBtn) copyCodeBtn.addEventListener("click", () => {
    navigator.clipboard?.writeText(state.syncCode).then(() => {
      copyCodeBtn.textContent = "Copied";
      setTimeout(() => { copyCodeBtn.textContent = "Copy"; }, 1500);
    }).catch(() => {});
  });

  const stopSyncBtn = document.getElementById("stop-sync-btn");
  if (stopSyncBtn) stopSyncBtn.addEventListener("click", () => {
    const msg = "Stop syncing this device? Your books will stay here but won't update from other devices anymore.";
    if (confirm(msg)) disableSync();
  });

  const statsBtn = document.getElementById("stats-btn");
  if (statsBtn) statsBtn.addEventListener("click", () => { state.settingsOpen = false; state.statsOpen = true; render(); });
  const statsClose = document.getElementById("stats-close");
  if (statsClose) statsClose.addEventListener("click", () => { state.statsOpen = false; render(); });
  document.querySelectorAll("[data-statsscope]").forEach(el => {
    el.addEventListener("click", () => { state.statsScope = el.dataset.statsscope; render(); });
  });
}

// Tapping the version badge unregisters the service worker, wipes its caches (Cache Storage
// only — never touches localStorage, so the book library is untouched), re-registers with HTTP
// caching disabled so sw.js itself can't be served stale, then navigates to a cache-busted URL so
// the reload's own HTTP request for index.html/app.js can't be served from browser disk cache
// either. A manual escape hatch for whenever you want to guarantee you're on the latest deploy.
async function forceRefresh() {
  const tag = document.querySelector(".version-tag");
  if (tag) tag.textContent = "Updating…";
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register("sw.js", { updateViaCache: "none" });
    }
  } finally {
    location.replace(location.pathname + "?_=" + Date.now());
  }
}

// ---------- Barcode scanner ----------
let scannerStream = null;
let scannerRaf = null;

async function startScanner() {
  const body = document.getElementById("scanner-body");
  const hint = document.getElementById("scanner-hint");
  if (!body) return;

  if (!("BarcodeDetector" in window)) {
    body.innerHTML = `
      <div class="scanner-msg">
        ${ICON.alert}
        <p>Barcode scanning isn't supported in this browser. Use the search box to add books by title or ISBN instead.</p>
        <button class="primary-btn" id="scanner-ok" style="margin-top:6px;">Got it</button>
      </div>`;
    document.getElementById("scanner-ok")?.addEventListener("click", stopScanner);
    return;
  }

  try {
    scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    body.innerHTML = `<div class="scanner-frame"><video id="scanner-video" muted playsinline></video></div>`;
    const video = document.getElementById("scanner-video");
    video.srcObject = scannerStream;
    await video.play();
    if (hint) hint.textContent = "Point the camera at a book's barcode";

    const detector = new window.BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e"] });
    const tick = async () => {
      if (!state.scanning) return;
      try {
        const codes = await detector.detect(video);
        if (codes.length > 0) {
          const isbn = codes[0].rawValue;
          stopScanner();
          state.query = isbn;
          runSearch(isbn);
          return;
        }
      } catch (e) { /* keep trying */ }
      scannerRaf = requestAnimationFrame(tick);
    };
    scannerRaf = requestAnimationFrame(tick);
  } catch (e) {
    body.innerHTML = `
      <div class="scanner-msg">
        ${ICON.alert}
        <p>Camera access wasn't granted. Use the search box to add books by title or ISBN instead.</p>
        <button class="primary-btn" id="scanner-ok" style="margin-top:6px;">Got it</button>
      </div>`;
    document.getElementById("scanner-ok")?.addEventListener("click", stopScanner);
  }
}

function stopScanner() {
  state.scanning = false;
  if (scannerRaf) cancelAnimationFrame(scannerRaf);
  if (scannerStream) scannerStream.getTracks().forEach(t => t.stop());
  scannerStream = null;
  render();
}

// ---------- Boot ----------

// 100dvh alone doesn't reliably match the real usable viewport on some mobile browsers (notably
// installed PWAs, where the on-screen keyboard or browser chrome can throw it off), which was
// leaving the bottom tab bar cut off and requiring a scroll to reach it. Track the real height
// via window.innerHeight instead and feed it in as --app-height, with 100dvh as a pre-JS fallback.
function setAppHeight() {
  document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
}
setAppHeight();
window.addEventListener("resize", setAppHeight);
window.addEventListener("orientationchange", setAppHeight);

render();

// Top up missing ratings in the background, after the first paint has settled.
setTimeout(backfillRatings, 2000);

// If this device was already linked to a sync code, silently reconcile with the cloud on boot
// (safe to re-run every load — see enableSync's doc comment) rather than waiting for a save.
if (state.syncCode) enableSync(state.syncCode);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).catch(() => {});
  });
}
