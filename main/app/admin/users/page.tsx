import { AdminShell } from "@/components/layout/AdminShell";
import { UserManagementClient } from "@/components/auth/UserManagementClient";
import { getAdminUsersForPage, getRoleOptionsForPage } from "@/lib/auth/admin-data";
import { requirePermission } from "@/lib/auth/session";
import { BRAND } from "@/lib/branding";

export default async function UsersPage() {
  await requirePermission("users.view");
  const data = await getAdminUsersForPage();
  const roleOptions = getRoleOptionsForPage();

  return (
    <AdminShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-600">Step 2.3 · User CRUD + RBAC</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">Users & Role Assignment</h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            Create users, update account status, assign roles, reset passwords, and safely ban users under the official {BRAND.name} white-label control center.
          </p>
        </div>
        <div className="rounded-full brand-gradient px-5 py-3 text-sm font-black text-white shadow-glow">{data.users.length} Users</div>
      </div>

      <UserManagementClient initialUsers={data.users} initialSource={data.source} roleOptions={roleOptions} />

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white/70 p-5 text-sm font-bold leading-relaxed text-slate-600 shadow-sm">
        <p>{BRAND.copyright}</p>
        <p className="mt-1 text-slate-500">{BRAND.developerCredit}</p>
      </div>
    </AdminShell>
  );
}
