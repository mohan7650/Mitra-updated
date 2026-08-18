"use client";

import {
  UserPlus, Bell, Search, SlidersHorizontal, ChevronRight,
  Check, X, Calendar, MapPin,
} from "lucide-react";
import BottomNav from "@/components/home/BottomNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  communityShortcuts, petsNearYou, connectionRequests, meetups,
} from "@/lib/data";

function Sex({ s }: { s: string }) {
  return s === "m"
    ? <span className="text-sky-500">♂</span>
    : <span className="text-rose-400">♀</span>;
}

export default function CommunityPage() {
  return (
    <ProtectedRoute>
      <CommunityPageContent />
    </ProtectedRoute>
  );
}

function CommunityPageContent() {
  return (
    <div className="min-h-screen bg-cream-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        {/* Header */}
        <header className="px-4 pt-5">
          <div className="flex items-center justify-between">
            <button aria-label="Add friend" className="grid h-11 w-11 place-items-center rounded-full bg-cream-50 text-bark-600 shadow-soft">
              <UserPlus className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-3xl font-700 text-bark-700">Community</h1>
                <span className="text-lg text-coral-500">🐾</span>
              </div>
              <p className="text-xs text-bark-500">Find your pack. Build bonds. ❤️</p>
            </div>
            <div className="flex items-center gap-1">
              <button aria-label="Notifications" className="relative grid h-11 w-11 place-items-center rounded-full bg-cream-50 text-bark-600 shadow-soft">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-coral-500 text-[10px] font-700 text-white ring-2 ring-cream-100">3</span>
              </button>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-lg ring-2 ring-coral-400">🐶</span>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 flex items-center gap-2 rounded-full bg-cream-50 px-4 py-3 shadow-soft ring-1 ring-cream-200">
            <Search className="h-5 w-5 text-bark-400" />
            <input placeholder="Search pets, breeds or locations" className="w-full bg-transparent text-sm text-bark-700 outline-none placeholder:text-bark-400" />
            <SlidersHorizontal className="h-5 w-5 text-bark-400" />
          </div>
        </header>

        <main className="flex-1 pb-28">
          {/* Shortcuts */}
          <div className="mt-4 grid grid-cols-3 gap-3 px-4">
            {communityShortcuts.map((s) => (
              <button key={s.id} className={`flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-br ${s.bg} p-3 shadow-soft`}>
                <span className="text-3xl">{s.emoji}</span>
                <span className="text-center text-xs font-700 text-bark-700">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Pets near you */}
          <SectionHead icon={<MapPin className="h-5 w-5 text-forest-500" />} title="Pets Near You" />
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-4">
            {petsNearYou.map((p) => (
              <div key={p.id} className="w-44 shrink-0 overflow-hidden rounded-2xl bg-cream-50 shadow-soft ring-1 ring-cream-200">
                <div className={`relative grid h-32 place-items-center bg-gradient-to-br ${p.bg} text-5xl`}>
                  {p.emoji}
                  <span className="absolute left-2 top-2 rounded-full bg-bark-700/60 px-2 py-0.5 text-[10px] font-600 text-white">{p.dist}</span>
                  <span className="absolute right-2 top-2 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="p-3">
                  <p className="flex items-center gap-1 font-display text-base font-700 text-bark-700">{p.name} <Sex s={p.sex} /></p>
                  <p className="text-xs text-bark-500">{p.breed} • {p.age}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {p.tags.map((t) => (
                      <span key={t.t} className={`rounded-full px-2 py-0.5 text-[10px] font-600 ${t.c}`}>{t.t}</span>
                    ))}
                  </div>
                  <button className="mt-2 flex w-full items-center justify-center gap-1 rounded-full bg-forest-400/15 py-1.5 text-sm font-600 text-forest-600">
                    Connect <UserPlus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Connection requests */}
          <div className="mx-4 mt-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-700 text-bark-700">
              <span className="text-violet-500">🐾</span> Connection Requests
              <span className="grid h-5 w-5 place-items-center rounded-full bg-coral-500 text-[11px] font-700 text-white">3</span>
            </h2>
            <button className="flex items-center gap-0.5 text-sm font-600 text-sky-500">See all <ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-4">
            {connectionRequests.map((r) => (
              <div key={r.id} className="w-40 shrink-0 rounded-2xl bg-cream-50 p-3 text-center shadow-soft ring-1 ring-cream-200">
                <span className={`mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-b ${r.bg} text-3xl ring-2 ring-coral-300`}>{r.emoji}</span>
                <p className="mt-2 flex items-center justify-center gap-1 font-700 text-bark-700">{r.name} <Sex s={r.sex} /></p>
                <p className="text-[11px] text-bark-500">{r.breed} • {r.age}</p>
                <p className="text-[11px] text-bark-400">{r.mutual}</p>
                <div className="mt-2 flex justify-center gap-2">
                  <button aria-label="Decline" className="grid h-9 w-9 place-items-center rounded-full bg-cream-200 text-bark-500"><X className="h-4 w-4" /></button>
                  <button aria-label="Accept" className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-white"><Check className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming meetups */}
          <div className="mx-4 mt-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-700 text-bark-700">
              <Calendar className="h-5 w-5 text-rose-400" /> Upcoming Meetups
            </h2>
            <button className="flex items-center gap-0.5 text-sm font-600 text-sky-500">See all <ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="mx-4 mt-3 space-y-3">
            {meetups.map((m) => (
              <div key={m.id} className="flex overflow-hidden rounded-2xl bg-cream-50 shadow-soft ring-1 ring-cream-200">
                <div className={`grid w-32 shrink-0 place-items-center bg-gradient-to-br ${m.bg} text-4xl`}>{m.scene}</div>
                <div className="flex-1 p-3">
                  <p className="font-display font-700 text-bark-700">{m.title} {m.emoji}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-bark-500"><Calendar className="h-3.5 w-3.5" />{m.date}</p>
                  <p className="flex items-center gap-1 text-xs text-bark-500"><MapPin className="h-3.5 w-3.5" />{m.place}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {["🐶", "🦊", "🐕", "🐩"].map((e, i) => (
                        <span key={i} className="grid h-6 w-6 place-items-center rounded-full bg-cream-200 text-xs ring-2 ring-cream-50">{e}</span>
                      ))}
                      <span className="grid h-6 min-w-6 place-items-center rounded-full bg-cream-300 px-1 text-[10px] font-700 text-bark-600 ring-2 ring-cream-50">{m.extra}</span>
                    </div>
                    <button className="rounded-full bg-coral-500/15 px-4 py-1.5 text-sm font-600 text-coral-500">Join</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mx-4 mt-5 flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-display text-lg font-700 text-bark-700">{icon} {title}</h2>
      <button className="flex items-center gap-0.5 text-sm font-600 text-sky-500">See all <ChevronRight className="h-4 w-4" /></button>
    </div>
  );
}
