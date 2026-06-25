import { AdminShell } from "@/components/layout/AdminShell";
import { ErrorFallbackCard } from "@/components/ui/ErrorFallbackCard";

export default function ReliabilityPage() {
  return (
    <AdminShell>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-600">Reliability Center</p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">System Reliability Foundation</h1>
      <p className="mt-2 text-slate-600">Error boundaries, troubleshoot center, diagnosis reports, queue monitor, and webhook logs will live here.</p>
      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <div className="premium-card rounded-premium p-6">
          <h2 className="text-xl font-black text-slate-950">System Health</h2>
          <div className="mt-5 grid gap-3">
            {['API Server', 'Database', 'Redis Queue', 'Plugin Runtime', 'AI Copilot'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 p-4">
                <span className="font-bold text-slate-700">{item}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Ready</span>
              </div>
            ))}
          </div>
        </div>
        <ErrorFallbackCard title="Demo Error Boundary" message="This is the official fallback design for failed widgets." traceId="ERR-SAR-DEMO" />
      </div>
    </AdminShell>
  );
}
