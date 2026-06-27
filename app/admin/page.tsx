import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { getStoreMetrics } from "@/lib/stores";

const storeMetrics = getStoreMetrics();

const stats = [
  ["Platform Health", "98%", "Render + CI/CD ready"],
  ["Active Stores", String(storeMetrics.activeStores), "Step 2.4 live"],
  ["Total Stores", String(storeMetrics.totalStores), "Managed registry"],
  ["Users", "342", "RBAC ready"],
  ["Plugin Status", "7", "Official modules"],
  ["Reliability", `${storeMetrics.averageHealth}%`, "Store health average"]
];

const nav = [
  ["Overview", "/admin"],
  ["Users", "/admin/users"],
  ["Stores", "/admin/stores"],
  ["Security / RBAC", "/admin/security"],
  ["Store Builder", "/dashboard/store-builder"],
  ["Deployment Status", "/api/deployment/status"]
];

export default function AdminPage() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">SAR</div><span>{BRAND.shortName} Admin</span></div>
        <nav className="nav">{nav.map(([label, href]) => <Link key={href} href={href} className={href === "/admin" ? "active" : ""}>{label}</Link>)}</nav>
        <p className="footer">{BRAND.copyright}</p>
      </aside>
      <main className="main">
        <div className="topbar"><div><span className="badge">Step 2.4</span><h1>Super Admin Command Center</h1><p className="muted">Official white-label SaaS admin dashboard with Store Management Core enabled.</p></div><Link className="btn primary" href="/admin/stores">Manage Stores</Link></div>
        <section className="grid">{stats.map(([title, value, note]) => <div className="card" key={title}><p className="muted">{title}</p><h2>{value}</h2><p className="muted">{note}</p></div>)}</section>
        <section className="card" style={{ marginTop: 22 }}><h2>Step 2.4 Store Management Core</h2><p className="muted">Create/update stores, assign owners, change store status, inspect store profiles, and review audit logs.</p><div className="actions" style={{ justifyContent: "flex-start" }}><Link className="btn primary" href="/admin/stores">Open Store Registry</Link><Link className="btn" href="/api/admin/stores">Open Stores API</Link></div></section>
      </main>
    </div>
  );
}
