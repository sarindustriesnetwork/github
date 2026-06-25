import Link from "next/link";
import { BRAND } from "@/lib/branding";

const templates = ["Nova Fashion", "Premium Tech", "Luxury Dark", "Minimal Commerce"];

export default function StoreBuilderPage() {
  return (
    <div className="shell">
      <aside className="sidebar"><div className="brand"><div className="logo">SAR</div><span>Store Builder</span></div><nav className="nav"><Link href="/admin">Admin</Link><Link className="active" href="/dashboard/store-builder">Templates</Link><Link href="/store/demo-store">Live Store</Link><Link href="/preview/demo-store">Preview</Link></nav></aside>
      <main className="main">
        <div className="topbar"><div><span className="badge">Theme Studio</span><h1>Store Builder</h1><p className="muted">Template marketplace, theme studio, live preview, publishing and domain setup foundation.</p></div><Link className="btn primary" href="/preview/demo-store">Preview Demo</Link></div>
        <div className="grid">{templates.map((name) => <div className="card" key={name}><span className="badge">Free</span><h2>{name}</h2><p className="muted">Responsive storefront template prepared for light and dark theme expansion.</p><Link className="btn" href="/preview/demo-store">Live Preview</Link></div>)}</div>
        <p className="footer">{BRAND.copyright}</p>
      </main>
    </div>
  );
}
