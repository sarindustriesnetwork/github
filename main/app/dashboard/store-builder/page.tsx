import { AdminShell } from "@/components/layout/AdminShell";

export default function StoreBuilderPage() {
  const items = ["Templates", "Theme Studio", "Pages", "Navigation", "SEO", "Live Preview", "Publish Center", "Domain Manager"];
  return (
    <AdminShell>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-600">Store Builder</p>
      <h1 className="mt-2 text-4xl font-black text-slate-950">Theme Studio Foundation</h1>
      <p className="mt-2 max-w-3xl text-slate-600">Step 1 includes the structure for template selection, theme customization, live preview, publishing, and domain configuration.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div key={item} className="premium-card rounded-3xl p-5">
            <p className="text-lg font-black text-slate-950">{item}</p>
            <p className="mt-2 text-sm text-slate-500">Module scaffold ready for Step 2 implementation.</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
