"use client";

import Link from "next/link";
import {
  ArrowLeft, ChevronDown, ChevronRight, Scissors, Stethoscope,
  Footprints, Home, Shield, Syringe, HeartPulse, AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import BottomNav from "@/components/home/BottomNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { careServices } from "@/lib/data";

const icons: Record<string, LucideIcon> = {
  scissors: Scissors, stethoscope: Stethoscope, footprints: Footprints,
  home: Home, shield: Shield, syringe: Syringe, "heart-pulse": HeartPulse,
  "alert-triangle": AlertTriangle,
};

export default function CarePage() {
  return (
    <ProtectedRoute>
      <CarePageContent />
    </ProtectedRoute>
  );
}

function CarePageContent() {
  return (
    <div className="min-h-screen bg-cream-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-5">
          <Link href="/home" aria-label="Back" className="grid h-10 w-10 place-items-center rounded-full bg-cream-50 text-bark-600 shadow-soft">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl text-coral-500">🐾</span>
              <h1 className="font-display text-3xl font-700 text-bark-700">Mitra Care</h1>
            </div>
            <p className="text-xs text-bark-500">Everything your pet needs, in one place ❤️</p>
          </div>
          <span className="flex items-center gap-1">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-lg ring-2 ring-coral-400">🐶</span>
            <ChevronDown className="h-4 w-4 text-bark-500" />
          </span>
        </header>

        <main className="flex-1 px-4 pb-28 pt-5">
          {/* Service grid */}
          <div className="grid grid-cols-2 gap-3">
            {careServices.map((s) => {
              const Icon = icons[s.icon];
              return (
                <button key={s.id} className={`relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br ${s.bg} p-4 text-left shadow-soft transition active:scale-[0.98]`}>
                  <span className={`grid h-11 w-11 place-items-center rounded-full ${s.badge}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="pointer-events-none absolute right-3 top-3 text-4xl opacity-90">{s.emoji}</span>
                  <h3 className="mt-3 font-display text-lg font-700 leading-tight text-bark-700">{s.title}</h3>
                  <p className="mt-1 text-xs leading-snug text-bark-500">{s.desc}</p>
                  <span className="mt-3 grid h-8 w-8 place-items-center self-end rounded-full bg-white/80 text-bark-600 shadow-soft">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Emergency banner */}
          <div className="mt-4 flex items-center gap-3 rounded-3xl bg-gradient-to-r from-violet-100 to-purple-50 p-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-soft">📱</span>
            <div className="flex-1">
              <p className="font-display font-700 text-bark-700">Need Help Now?</p>
              <p className="text-xs text-bark-500">Find 24/7 emergency vets near you in seconds.</p>
            </div>
            <button className="flex items-center gap-1 whitespace-nowrap rounded-full border-2 border-violet-500 px-3 py-2 text-xs font-600 text-violet-600">
              Find Emergency Care <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
