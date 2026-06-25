import { AdminShell } from "@/components/layout/AdminShell";
import { BRAND } from "@/lib/branding";

export default function SettingsPage() {
  return (
    <AdminShell>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-600">Settings</p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">White-label Brand Settings</h1>
      <div className="mt-8 premium-card rounded-premium p-6">
        <dl className="grid gap-5 md:grid-cols-2">
          <div><dt className="text-sm font-bold text-slate-500">Brand Name</dt><dd className="mt-1 text-xl font-black">{BRAND.name}</dd></div>
          <div><dt className="text-sm font-bold text-slate-500">Owner</dt><dd className="mt-1 text-xl font-black">{BRAND.owner}</dd></div>
          <div><dt className="text-sm font-bold text-slate-500">Admin Email</dt><dd className="mt-1 text-xl font-black">{BRAND.adminEmail}</dd></div>
          <div><dt className="text-sm font-bold text-slate-500">Rights</dt><dd className="mt-1 text-xl font-black">All rights reserved</dd></div>
        </dl>
      </div>
    </AdminShell>
  );
}
