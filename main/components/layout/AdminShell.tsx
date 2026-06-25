import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { BrandMark } from "@/components/brand/BrandMark";
import { BRAND } from "@/lib/branding";
import { requirePermission } from "@/lib/auth/session";

const navItems = [
  ["Command Center", "/admin"],
  ["Users", "/admin/users"],
  ["Stores", "/admin/stores"],
  ["Orders", "/admin/orders"],
  ["Payments", "/admin/payments"],
  ["Subscriptions", "/admin/subscriptions"],
  ["Store Builder", "/dashboard/store-builder"],
  ["Plugin Manager", "/admin/plugins"],
  ["AI Copilot", "/admin/ai"],
  ["Reliability", "/admin/reliability"],
  ["Security & RBAC", "/admin/security"],
  ["Settings", "/admin/settings"]
] as const;

export async function AdminShell({ children }: { children: ReactNode }) {
  const user = await requirePermission("admin.access");

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[290px_1fr]">
      <aside className="border-b border-slate-200 bg-white/70 p-5 backdrop-blur-xl lg:min-h-screen lg:border-b-0 lg:border-r">
        <BrandMark />
        <nav className="mt-8 grid gap-2">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-950 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 rounded-3xl border border-brand-100 bg-brand-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-700">Authenticated</p>
          <p className="mt-2 text-sm font-black text-slate-950">{user.name}</p>
          <p className="mt-1 text-xs text-slate-500">{user.email}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <span key={role} className="rounded-full bg-white px-3 py-1 text-[11px] font-black text-brand-700 shadow-sm">{role}</span>
            ))}
          </div>
          <p className="mt-3 text-[11px] font-bold text-slate-500">Session source: {user.source}</p>
          <LogoutButton />
        </div>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white/60 p-3 text-[11px] font-bold leading-relaxed text-slate-500">
          <p>{BRAND.copyright}</p>
          <p className="mt-1 text-slate-400">{BRAND.developerCredit}</p>
        </div>
      </aside>
      <main className="p-6 lg:p-8">{children}</main>
    </div>
  );
}
