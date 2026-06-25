type StatCardProps = {
  title: string;
  value: string;
  helper?: string;
  tone?: "light" | "dark";
};

export function StatCard({ title, value, helper, tone = "light" }: StatCardProps) {
  const isDark = tone === "dark";
  return (
    <div className={isDark ? "rounded-2xl border border-white/10 bg-white/5 p-4" : "premium-card rounded-2xl p-4"}>
      <p className={isDark ? "text-sm font-semibold text-slate-400" : "text-sm font-semibold text-slate-500"}>{title}</p>
      <p className={isDark ? "mt-2 text-2xl font-black text-white" : "mt-2 text-2xl font-black text-slate-950"}>{value}</p>
      {helper ? <p className={isDark ? "mt-1 text-xs text-slate-400" : "mt-1 text-xs text-slate-500"}>{helper}</p> : null}
    </div>
  );
}
