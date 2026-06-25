import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { StatCard } from "@/components/ui/StatCard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <BrandMark />
          <Link href="/login?next=/admin" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white">Super Admin</Link>
        </div>
        <section className="mt-10">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-600">Seller Workspace</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Store Development Dashboard</h1>
          <p className="mt-2 text-slate-600">Starter page for store builder, products, orders, themes, and domains.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatCard title="Store Builder" value="Ready" helper="Template and theme studio scaffold" />
            <StatCard title="Live Preview" value="Ready" helper="Preview route scaffold" />
            <StatCard title="Domains" value="Ready" helper="Free/custom domain model ready" />
          </div>
        </section>
      </div>
    </main>
  );
}
