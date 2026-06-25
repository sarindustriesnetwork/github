import Link from "next/link";
import { BRAND } from "@/lib/branding";

const stats = [
  ["Platform Health", "96%", "Stable"],
  ["Active Stores", "128", "MVP sample"],
  ["Users", "342", "RBAC ready"],
  ["Plugin Status", "7", "Official modules"],
  ["AI Copilot", "Ready", "Safe-action mode"],
  ["Reliability", "Online", "Error boundary ready"]
];

const nav = [
  ["Overview", "/admin"],
  ["Users", "/admin/users"],
  ["Security / RBAC", "/admin/security"],
  ["Store Builder", "/dashboard/store-builder"],
  ["Health API", "/api/health"]
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
        <div className="topbar"><div><span className="badge">Step 2.3</span><h1>Super Admin Command Center</h1><p className="muted">Official white-label SaaS admin dashboard for {BRAND.name}.</p></div><Link className="btn" href="/login">Login</Link></div>
        <section className="grid">{stats.map(([title, value, note]) => <div className="card" key={title}><p className="muted">{title}</p><h2>{value}</h2><p className="muted">{note}</p></div>)}</section>
        <section className="card" style={{ marginTop: 22 }}><h2>Next Build Queue</h2><p className="muted">Step 2.4 will add Store Management Core: create/update stores, owner assignment, store status, audit logs, and permission guards.</p></section>
      </main>
    </div>
  );
}
