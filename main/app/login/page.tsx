import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { BrandMark } from "@/components/brand/BrandMark";
import { BRAND } from "@/lib/branding";
import { getCurrentUser } from "@/lib/auth/session";

export default async function LoginPage({ searchParams }: { searchParams?: { next?: string } }) {
  const user = await getCurrentUser();
  const nextPath = searchParams?.next || "/admin";

  if (user) redirect(nextPath.startsWith("/") ? nextPath : "/admin");

  return (
    <main className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col">
        <div className="flex items-center justify-between">
          <BrandMark />
          <Link href="/" className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-slate-700 shadow-premium">Back to Home</Link>
        </div>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_460px]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-600">Auth + RBAC Step 2.3</p>
            <h2 className="mt-4 max-w-3xl text-5xl font-black leading-tight text-slate-950 lg:text-7xl">
              Official secure access for <span className="gradient-text">SAR INDUSTRIES NETWORK</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg font-medium text-slate-600">
              Role-based access control, signed session cookies, user CRUD, role assignment, protected admin APIs, fallback localhost admin login, and audit-ready authentication foundation.
            </p>
            <div className="mt-8 grid max-w-2xl gap-3 md:grid-cols-2">
              {[
                "Signed secure session cookie",
                "Super Admin permission matrix",
                "Protected admin pages",
                "Protected admin APIs",
                "Database + offline fallback mode",
                "Audit log prepared"
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm font-black text-slate-700 shadow-sm">
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>
          <LoginForm nextPath={nextPath} />
        </section>

        <div className="pb-4 text-center text-xs font-bold leading-relaxed text-slate-500">
          <p>{BRAND.copyright}</p>
          <p className="text-slate-400">{BRAND.developerCredit}</p>
        </div>
      </div>
    </main>
  );
}
