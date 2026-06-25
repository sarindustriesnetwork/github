import Link from "next/link";

export default function DemoStorePage() {
  return (
    <main className="hero">
      <div className="brand" style={{ justifyContent: "center" }}><div className="logo">SAR</div><span>Demo Store</span></div>
      <h1>Storefront demo.</h1>
      <p className="muted">This page is a public storefront preview for the SAR platform.</p>
      <div className="actions"><Link className="btn" href="/dashboard/store-builder">Back to Builder</Link></div>
    </main>
  );
}
