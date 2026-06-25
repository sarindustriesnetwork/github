export function PermissionBadge({ permission }: { permission: string }) {
  return (
    <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-black text-brand-700">
      {permission}
    </span>
  );
}
