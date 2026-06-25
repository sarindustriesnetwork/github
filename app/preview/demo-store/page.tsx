import Link from "next/link";

export default function PreviewPage() {
  return (
    <main className="hero">
      <span className="badge">Draft Preview</span>
      <h1>Live preview site.</h1>
      <p className="muted">Theme draft preview area for desktop, tablet and mobile testing.</p>
      <div className="grid" style={{ marginTop: 32, textAlign: "left" }}>
        <div className="card"><h2>Hero Section</h2><p className="muted">Editable landing banner.</p></div>
        <div className="card"><h2>Featured Products</h2><p className="muted">Product collection block.</p></div>
        <div className="card"><h2>Footer</h2><p className="muted">White-label rights notice.</p></div>
      </div>
      <div className="actions"><Link className="btn primary" href="/store/demo-store">Open Live Store</Link><Link className="btn" href="/dashboard/store-builder">Back</Link></div>
    </main>
  );
}
