import Link from "next/link";
import { BRAND } from "@/lib/branding";

const roles = [
  ["SUPER_ADMIN", "Full platform control"],
  ["ADMIN", "Manage users, stores, reports"],
  ["FINANCE_MANAGER", "Payments, invoices, subscriptions"],
  ["SUPPORT_AGENT", "Support tickets and user help"],
  ["STORE_OWNER", "Own store dashboard access"]
];

const permissions = ["users.view", "users.create", "users.update", "stores.view", "stores.update", "payments.view", "plugins.manage", "audit_logs.view"];

export default function SecurityPage() {
  return (
    <div className="shell">
      <aside className="sidebar"><div className="brand"><div className="logo">SAR</div><span>Security</span></div><nav className="nav"><Link href="/admin">Overview</Link><Link href="/admin/users">Users</Link><Link className="active" href="/admin/security">RBAC</Link></nav></aside>
      <main className="main">
        <div className="topbar"><div><span className="badge">RBAC</span><h1>Role-Based Access Control</h1><p className="muted">Permission-aware admin operations for the SAR platform.</p></div></div>
        <div className="grid">
          {roles.map(([role, note]) => <div className="card" key={role}><h3>{role}</h3><p className="muted">{note}</p></div>)}
        </div>
        <div className="card" style={{ marginTop: 22 }}><h2>Permission Matrix</h2><div className="grid">{permissions.map((p) => <span className="badge" key={p}>{p}</span>)}</div></div>
        <p className="footer">{BRAND.copyright}</p>
      </main>
    </div>
  );
}
