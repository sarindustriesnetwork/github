"use client";

import { useMemo, useState } from "react";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  status: string;
  roles: string[];
  createdAt: string;
  updatedAt?: string | null;
  lastLoginAt?: string | null;
  emailVerifiedAt?: string | null;
};

type RoleOption = {
  name: string;
  label: string;
  description: string;
  permissions: string[];
};

type Props = {
  initialUsers: UserRecord[];
  initialSource: string;
  roleOptions: RoleOption[];
};

const statuses = ["ACTIVE", "PENDING", "SUSPENDED", "BANNED"];

function getErrorMessage(payload: unknown) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const error = (payload as { error?: { message?: string } }).error;
    if (error?.message) return error.message;
  }
  return "Something went wrong. Please check the server logs.";
}

function createEmptyForm(roleOptions: RoleOption[]) {
  return {
    name: "",
    email: "",
    password: "",
    status: "ACTIVE",
    roles: roleOptions.some((role) => role.name === "VIEWER") ? ["VIEWER"] : roleOptions.slice(0, 1).map((role) => role.name)
  };
}

export function UserManagementClient({ initialUsers, initialSource, roleOptions }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [source, setSource] = useState(initialSource);
  const [selectedId, setSelectedId] = useState(initialUsers[0]?.id || "");
  const [createForm, setCreateForm] = useState(() => createEmptyForm(roleOptions));
  const [editPassword, setEditPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const selectedUser = useMemo(() => users.find((user) => user.id === selectedId) || users[0], [selectedId, users]);

  const [editForm, setEditForm] = useState(() => ({
    name: initialUsers[0]?.name || "",
    email: initialUsers[0]?.email || "",
    status: initialUsers[0]?.status || "ACTIVE",
    roles: initialUsers[0]?.roles || []
  }));

  function selectUser(user: UserRecord) {
    setSelectedId(user.id);
    setEditPassword("");
    setErrorMessage("");
    setStatusMessage("");
    setEditForm({ name: user.name, email: user.email, status: user.status, roles: user.roles });
  }

  function toggleCreateRole(roleName: string) {
    setCreateForm((current) => {
      const exists = current.roles.includes(roleName);
      const roles = exists ? current.roles.filter((role) => role !== roleName) : [...current.roles, roleName];
      return { ...current, roles: roles.length ? roles : [roleName] };
    });
  }

  function toggleEditRole(roleName: string) {
    setEditForm((current) => {
      const exists = current.roles.includes(roleName);
      const roles = exists ? current.roles.filter((role) => role !== roleName) : [...current.roles, roleName];
      return { ...current, roles: roles.length ? roles : [roleName] };
    });
  }

  async function refreshUsers() {
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok || !payload.success) throw new Error(getErrorMessage(payload));
    setUsers(payload.users);
    setSource(payload.source);
    return payload.users as UserRecord[];
  }

  async function createUser() {
    setIsBusy(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm)
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(getErrorMessage(payload));
      const nextUsers = await refreshUsers();
      setCreateForm(createEmptyForm(roleOptions));
      setSelectedId(payload.user.id);
      const freshUser = nextUsers.find((user) => user.id === payload.user.id) || payload.user;
      selectUser(freshUser);
      setStatusMessage("User created successfully with official RBAC assignment.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Create user failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function saveSelectedUser() {
    if (!selectedUser) return;
    setIsBusy(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, password: editPassword })
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(getErrorMessage(payload));
      const nextUsers = await refreshUsers();
      const freshUser = nextUsers.find((user) => user.id === selectedUser.id) || payload.user;
      selectUser(freshUser);
      setStatusMessage("User profile, status, and roles updated successfully.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Update user failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function banSelectedUser() {
    if (!selectedUser) return;
    const confirmed = window.confirm(`Safely ban ${selectedUser.email}? This is a soft delete and will be audited.`);
    if (!confirmed) return;

    setIsBusy(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(getErrorMessage(payload));
      const nextUsers = await refreshUsers();
      const freshUser = nextUsers.find((user) => user.id === selectedUser.id) || payload.user;
      selectUser(freshUser);
      setStatusMessage("User safely banned. Audit log has been recorded.");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Ban user failed.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-6">
        <div className="premium-card rounded-premium p-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Create Admin/User</h2>
              <p className="mt-2 text-sm font-semibold text-slate-600">Create official users with role-based access from the Super Admin panel.</p>
            </div>
            <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">Source: {source}</span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Name
              <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus-ring" value={createForm.name} onChange={(event) => setCreateForm({ ...createForm, name: event.target.value })} placeholder="Full name" />
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Email
              <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus-ring" value={createForm.email} onChange={(event) => setCreateForm({ ...createForm, email: event.target.value })} placeholder="user@example.com" />
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Temporary Password
              <input type="password" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus-ring" value={createForm.password} onChange={(event) => setCreateForm({ ...createForm, password: event.target.value })} placeholder="Minimum 8 characters" />
            </label>
            <label className="grid gap-2 text-sm font-black text-slate-700">
              Status
              <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus-ring" value={createForm.status} onChange={(event) => setCreateForm({ ...createForm, status: event.target.value })}>
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-5">
            <p className="text-sm font-black text-slate-700">Assign Roles</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {roleOptions.map((role) => (
                <label key={role.name} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm transition hover:border-brand-200 hover:bg-brand-50">
                  <input type="checkbox" checked={createForm.roles.includes(role.name)} onChange={() => toggleCreateRole(role.name)} className="mt-1" />
                  <span>
                    <span className="block font-black text-slate-900">{role.label}</span>
                    <span className="block text-xs font-semibold text-slate-500">{role.name}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button disabled={isBusy} onClick={createUser} className="mt-5 rounded-full brand-gradient px-6 py-3 text-sm font-black text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-50">
            {isBusy ? "Processing..." : "Create User"}
          </button>
        </div>

        <div className="overflow-hidden rounded-premium border border-slate-200 bg-white/80 shadow-premium">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-black text-slate-950">Official User Directory</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">Select a user to update status, password, or role assignment.</p>
            </div>
            <button onClick={() => refreshUsers().catch((error) => setErrorMessage(error.message))} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-sm">Refresh</button>
          </div>
          <div className="max-h-[560px] overflow-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Roles</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={`border-t border-slate-100 ${selectedUser?.id === user.id ? "bg-brand-50/70" : ""}`}>
                    <td className="px-5 py-4 font-black text-slate-950">{user.name}</td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{user.email}</td>
                    <td className="px-5 py-4"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">{user.status}</span></td>
                    <td className="px-5 py-4"><div className="flex flex-wrap gap-2">{user.roles.map((role) => <span key={role} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-600">{role}</span>)}</div></td>
                    <td className="px-5 py-4"><button onClick={() => selectUser(user)} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        {statusMessage ? <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{statusMessage}</div> : null}
        {errorMessage ? <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{errorMessage}</div> : null}

        <div className="premium-card rounded-premium p-6">
          <h2 className="text-2xl font-black text-slate-950">Manage Selected User</h2>
          {!selectedUser ? (
            <p className="mt-4 text-sm font-semibold text-slate-500">No user selected.</p>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="rounded-3xl bg-slate-950 p-5 text-white">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-100">Selected Account</p>
                <p className="mt-2 text-xl font-black">{selectedUser.name}</p>
                <p className="mt-1 text-sm text-slate-300">{selectedUser.email}</p>
                <p className="mt-3 text-xs font-semibold text-slate-400">Created: {new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>

              <label className="grid gap-2 text-sm font-black text-slate-700">
                Name
                <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus-ring" value={editForm.name} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-700">
                Email
                <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus-ring" value={editForm.email} onChange={(event) => setEditForm({ ...editForm, email: event.target.value })} />
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-700">
                Status
                <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus-ring" value={editForm.status} onChange={(event) => setEditForm({ ...editForm, status: event.target.value })}>
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-black text-slate-700">
                New Password Optional
                <input type="password" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus-ring" value={editPassword} onChange={(event) => setEditPassword(event.target.value)} placeholder="Leave empty to keep current password" />
              </label>

              <div>
                <p className="text-sm font-black text-slate-700">Role Assignment</p>
                <div className="mt-3 grid gap-2">
                  {roleOptions.map((role) => (
                    <label key={role.name} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm transition hover:border-brand-200 hover:bg-brand-50">
                      <input type="checkbox" checked={editForm.roles.includes(role.name)} onChange={() => toggleEditRole(role.name)} className="mt-1" />
                      <span>
                        <span className="block font-black text-slate-900">{role.label}</span>
                        <span className="block text-xs font-semibold text-slate-500">{role.permissions.length} permissions</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button disabled={isBusy} onClick={saveSelectedUser} className="rounded-full brand-gradient px-5 py-3 text-sm font-black text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-50">
                  Save Changes
                </button>
                <button disabled={isBusy} onClick={banSelectedUser} className="rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                  Soft Ban User
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
