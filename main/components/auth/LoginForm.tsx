"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BRAND } from "@/lib/branding";

export function LoginForm({ nextPath = "/admin" }: { nextPath?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(BRAND.adminEmail);
  const [password, setPassword] = useState("Admin@2026");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, next: nextPath })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data?.error?.message || "Login failed. Please check your credentials.");
        return;
      }

      router.push(data.redirectTo || "/admin");
      router.refresh();
    } catch {
      setError("Could not reach the authentication server. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="premium-card w-full max-w-md rounded-premium p-6 shadow-premium">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-600">Official Super Admin</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Secure Login</h1>
        <p className="mt-2 text-sm text-slate-600">Access the SAR INDUSTRIES NETWORK command center with RBAC protection.</p>
      </div>

      <label className="block text-sm font-black text-slate-700" htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none"
        autoComplete="email"
        required
      />

      <label className="mt-5 block text-sm font-black text-slate-700" htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="focus-ring mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none"
        autoComplete="current-password"
        required
      />

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</div>
      ) : null}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full rounded-full brand-gradient px-5 py-3 text-sm font-black text-white shadow-glow transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Signing in..." : "Enter Super Admin Dashboard"}
      </button>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white/70 p-4 text-xs text-slate-500">
        <p className="font-black text-slate-700">Default setup credentials</p>
        <p className="mt-1">Email: {BRAND.adminEmail}</p>
        <p>Password: Admin@2026</p>
        <p className="mt-2 font-bold text-amber-700">Change this password before real production launch.</p>
      </div>
    </form>
  );
}
