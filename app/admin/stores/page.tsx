import Link from "next/link";
import { BRAND } from "@/lib/branding";
import { stores } from "@/lib/stores";
import StoreManagementClient from "@/components/stores/StoreManagementClient";

const nav = [
  ["Overview", "/admin"],
  ["Users", "/admin/users"],
  ["Stores", "/admin/stores"],
  ["Security / RBAC", "/admin/security"],
  ["Store Builder", "/dashboard/store-builder"],
  ["Health API", "/api/health"]
];

export default function StoresPage() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><div className="logo">SAR</div><span>{BRAND.shortName} Stores</span></div>
        <nav className="nav">{nav.map(([label, href]) => <Link key={href} href={href} className={href === "/admin/stores" ? "active" : ""}>{label}</Link>)}</nav>
        <p className="footer">Step 2.4 Store Management Core</p>
      </aside>
      <main className="main">
        <div className="topbar">
          <div>
            <span className="badge">Step 2.4</span>
            <h1>Store Management Core</h1>
            <p className="muted">Create stores, assign owners, manage status, inspect store profiles, and review audit trails.</p>
          </div>
          <Link className="btn" href="/api/admin/stores">Stores API</Link>
        </div>
        <StoreManagementClient initialStores={stores} />
        <p className="footer">{BRAND.copyright}</p>
      </main>
    </div>
  );
}
