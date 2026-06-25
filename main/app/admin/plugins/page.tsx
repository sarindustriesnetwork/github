import { AdminShell } from "@/components/layout/AdminShell";

const plugins = ["Store Builder", "Stripe Billing", "Email Notification", "AI Copilot", "Report Export", "Support Ticket", "Reliability Center"];

export default function PluginsPage() {
  return (
    <AdminShell>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-600">Plugin Manager</p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">Official Plugin Registry</h1>
      <p className="mt-2 text-slate-600">Official SAR INDUSTRIES NETWORK plugins are scaffolded as internal modules for safe MVP development.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plugins.map((plugin) => (
          <div key={plugin} className="premium-card rounded-3xl p-5">
            <div className="mb-4 inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700">Official</div>
            <h2 className="text-xl font-black text-slate-950">{plugin}</h2>
            <p className="mt-2 text-sm text-slate-500">Install, activate, configure, log, and monitor in upcoming steps.</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
