export default function PreviewPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-white/10 bg-white/5 p-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-100">Draft Preview</p>
        <h1 className="mt-3 text-4xl font-black">Preview: {params.slug}</h1>
        <p className="mt-4 max-w-2xl text-slate-300">This preview route will render draft theme configuration before publishing.</p>
      </div>
    </main>
  );
}
