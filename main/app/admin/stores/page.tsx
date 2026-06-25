import { AdminShell } from "@/components/layout/AdminShell";

export default function Page() {
  return (
    <AdminShell>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-600">Super Admin</p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">Stores Management</h1>
      <p className="mt-2 max-w-3xl text-slate-600">Review seller stores, status, domains, templates, and activity.</p>
      <div className="mt-8 premium-card rounded-premium p-6">
        <p className="text-lg font-black text-slate-950">Step 1 scaffold ready</p>
        <p className="mt-2 text-sm text-slate-500">Implementation continues in Step 2 and later modules.</p>
      </div>
    </AdminShell>
  );
}
