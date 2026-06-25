import { AdminShell } from "@/components/layout/AdminShell";

export default function AICopilotPage() {
  return (
    <AdminShell>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-600">AI Copilot</p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">SAR AI Control Assistant</h1>
      <div className="mt-8 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="premium-card rounded-premium p-6">
          <h2 className="text-xl font-black text-slate-950">AI Status</h2>
          <p className="mt-2 text-sm text-slate-600">Provider is disabled by default for safe free-first setup. Add an API key later to activate.</p>
          <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm font-bold text-white">AI_PROVIDER=disabled</div>
        </div>
        <div className="premium-card rounded-premium p-6">
          <h2 className="text-xl font-black text-slate-950">Upcoming AI Tools</h2>
          <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-600">
            <p>• Dashboard summary</p>
            <p>• Plugin diagnosis</p>
            <p>• Diagnosis report generator</p>
            <p>• Support reply drafts</p>
            <p>• Safe action approval</p>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
