import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StatCard } from "@/components/ui/StatCard";
import { BRAND } from "@/lib/branding";
import { requirePermission } from "@/lib/auth/session";

export default async function AdminPage() {
  const user = await requirePermission("admin.access");

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-600">Super Admin Command Center</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Welcome, {user.name}</h1>
          <p className="mt-2 text-slate-600">Official SAR INDUSTRIES NETWORK white-label operations dashboard with Step 2.3 User CRUD + RBAC management enabled.</p>
        </div>
        <div className="rounded-full brand-gradient px-5 py-3 text-sm font-black text-white shadow-glow">Authenticated</div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Auth Status" value="Active" helper={`Session source: ${user.source}`} />
        <StatCard title="Role" value={user.roles[0] || "N/A"} helper="Role-based access enabled" />
        <StatCard title="Permissions" value={String(user.permissions.length)} helper="Permission matrix loaded" />
        <StatCard title="RBAC Guard" value="Ready" helper="Pages and APIs protected" />
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="premium-card rounded-premium p-6">
          <h2 className="text-2xl font-black text-slate-950">Step 2.3 User CRUD + RBAC Management Completed</h2>
          <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-600">
            <p>✓ Login page and secure session cookie added</p>
            <p>✓ Database authentication with bcrypt password verification</p>
            <p>✓ Offline localhost fallback login when PostgreSQL is not running</p>
            <p>✓ Super Admin, Admin, Finance, Support, Store Owner, Viewer roles defined</p>
            <p>✓ Permission guards added for admin pages and admin APIs</p>
            <p>✓ Logout endpoint and session inspection API added</p>
            <p>✓ Audit log hooks prepared for login/logout events</p>
            <p>✓ Create users, update status, assign roles, and soft-ban users from the Super Admin panel</p>
            <p>✓ Updated official white-label rights footer applied across the platform</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/admin/security" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">View RBAC Matrix</Link>
            <Link href="/admin/users" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700">View Users</Link>
          </div>
        </div>
        <div className="rounded-premium bg-slate-950 p-6 text-white shadow-premium">
          <p className="text-sm font-bold text-brand-100">Official Admin Session</p>
          <p className="mt-4 text-sm text-slate-400">Name</p>
          <p className="font-black">{user.name}</p>
          <p className="mt-4 text-sm text-slate-400">Email</p>
          <p className="font-black">{user.email}</p>
          <p className="mt-4 text-sm text-slate-400">Roles</p>
          <p className="font-black">{user.roles.join(", ")}</p>
          <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
{BRAND.copyright}
            <br />
            {BRAND.developerCredit}
          </p>
        </div>
      </section>
    </AdminShell>
  );
}
