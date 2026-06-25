"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@sarindustriesnetwork.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok || !data.success) {
      setMessage(data?.error || "Login failed. Configure DEFAULT_ADMIN_PASSWORD in .env for local testing.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="hero">
      <div className="brand" style={{ justifyContent: "center" }}><div className="logo">SAR</div><span>SAR INDUSTRIES NETWORK™</span></div>
      <form onSubmit={onSubmit} className="card" style={{ maxWidth: 460, margin: "34px auto", textAlign: "left" }}>
        <span className="badge">Secure Login</span>
        <h1 style={{ fontSize: 36 }}>Super Admin Access</h1>
        <p className="muted">Use environment-configured credentials. No production password is stored in this public repository.</p>
        <label>Email</label><input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div style={{ height: 12 }} />
        <label>Password</label><input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set DEFAULT_ADMIN_PASSWORD in .env" />
        {message && <p className="muted">{message}</p>}
        <button className="btn primary" style={{ width: "100%", marginTop: 18 }} disabled={loading}>{loading ? "Checking..." : "Login"}</button>
      </form>
    </main>
  );
}
