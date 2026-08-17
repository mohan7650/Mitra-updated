import {
  HeartPulse,
  Stethoscope,
  Scissors,
  Users,
  ShoppingBag,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { features } from "@/lib/data";

const icons: Record<string, LucideIcon> = {
  "heart-pulse": HeartPulse,
  stethoscope: Stethoscope,
  scissors: Scissors,
  users: Users,
  "shopping-bag": ShoppingBag,
  "shield-check": ShieldCheck,
};

export default function FeatureStrip() {
  return (
    <div className="rounded-4xl bg-cream-50/80 backdrop-blur shadow-soft px-3 py-5">
      <ul className="grid grid-cols-6 divide-x divide-cream-300">
        {features.map((f) => {
          const Icon = icons[f.icon];
          return (
            <li key={f.id} className="flex flex-col items-center gap-2 px-1">
              <Icon className={`h-6 w-6 ${f.tint}`} strokeWidth={2} />
              <span className="text-center text-[11px] font-600 leading-tight text-bark-600 whitespace-pre-line">
                {f.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
