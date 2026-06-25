import { BRAND } from "@/lib/branding";

export default function StorefrontPage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="font-black">{params.slug}</div>
        <div className="text-xs font-bold text-slate-500">Powered by {BRAND.name}</div>
      </nav>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-600">Live Storefront Runtime</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight">Premium storefront is ready for this store.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">This route will load published theme configuration, pages, products, and domain mapping in the next development steps.</p>
      </section>
    </main>
  );
}
