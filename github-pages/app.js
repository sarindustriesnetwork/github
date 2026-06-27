const defaultStores = [
  { id: "store_sar_main", slug: "sar-main-store", name: "SAR Main Store", industry: "General Commerce", status: "ACTIVE", plan: "PRO", owner: "SAIFUL ALAM RAFI", email: "admin@sarindustriesnetwork.com", orders: 428, health: 98, revenue: "$12.4K", audit: ["Static preview loaded", "Owner assigned", "Local browser runtime ready"] },
  { id: "store_demo_fashion", slug: "demo-fashion-store", name: "Demo Fashion Store", industry: "Fashion Retail", status: "DRAFT", plan: "STARTER", owner: "Store Manager", email: "manager@example.com", orders: 64, health: 87, revenue: "$1.8K", audit: ["Draft created", "Theme selected", "Owner invited"] },
  { id: "store_b2b_network", slug: "b2b-network-store", name: "B2B Network Store", industry: "Wholesale", status: "PAUSED", plan: "ENTERPRISE", owner: "Operations Lead", email: "ops@example.com", orders: 973, health: 91, revenue: "$28.9K", audit: ["Paused for review", "B2B catalog imported", "Enterprise plan enabled"] }
];

const storeKey = "sar_pages_stores_v1";
const view = document.querySelector("#view");
const navLinks = [...document.querySelectorAll(".nav a")];

function getStores() {
  try { return JSON.parse(localStorage.getItem(storeKey)) || defaultStores; }
  catch { return defaultStores; }
}
function saveStores(stores) { localStorage.setItem(storeKey, JSON.stringify(stores)); }
function slugify(value) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "new-store"; }
function metrics() {
  const stores = getStores();
  const active = stores.filter(store => store.status === "ACTIVE").length;
  const orders = stores.reduce((sum, store) => sum + Number(store.orders || 0), 0);
  const health = Math.round(stores.reduce((sum, store) => sum + Number(store.health || 0), 0) / Math.max(stores.length, 1));
  return { total: stores.length, active, orders, health };
}
function card(title, value, note) {
  return `<div class="card"><p class="muted">${title}</p><h2>${value}</h2><p class="muted">${note}</p></div>`;
}
function setActive(route) {
  navLinks.forEach(link => link.classList.toggle("active", link.dataset.route === route));
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
  view.innerHTML = `<div class="card"><div class="notice">Create, inspect, and change store status in this browser preview. Data is saved in localStorage.</div><div class="form" style="margin-top:16px"><input id="storeName" class="input" placeholder="Store name"><input id="storeIndustry" class="input" placeholder="Industry"><input id="storeOwner" class="input" placeholder="Owner name"><button id="createStore" class="btn primary">Create Store</button></div></div><div class="card" style="margin-top:16px"><h3>Store Registry</h3><table class="table"><thead><tr><th>Store</th><th>Owner</th><th>Status</th><th>Plan</th><th>Actions</th></tr></thead><tbody>${stores.map(store => `<tr><td><strong>${store.name}</strong><br><span class="muted">/${store.slug}</span></td><td>${store.owner}<br><span class="muted">${store.email}</span></td><td><span class="badge ${store.status === "ACTIVE" ? "status-active" : "status-draft"}">${store.status}</span></td><td>${store.plan}</td><td><button class="btn" data-toggle="${store.id}">Toggle Status</button></td></tr>`).join("")}</tbody></table></div>`;
  document.querySelector("#createStore").onclick = () => {
    const name = document.querySelector("#storeName").value.trim();
    if (!name) return alert("Store name is required.");
    const industry = document.querySelector("#storeIndustry").value.trim() || "General Commerce";
    const owner = document.querySelector("#storeOwner").value.trim() || "New Owner";
    const next = [{ id: `store_${Date.now()}`, slug: slugify(name), name, industry, status: "DRAFT", plan: "FREE", owner, email: "owner@example.com", orders: 0, health: 82, revenue: "$0", audit: ["Created in GitHub Pages preview"] }, ...getStores()];
    saveStores(next); renderStores();
  };
  document.querySelectorAll("[data-toggle]").forEach(button => button.onclick = () => {
    const next = getStores().map(store => store.id === button.dataset.toggle ? { ...store, status: store.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } : store);
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
  const status = { ok: true, target: "github-pages", runtime: "static-browser", cloudApi: false, serverApi: false, timestamp: new Date().toISOString() };
  view.innerHTML = `<div class="card"><span class="badge">Status</span><h2>GitHub Pages Preview Status</h2><pre class="notice">${JSON.stringify(status, null, 2)}</pre></div>`;
}
const routes = { home: renderHome, admin: renderAdmin, stores: renderStores, users: renderUsers, security: renderSecurity, builder: renderBuilder, status: renderStatus };
function render() {
  const route = (location.hash || "#home").replace("#", "");
  setActive(routes[route] ? route : "home");
  (routes[route] || renderHome)();
}
window.addEventListener("hashchange", render);
render();
