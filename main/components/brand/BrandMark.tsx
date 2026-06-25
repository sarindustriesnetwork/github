import { BRAND } from "@/lib/branding";

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl brand-gradient text-sm font-black text-white shadow-glow">
        SAR
      </div>
      <div>
        <p className="text-sm font-black tracking-[0.18em] text-slate-950">{BRAND.name}</p>
        <p className="text-xs font-semibold text-slate-500">Official Control Center</p>
      </div>
    </div>
  );
}
