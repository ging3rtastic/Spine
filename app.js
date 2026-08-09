// ---------- Icons (inline SVG, stroke style to match lucide look) ----------
const ICON = {
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  camera: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  x: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  chevron: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  trash: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>`,
  bookmark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  book: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  check: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  plus: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`,
  alert: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>`,
  loader: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
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
  openRowId: null,
  justAdded: {},
};

function loadLibrary() {
  try {
    const raw = localStorage.getItem("spine.library");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
function saveLibrary() {
  try {
    localStorage.setItem("spine.library", JSON.stringify(state.library));
  } catch (e) {
    console.error("Couldn't save library", e);
  }
}

// ---------- Google Books lookup ----------
async function lookupBooks(query) {
  const isIsbn = /^[0-9]{9,13}$/.test(query.replace(/-/g, ""));
  const q = isIsbn ? `isbn:${query.replace(/-/g, "")}` : query;
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=10`);
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
      authors: (v.authors || []).join(", "),
      description: v.description || "",
      thumbnail: v.imageLinks?.thumbnail?.replace("http://", "https://") || null,
      pageCount: v.pageCount || null,
    };
  });
}

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s ?? "";
  return d.innerHTML;
}
function truncate(s, n) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

// ---------- Actions ----------
async function runSearch(q) {
  if (!q.trim()) return;
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
  }
}

function addBook(book, status) {
  const existing = state.library.find(b => b.id === book.id);
  if (existing) {
    existing.status = status;
  } else {
    state.library.unshift({ ...book, status, addedAt: Date.now() });
  }
  saveLibrary();
  state.justAdded[book.id] = status;
  render();
}
function setStatus(id, status) {
  const b = state.library.find(x => x.id === id);
  if (b) b.status = status;
  saveLibrary();
  render();
}
function removeBook(id) {
  state.library = state.library.filter(b => b.id !== id);
  saveLibrary();
  render();
}

// ---------- Rendering ----------
function shelves() {
  return {
    "to-read": state.library.filter(b => b.status === "to-read"),
    reading: state.library.filter(b => b.status === "reading"),
    read: state.library.filter(b => b.status === "read"),
  };
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
      ${cover}
      <div style="flex:1;min-width:0;">
        <div class="result-title">${esc(r.title)}</div>
        <div class="result-author">${esc(r.authors || "Unknown author")}</div>
        ${desc}
        <div class="pill-row">${pills}</div>
      </div>
    </div>`;
}

function renderRow(book) {
  const spine = spineColor(book.title || book.id);
  const open = state.openRowId === book.id;
  const thumb = book.thumbnail
    ? `<img class="row-thumb" src="${esc(book.thumbnail)}" alt="" />`
    : `<div class="row-thumb-fallback">${ICON.book}</div>`;
  const desc = book.description ? `<p class="row-desc">${esc(truncate(book.description, 400))}</p>` : "";
  const pills = Object.entries(STATUS_META).map(([key, meta]) => `
    <button class="pill ${book.status === key ? "active" : ""}" data-setstatus="${esc(book.id)}" data-status="${key}">
      ${meta.icon} ${meta.label}
    </button>`).join("");

  return `
    <div class="card">
      <button class="row-btn" data-togglerow="${esc(book.id)}">
        <div class="spine-bar" style="background:${spine}"></div>
        <div class="row-main">
          ${thumb}
          <div style="min-width:0;flex:1;">
            <div class="row-title">${esc(book.title)}</div>
            <div class="row-author">${esc(book.authors || "Unknown author")}</div>
          </div>
          <div class="chevron ${open ? "open" : ""}">${ICON.chevron}</div>
        </div>
      </button>
      <div class="row-detail ${open ? "open" : ""}">
        ${desc}
        <div class="pill-row">
          ${pills}
          <button class="pill danger" data-remove="${esc(book.id)}">${ICON.trash} Remove</button>
        </div>
      </div>
    </div>`;
}

function renderEmpty(icon, text) {
  return `<div class="empty">${icon}<span>${text}</span></div>`;
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
    <div class="header">
      <h1>Spine</h1>
      <p>Scan a barcode or search to add a book to your shelves.</p>
    </div>
    <div class="search-row">
      <div class="search-box">
        <div class="search-input-wrap">
          ${ICON.search}
          <input id="search-input" placeholder="Title, author, or ISBN" value="${esc(state.query)}" />
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

  const body = s.length === 0 ? renderEmpty(meta.icon, emptyText) : s.map(renderRow).join("");

  return `
    <div class="header">
      <h1>${meta.label}</h1>
      <p>${s.length} book${s.length === 1 ? "" : "s"}</p>
    </div>
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
    ${renderScanner()}
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
  document.querySelectorAll("[data-togglerow]").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.dataset.togglerow;
      state.openRowId = state.openRowId === id ? null : id;
      render();
    });
  });
  document.querySelectorAll("[data-setstatus]").forEach(el => {
    el.addEventListener("click", () => setStatus(el.dataset.setstatus, el.dataset.status));
  });
  document.querySelectorAll("[data-remove]").forEach(el => {
    el.addEventListener("click", () => removeBook(el.dataset.remove));
  });

  const scannerClose = document.getElementById("scanner-close");
  if (scannerClose) scannerClose.addEventListener("click", stopScanner);
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
render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
