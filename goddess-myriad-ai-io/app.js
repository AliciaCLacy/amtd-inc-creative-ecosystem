/* Goddess Myriad AI.io — Phase 1: the living library.
   Static only. No external paid services. Authored Alicia C. Lacy. */

const state = {
  creations: [],
  query: "",
  category: "",
};

const $ = (sel) => document.querySelector(sel);

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------- views ---------- */
function showView(name) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.getElementById("view-" + name).classList.add("active");
  document.querySelectorAll(".nav-links button").forEach((b) =>
    b.classList.toggle("active", b.dataset.view === name)
  );
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- library ---------- */
function uniqueCategories() {
  const set = new Set(state.creations.map((c) => c.category).filter(Boolean));
  return [...set].sort((a, b) => a.localeCompare(b));
}

function populateCategoryFilter() {
  const sel = $("#catFilter");
  uniqueCategories().forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    sel.appendChild(opt);
  });
}

function filtered() {
  const q = state.query.trim().toLowerCase();
  return state.creations.filter((c) => {
    const okCat = !state.category || c.category === state.category;
    const okQ =
      !q ||
      (c.name || "").toLowerCase().includes(q) ||
      (c.category || "").toLowerCase().includes(q) ||
      (c.status || "").toLowerCase().includes(q);
    return okCat && okQ;
  });
}

function renderGrid() {
  const list = filtered();
  const grid = $("#grid");
  $("#countLine").innerHTML =
    "Showing <strong>" + list.length + "</strong> of <strong>" +
    state.creations.length + "</strong> creations";
  if (!list.length) {
    grid.innerHTML = '<div class="empty">Nothing in the library matches that yet, love.</div>';
    return;
  }
  grid.innerHTML = list
    .map(
      (c) =>
        '<article class="card bevel" data-id="' + c.id + '" tabindex="0">' +
        "<h3>" + esc(c.name) + "</h3>" +
        '<div class="meta">' +
        '<span class="chip">' + esc(c.category || "Uncategorized") + "</span>" +
        (c.date ? '<span class="chip dim">' + esc(c.date) + "</span>" : "") +
        "</div></article>"
    )
    .join("");
  grid.querySelectorAll(".card").forEach((el) => {
    el.addEventListener("click", () => openDetail(Number(el.dataset.id)));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openDetail(Number(el.dataset.id));
    });
  });
}

function openDetail(id) {
  const c = state.creations.find((x) => x.id === id);
  if (!c) return;
  $("#modalBody").innerHTML =
    "<h2>" + esc(c.name) + "</h2>" +
    "<dl class=\"kv\">" +
    "<dt>Category</dt><dd>" + esc(c.category || "—") + "</dd>" +
    "<dt>Date</dt><dd>" + esc(c.date || "—") + "</dd>" +
    "<dt>Status</dt><dd>" + esc(c.status || "—") + "</dd>" +
    "<dt>Author</dt><dd>" + esc(c.author || "Alicia C. Lacy") + "</dd>" +
    "</dl>" +
    '<p style="color:var(--ink-dim);font-size:0.88rem">Dates and authorship are how these works are claimed. Nothing here is ever removed.</p>';
  $("#modalBack").classList.add("open");
}

function closeDetail() {
  $("#modalBack").classList.remove("open");
}

/* ---------- home ---------- */
function renderHome() {
  const cats = uniqueCategories();
  $("#statCreations").textContent = state.creations.length;
  $("#statCats").textContent = cats.length;
  const dated = state.creations.filter((c) => c.date).length;
  $("#statDated").textContent = dated;

  // latest additions by id (tracker order = filing order)
  const latest = state.creations.slice(-6).reverse();
  $("#latestGrid").innerHTML = latest
    .map(
      (c) =>
        '<article class="card bevel" data-id="' + c.id + '">' +
        "<h3>" + esc(c.name) + "</h3>" +
        '<div class="meta"><span class="chip">' + esc(c.category || "Uncategorized") + "</span>" +
        (c.date ? '<span class="chip dim">' + esc(c.date) + "</span>" : "") +
        "</div></article>"
    )
    .join("");
  document.querySelectorAll("#latestGrid .card").forEach((el) =>
    el.addEventListener("click", () => openDetail(Number(el.dataset.id)))
  );
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-links button").forEach((b) =>
    b.addEventListener("click", () => showView(b.dataset.view))
  );
  $("#brandHome").addEventListener("click", (e) => {
    e.preventDefault();
    showView("home");
  });

  $("#searchBox").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderGrid();
  });
  $("#catFilter").addEventListener("change", (e) => {
    state.category = e.target.value;
    renderGrid();
  });

  $("#modalBack").addEventListener("click", (e) => {
    if (e.target.id === "modalBack") closeDetail();
  });
  $("#modalClose").addEventListener("click", closeDetail);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetail();
  });

  fetch("creations.json")
    .then((r) => {
      if (!r.ok) throw new Error("creations.json failed to load");
      return r.json();
    })
    .then((data) => {
      state.creations = data.creations || [];
      populateCategoryFilter();
      renderGrid();
      renderHome();
    })
    .catch((err) => {
      $("#grid").innerHTML =
        '<div class="empty">The library could not be loaded. ' + esc(err.message) + "</div>";
    });
});
