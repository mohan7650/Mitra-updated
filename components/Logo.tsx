import { PawPrint } from "lucide-react";

type LogoVariant = "forest" | "dark" | "coral";
type LogoSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<LogoSize, { text: string; paw: number; dot: string }> = {
  sm: { text: "text-2xl", paw: 12, dot: "-top-0.5" },
  md: { text: "text-3xl", paw: 15, dot: "-top-1" },
  lg: { text: "text-5xl", paw: 22, dot: "-top-1.5" },
  xl: { text: "text-6xl", paw: 26, dot: "-top-2" },
};

const colorMap: Record<LogoVariant, { m: string; i: string; tra: string; paw: string }> = {
  // In-app dark wordmark (home header) — coral paw dot
  dark: { m: "text-bark-700", i: "text-bark-700", tra: "text-bark-700", paw: "text-coral-500" },
  // Onboarding / welcome — green with an amber "i"
  forest: { m: "text-forest-600", i: "text-amber-500", tra: "text-forest-600", paw: "text-amber-500" },
  coral: { m: "text-coral-500", i: "text-coral-500", tra: "text-coral-500", paw: "text-amber-500" },
};

export default function Logo({
  variant = "forest",
  size = "md",
  className = "",
}: {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}) {
  const s = sizeMap[size];
  const c = colorMap[variant];

  return (
    <span
      className={`font-display font-600 lowercase leading-none tracking-tight inline-flex items-start ${s.text} ${className}`}
      aria-label="Mitra"
    >
      <span className={c.m}>m</span>
      {/* the "i" — its dot is a paw print */}
      <span className="relative inline-block">
        <span className={c.i}>ı</span>
        <PawPrint
          size={s.paw}
          strokeWidth={2.5}
          className={`absolute left-1/2 -translate-x-1/2 ${s.dot} ${c.paw} rotate-12 fill-current`}
        />
      </span>
      <span className={c.tra}>tra</span>
    </span>
  );
}
