"use client";

import {
  ShoppingCart, Bell, ChevronDown, Search, ScanLine, ChevronRight,
  Star, Plus, Truck, Package, ShieldCheck, Heart, MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import BottomNav from "@/components/home/BottomNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  shopCategoriesRail, shopCategories, topPicks, shopTrust,
} from "@/lib/data";

const trustIcons: Record<string, LucideIcon> = {
  truck: Truck, package: Package, "shield-check": ShieldCheck, heart: Heart,
};

export default function ShopPage() {
  return (
    <ProtectedRoute>
      <ShopPageContent />
    </ProtectedRoute>
  );
}

function ShopPageContent() {
  return (
    <div className="min-h-screen bg-cream-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        {/* Header */}
        <header className="px-4 pt-5">
          <div className="flex items-center justify-between">
            <button aria-label="Cart" className="grid h-11 w-11 place-items-center rounded-full bg-cream-50 text-bark-600 shadow-soft">
              <ShoppingCart className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-3xl font-700 text-bark-700">Mitra Shop</h1>
                <span className="text-lg text-coral-500">🐾</span>
              </div>
              <p className="text-xs text-bark-500">Everything your pet needs, delivered with love ❤️</p>
            </div>
            <div className="flex items-center gap-1">
              <button aria-label="Notifications" className="relative grid h-11 w-11 place-items-center rounded-full bg-cream-50 text-bark-600 shadow-soft">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-coral-500 text-[10px] font-700 text-white ring-2 ring-cream-100">3</span>
              </button>
              <span className="flex items-center gap-0.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-lg ring-2 ring-amber-300">🐶</span>
                <ChevronDown className="h-4 w-4 text-bark-500" />
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 flex items-center gap-2 rounded-full bg-cream-50 px-4 py-3 shadow-soft ring-1 ring-cream-200">
            <Search className="h-5 w-5 text-bark-400" />
            <input placeholder="Search for food, toys, accessories & more..." className="w-full bg-transparent text-sm text-bark-700 outline-none placeholder:text-bark-400" />
            <ScanLine className="h-5 w-5 text-bark-400" />
          </div>
        </header>

        <main className="flex-1 pb-28">
          {/* Category rail */}
          <div className="no-scrollbar mt-4 flex gap-4 overflow-x-auto px-4">
            {shopCategoriesRail.map((c) => (
              <button key={c.id} className="flex shrink-0 flex-col items-center gap-1.5">
                <span className={`grid h-14 w-14 place-items-center rounded-full ${c.bg} text-2xl shadow-soft`}>{c.emoji}</span>
                <span className="whitespace-pre-line text-center text-[11px] font-600 leading-tight text-bark-600">{c.label}</span>
              </button>
            ))}
            <button className="flex shrink-0 flex-col items-center gap-1.5">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-cream-200 text-bark-500 shadow-soft"><MoreHorizontal className="h-5 w-5" /></span>
              <span className="text-[11px] font-600 text-bark-600">More</span>
            </button>
          </div>

          {/* Hero banner */}
          <div className="mx-4 mt-4 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-200 to-purple-100 p-5">
            <div className="flex items-center justify-between">
              <div className="max-w-[62%]">
                <p className="font-display text-xl font-700 leading-tight text-violet-700">
                  Everything for 💜<br />Happy Pets 🐾
                </p>
                <p className="mt-1 text-xs text-violet-600/80">Top quality products for a healthy, happy life.</p>
                <button className="mt-3 rounded-full bg-violet-600 px-5 py-2 text-sm font-600 text-white shadow-soft">Shop Now</button>
              </div>
              <div className="text-6xl">🐶🐱</div>
            </div>
          </div>

          {/* Shop by category */}
          <SectionHead title="Shop by Category" />
          <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
            {shopCategories.map((c) => (
              <div key={c.id} className={`rounded-2xl bg-gradient-to-br ${c.bg} p-4 shadow-soft`}>
                <div className="grid h-16 place-items-center text-4xl">{c.emoji}</div>
                <p className="mt-2 text-center font-display text-base font-700 text-bark-700">{c.label}</p>
                <p className="text-center text-[11px] text-bark-500">{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Top picks */}
          <SectionHead title="Top Picks for Rocky 🐾" />
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-4">
            {topPicks.map((p) => (
              <div key={p.id} className="w-44 shrink-0 overflow-hidden rounded-2xl bg-cream-50 shadow-soft ring-1 ring-cream-200">
                <div className={`relative grid h-32 place-items-center bg-gradient-to-br ${p.bg} text-5xl`}>
                  {p.emoji}
                  <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-700 ${p.badgeTint}`}>{p.badge}</span>
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 h-10 text-sm font-600 text-bark-700">{p.name}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-bark-500">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> ({p.rating})
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-base font-700 text-bark-700">{p.price}</span>
                      {p.was && <span className="text-xs text-bark-400 line-through">{p.was}</span>}
                    </div>
                    <button aria-label="Add to cart" className="grid h-8 w-8 place-items-center rounded-full bg-cream-100 text-bark-600 ring-1 ring-cream-300">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="mx-4 mt-5 grid grid-cols-4 gap-2 rounded-2xl bg-emerald-50/60 p-3">
            {shopTrust.map((t) => {
              const Icon = trustIcons[t.icon];
              return (
                <div key={t.title} className="flex flex-col items-center gap-1 text-center">
                  <Icon className={`h-5 w-5 ${t.tint}`} />
                  <span className="text-[10px] font-700 leading-tight text-bark-700">{t.title}</span>
                  <span className="text-[9px] leading-tight text-bark-500">{t.sub}</span>
                </div>
              );
            })}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <div className="mx-4 mt-5 flex items-center justify-between">
      <h2 className="font-display text-lg font-700 text-bark-700">{title}</h2>
      <button className="flex items-center gap-0.5 text-sm font-600 text-sky-500">See all <ChevronRight className="h-4 w-4" /></button>
    </div>
  );
}
