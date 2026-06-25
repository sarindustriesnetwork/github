import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";

export default function UnauthorizedPage({ searchParams }: { searchParams?: { permission?: string } }) {
  return (
    <main className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <BrandMark />
        <section className="mt-16 premium-card rounded-premium p-8 text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-600">Access Blocked</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950">Permission required</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Your current role does not include access to this secure SAR INDUSTRIES NETWORK section.
          </p>
          {searchParams?.permission ? (
            <div className="mx-auto mt-6 inline-flex rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-black text-rose-700">
              Missing: {searchParams.permission}
            </div>
          ) : null}
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/admin" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">Back to Admin</Link>
            <Link href="/login" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700">Login Again</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
