import Link from "next/link";
import { BRAND } from "@/lib/branding";

const modules = ["Super Admin Dashboard", "Auth + RBAC", "User Management", "Store Builder", "Plugin Manager", "AI Copilot", "Reliability Center", "White-Label Branding"];

export default function HomePage() {
  return (
    <main className="hero">
      <div className="brand" style={{ justifyContent: "center" }}>
        <div className="logo">SAR</div>
        <span>{BRAND.legalName}</span>
      </div>
      <h1>AI-powered SaaS control center.</h1>
      <p className="muted" style={{ fontSize: 18 }}>{BRAND.description}</p>
      <div className="actions">
        <Link className="btn primary" href="/admin">Open Admin</Link>
        <Link className="btn" href="/login">Secure Login</Link>
        <Link className="btn" href="/api/health">Health API</Link>
      </div>
      <div className="grid" style={{ marginTop: 48, textAlign: "left" }}>
        {modules.map((item) => <div className="card" key={item}><span className="badge">Ready</span><h3>{item}</h3><p className="muted">Production-shaped starter module for the SAR platform roadmap.</p></div>)}
      </div>
      <p className="footer">{BRAND.copyright}<br />{BRAND.developerCredit}</p>
    </main>
  );
}
