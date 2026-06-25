import { AdminShell } from "@/components/layout/AdminShell";
import { PermissionBadge } from "@/components/auth/PermissionBadge";
import { getRBACSummaryForPage } from "@/lib/auth/admin-data";
import { requirePermission } from "@/lib/auth/session";

export default async function SecurityPage() {
  await requirePermission("roles.view");
  const rbac = await getRBACSummaryForPage();

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-600">Security & RBAC</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Role-Based Access Control</h1>
          <p className="mt-2 max-w-3xl text-slate-600">Official permission matrix for SAR INDUSTRIES NETWORK platform operations.</p>
        </div>
        <div className="rounded-full brand-gradient px-5 py-3 text-sm font-black text-white shadow-glow">{rbac.permissions.length} Permissions</div>
      </div>

      <section className="mt-8 grid gap-5">
        {rbac.roles.map((role) => (
          <article key={role.name} className="premium-card rounded-premium p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <h2 className="text-2xl font-black text-slate-950">{role.name}</h2>
                <p className="mt-2 max-w-3xl text-sm font-semibold text-slate-600">{role.description}</p>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm">Users: {role.userCount}</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {role.permissions.map((permission) => <PermissionBadge key={permission} permission={permission} />)}
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
