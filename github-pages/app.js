const defaultStores = [
  { id: "store_sar_main", slug: "sar-main-store", name: "SAR Main Store", industry: "General Commerce", status: "ACTIVE", plan: "PRO", owner: "SAIFUL ALAM RAFI", email: "admin@sarindustriesnetwork.com", orders: 428, health: 98, revenue: "$12.4K", audit: ["Static preview loaded", "Owner assigned", "Local browser runtime ready"] },
  { id: "store_demo_fashion", slug: "demo-fashion-store", name: "Demo Fashion Store", industry: "Fashion Retail", status: "DRAFT", plan: "STARTER", owner: "Store Manager", email: "manager@example.com", orders: 64, health: 87, revenue: "$1.8K", audit: ["Draft created", "Theme selected", "Owner invited"] },
  { id: "store_b2b_network", slug: "b2b-network-store", name: "B2B Network Store", industry: "Wholesale", status: "PAUSED", plan: "ENTERPRISE", owner: "Operations Lead", email: "ops@example.com", orders: 973, health: 91, revenue: "$28.9K", audit: ["Paused for review", "B2B catalog imported", "Enterprise plan enabled"] }
];

const storeKey = "sar_pages_stores_v2";
const view = document.querySelector("#view");
const navLinks = [...document.querySelectorAll(".nav a")];

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));
}
function normalizeStore(store, index = 0) {
  return {
    id: String(store.id || `store_${Date.now()}_${index}`),
    slug: slugify(store.slug || store.name || "new-store"),
    name: String(store.name || "Untitled Store").slice(0, 80),
    industry: String(store.industry || "General Commerce").slice(0, 80),
    status: ["ACTIVE", "DRAFT", "PAUSED", "SUSPENDED"].includes(store.status) ? store.status : "DRAFT",
    plan: ["FREE", "STARTER", "PRO", "ENTERPRISE"].includes(store.plan) ? store.plan : "FREE",
    owner: String(store.owner || "New Owner").slice(0, 80),
    email: String(store.email || "owner@example.com").slice(0, 120),
    orders: Number.isFinite(Number(store.orders)) ? Number(store.orders) : 0,
    health: Math.min(100, Math.max(0, Number(store.health || 82))),
    revenue: String(store.revenue || "$0").slice(0, 30),
    audit: Array.isArray(store.audit) ? store.audit.map((item) => String(item).slice(0, 120)).slice(0, 8) : ["Preview data normalized"]
  };
}
function getStores() {
  try {
    const stored = JSON.parse(localStorage.getItem(storeKey));
    if (Array.isArray(stored) && stored.length) return stored.map(normalizeStore);
  } catch {}
  return defaultStores.map(normalizeStore);
}
function saveStores(stores) { localStorage.setItem(storeKey, JSON.stringify(stores.map(normalizeStore))); }
function slugify(value) { return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "new-store"; }
function metrics() {
  const stores = getStores();
  const active = stores.filter((store) => store.status === "ACTIVE").length;
  const orders = stores.reduce((sum, store) => sum + Number(store.orders || 0), 0);
  const health = Math.round(stores.reduce((sum, store) => sum + Number(store.health || 0), 0) / Math.max(stores.length, 1));
  return { total: stores.length, active, orders, health };
}
function card(title, value, note) {
  return `<div class="card"><p class="muted">${escapeHtml(title)}</p><h2>${escapeHtml(value)}</h2><p class="muted">${escapeHtml(note)}</p></div>`;
}
function setActive(route) {
  navLinks.forEach((link) => link.classList.toggle("active", link.dataset.route === route));
}
function downloadJson() {
  const blob = new Blob([JSON.stringify(getStores(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sar-stores-preview.json";
  a.click();
  URL.revokeObjectURL(url);
}
function resetData() {
  if (!confirm("Reset preview store data?")) return;
  localStorage.removeItem(storeKey);
  renderStores();
}
function renderHome() {
  const m = metrics();
  view.innerHTML = `<div class="grid">${card("Platform", "Ready", "GitHub Pages preview")}${card("Stores", m.total, "Browser data")}${card("Active", m.active, "Live-like status")}${card("Health", m.health + "%", "Preview score")}</div>`;
}
function renderAdmin() {
  const m = metrics();
  view.innerHTML = `<div class="grid">${card("Command Center", "Online", "Static browser runtime")}${card("Stores", m.total, "Managed stores")}${card("Orders", m.orders, "Sample count")}${card("Reliability", m.health + "%", "Average health")}</div><div class="card" style="margin-top:16px"><h3>Admin Preview</h3><p class="muted">This GitHub Pages version is a static preview. It demonstrates the UI and browser-side workflows. Full Next.js API routes run on localhost.</p><div class="actions"><a class="btn primary" href="#stores">Open Store Registry</a><a class="btn" href="#status">Open Status</a></div></div>`;
}
function renderStores() {
  const stores = getStores();
  view.innerHTML = `<div class="card"><div class="notice">Create, inspect, export, reset, and change store status in this browser preview. Data is saved in localStorage.</div><div class="form" style="margin-top:16px"><label><span class="sr-only">Store name</span><input id="storeName" class="input" placeholder="Store name" maxlength="80"></label><label><span class="sr-only">Industry</span><input id="storeIndustry" class="input" placeholder="Industry" maxlength="80"></label><label><span class="sr-only">Owner name</span><input id="storeOwner" class="input" placeholder="Owner name" maxlength="80"></label><button id="createStore" class="btn primary" type="button">Create Store</button></div><div class="actions"><button class="btn" id="exportStores" type="button">Export JSON</button><button class="btn" id="resetStores" type="button">Reset Data</button></div></div><div class="card" style="margin-top:16px"><h3>Store Registry</h3><div class="table-wrap"><table class="table"><thead><tr><th>Store</th><th>Owner</th><th>Status</th><th>Plan</th><th>Actions</th></tr></thead><tbody>${stores.map((store) => `<tr><td><strong>${escapeHtml(store.name)}</strong><br><span class="muted">/${escapeHtml(store.slug)}</span></td><td>${escapeHtml(store.owner)}<br><span class="muted">${escapeHtml(store.email)}</span></td><td><span class="badge ${store.status === "ACTIVE" ? "status-active" : "status-draft"}">${escapeHtml(store.status)}</span></td><td>${escapeHtml(store.plan)}</td><td><button class="btn" data-toggle="${escapeHtml(store.id)}" type="button">Toggle Status</button></td></tr>`).join("")}</tbody></table></div></div>`;
  document.querySelector("#createStore").onclick = () => {
    const name = document.querySelector("#storeName").value.trim();
    if (!name) return alert("Store name is required.");
    const industry = document.querySelector("#storeIndustry").value.trim() || "General Commerce";
    const owner = document.querySelector("#storeOwner").value.trim() || "New Owner";
    const next = [normalizeStore({ id: `store_${Date.now()}`, slug: slugify(name), name, industry, status: "DRAFT", plan: "FREE", owner, email: "owner@example.com", orders: 0, health: 82, revenue: "$0", audit: ["Created in GitHub Pages preview"] }), ...getStores()];
    saveStores(next); renderStores();
  };
  document.querySelector("#exportStores").onclick = downloadJson;
  document.querySelector("#resetStores").onclick = resetData;
  document.querySelectorAll("[data-toggle]").forEach((button) => button.onclick = () => {
    const next = getStores().map((store) => store.id === button.dataset.toggle ? { ...store, status: store.status === "ACTIVE" ? "PAUSED" : "ACTIVE", audit: [`Status changed in preview`, ...store.audit].slice(0, 8) } : store);
    saveStores(next); renderStores();
  });
}
function renderUsers() {
  view.innerHTML = `<div class="grid two">${card("Super Admin", "1", "Owner configured")}${card("RBAC", "Ready", "Roles preview")}</div><div class="card" style="margin-top:16px"><h3>User Management Preview</h3><table class="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody><tr><td>SAIFUL ALAM RAFI</td><td>admin@sarindustriesnetwork.com</td><td><span class="badge">SUPER_ADMIN</span></td></tr><tr><td>Store Manager</td><td>manager@example.com</td><td><span class="badge">MANAGER</span></td></tr></tbody></table></div>`;
}
function renderSecurity() {
  view.innerHTML = `<div class="card"><span class="badge">Security / RBAC</span><h2>Permission Matrix</h2><p class="muted">Static preview of admin roles and protected modules.</p><table class="table"><thead><tr><th>Permission</th><th>Super Admin</th><th>Manager</th><th>Support</th></tr></thead><tbody><tr><td>Manage Stores</td><td>Yes</td><td>Yes</td><td>No</td></tr><tr><td>Manage Users</td><td>Yes</td><td>No</td><td>No</td></tr><tr><td>View Dashboard</td><td>Yes</td><td>Yes</td><td>Yes</td></tr></tbody></table></div>`;
}
function renderBuilder() {
  view.innerHTML = `<div class="card"><span class="badge">Store Builder</span><h2>Prototype Builder</h2><p class="muted">Theme, storefront, products, and preview setup area.</p><div class="grid two"><div class="card"><h3>Theme</h3><p class="muted">Premium dark SaaS storefront</p></div><div class="card"><h3>Preview</h3><p class="muted">Demo storefront route ready</p></div></div></div>`;
}
function renderStatus() {
  const status = { ok: true, target: "github-pages", runtime: "static-browser", serverApi: false, sanitizedInputs: true, localStorage: true, timestamp: new Date().toISOString() };
  view.innerHTML = `<div class="card"><span class="badge">Status</span><h2>GitHub Pages Preview Status</h2><pre class="notice">${escapeHtml(JSON.stringify(status, null, 2))}</pre></div>`;
}
const routes = { home: renderHome, admin: renderAdmin, stores: renderStores, users: renderUsers, security: renderSecurity, builder: renderBuilder, status: renderStatus };
function render() {
  const route = (location.hash || "#home").replace("#", "");
  setActive(routes[route] ? route : "home");
  (routes[route] || renderHome)();
}
window.addEventListener("hashchange", render);
render();
