import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { BRAND } from "@/lib/branding";
import { StatCard } from "@/components/ui/StatCard";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <BrandMark />
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="rounded-full border border-slate-200 bg-white/70 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            Seller Dashboard
          </Link>
          <Link href="/login?next=/admin" className="rounded-full brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5">
            Super Admin
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 py-20 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-brand-100 bg-white/70 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm">
            Official white-label SaaS control center
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-950 md:text-7xl">
            Build, manage, and scale with <span className="gradient-text">SAR precision.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            A production-shaped starter for Super Admin operations, Store Builder, Plugin Manager, AI Copilot, and Reliability Center under the official SAR INDUSTRIES NETWORK brand.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login?next=/admin" className="rounded-full brand-gradient px-6 py-3 font-bold text-white shadow-glow transition hover:-translate-y-0.5">
              Open Control Center
            </Link>
            <Link href="/api/health" className="rounded-full border border-slate-200 bg-white/80 px-6 py-3 font-bold text-slate-900 shadow-sm transition hover:-translate-y-0.5">
              Check API Health
            </Link>
          </div>
        </div>

        <div className="premium-card rounded-premium p-5">
          <div className="rounded-[22px] bg-slate-950 p-5 text-white">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Command Center</p>
                <h2 className="text-2xl font-black">Platform Health</h2>
              </div>
              <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-bold text-emerald-300">Stable</div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard title="Health Score" value="92/100" tone="dark" />
              <StatCard title="Active Stores" value="128" tone="dark" />
              <StatCard title="Plugin Status" value="Healthy" tone="dark" />
              <StatCard title="AI Copilot" value="Ready" tone="dark" />
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-slate-300">Brand Owner</p>
              <p className="mt-1 text-lg font-black">{BRAND.owner}</p>
              <p className="mt-1 text-sm text-slate-400">{BRAND.adminEmail}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl border-t border-slate-200 py-6 text-sm text-slate-500">
        {BRAND.copyright}
      </footer>
    </main>
  );
}
