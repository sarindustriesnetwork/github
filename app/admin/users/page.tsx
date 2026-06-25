import Link from "next/link";
import { BRAND } from "@/lib/branding";

const users = [
  { name: "SAIFUL ALAM RAFI", email: "admin@sarindustriesnetwork.com", role: "SUPER_ADMIN", status: "ACTIVE" },
  { name: "Finance Manager", email: "finance@example.com", role: "FINANCE_MANAGER", status: "INVITED" },
  { name: "Support Agent", email: "support@example.com", role: "SUPPORT_AGENT", status: "ACTIVE" }
];

export default function UsersPage() {
  return (
    <div className="shell">
      <aside className="sidebar"><div className="brand"><div className="logo">SAR</div><span>Users</span></div><nav className="nav"><Link href="/admin">Overview</Link><Link className="active" href="/admin/users">Users</Link><Link href="/admin/security">RBAC</Link></nav></aside>
      <main className="main">
        <div className="topbar"><div><span className="badge">User CRUD</span><h1>User Management</h1><p className="muted">Create, update, assign roles, and control account status.</p></div><button className="btn primary">Create User</button></div>
        <div className="card">
          <table className="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead><tbody>{users.map((user) => <tr key={user.email}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td><span className="badge">{user.status}</span></td></tr>)}</tbody></table>
        </div>
        <p className="footer">{BRAND.copyright}</p>
      </main>
    </div>
  );
}
