"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Share2, LogOut, BadgeCheck, MapPin, Calendar, Pencil, UserPlus,
  Home, Info, HeartPulse, FileText, Users, ChevronRight, Video,
  Image as ImageIcon, Gift, ShieldCheck, Phone, ScanLine,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Qr from "@/components/Qr";
import BottomNav from "@/components/home/BottomNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/AuthContext";
import { rocky, profileTabs, highlights, profileStats, aboutRocky } from "@/lib/data";

const tabIcons: Record<string, typeof Home> = {
  Overview: Home, About: Info, Health: HeartPulse,
  Records: FileText, Moments: FileText, "Paw Pals": UserPlus,
};
const statIcons: Record<string, typeof Home> = {
  image: ImageIcon, users: Users, calendar: Calendar, gift: Gift,
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}

function ProfilePageContent() {
  const [tab, setTab] = useState("Overview");
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <main className="flex-1 px-4 pb-28 pt-5">
          {/* Header row */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-6xl ring-4 ring-cream-50 shadow-soft">
                🐶
              </div>
              <span className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-sky-500 text-white ring-2 ring-cream-100">
                <ScanLine className="h-4 w-4" />
              </span>
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-3xl font-700 text-bark-700">{rocky.name}</h1>
                <BadgeCheck className="h-6 w-6 fill-sky-500 text-cream-50" />
              </div>
              <p className="text-sm text-bark-500">
                {rocky.breed} • {rocky.age}
              </p>
            </div>
            <div className="flex gap-2">
              <button aria-label="Share" className="grid h-10 w-10 place-items-center rounded-full bg-cream-50 text-bark-600 shadow-soft">
                <Share2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Logout"
                className="grid h-10 w-10 place-items-center rounded-full bg-cream-50 text-bark-600 shadow-soft"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {rocky.tags.map((t) => (
              <span key={t.label} className={`rounded-full px-3 py-1 text-sm font-600 ${t.tint}`}>
                {t.label}
              </span>
            ))}
          </div>

          {/* Location + born */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-bark-600">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-forest-500" />{rocky.location}</span>
            <span className="text-cream-300">|</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-bark-500" />{rocky.born}</span>
          </div>

          {/* Mitra Pet ID */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-cream-50 p-4 shadow-soft ring-1 ring-cream-200">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <ScanLine className="h-5 w-5 text-bark-600" />
                <span className="font-display text-lg font-600 text-bark-700">Mitra Pet ID</span>
              </div>
              <p className="mt-0.5 text-xs text-bark-500">Scan my QR if I get lost 🐾</p>
              <p className="mt-3 text-sm text-bark-600">
                Pet ID: <span className="font-700 text-bark-700">{rocky.petId}</span>
              </p>
            </div>
            <Qr size={74} />
          </div>

          {/* Actions */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-coral-500/10 font-600 text-coral-500">
              <Pencil className="h-4 w-4" /> Edit Profile
            </button>
            <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-cream-200 font-600 text-bark-600">
              <UserPlus className="h-4 w-4" /> Share Profile
            </button>
          </div>

          {/* Tab strip */}
          <div className="no-scrollbar mt-4 flex gap-6 overflow-x-auto border-b border-cream-200 pb-0">
            {profileTabs.map((t) => {
              const Icon = tabIcons[t];
              const on = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex shrink-0 flex-col items-center gap-1 pb-2 ${
                    on ? "text-coral-500" : "text-bark-500"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className={`text-xs ${on ? "font-700" : "font-500"}`}>{t}</span>
                  <span className={`h-0.5 w-8 rounded-full ${on ? "bg-coral-500" : "bg-transparent"}`} />
                </button>
              );
            })}
          </div>

          {/* Social highlights */}
          <div className="mt-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-700 text-bark-700">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-sky-100 text-sky-600 text-xs">🐾</span>
              Social Highlights
            </h2>
            <button className="flex items-center gap-0.5 text-sm font-600 text-sky-500">See all <ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
            {highlights.map((h) => (
              <div key={h.id} className={`relative aspect-square w-40 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br ${h.bg} grid place-items-center text-5xl`}>
                {h.emoji}
                {h.video && (
                  <span className="absolute bottom-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-bark-700/60 text-white">
                    <Video className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-4 gap-2 rounded-2xl bg-cream-50 p-3 shadow-soft ring-1 ring-cream-200">
            {profileStats.map((s) => {
              const Icon = statIcons[s.icon];
              return (
                <div key={s.label} className="flex flex-col items-center gap-1 text-center">
                  <span className={`grid h-9 w-9 place-items-center rounded-full ${s.tint}`}><Icon className="h-4 w-4" /></span>
                  <span className="font-display text-lg font-700 text-bark-700 leading-none">{s.value}</span>
                  <span className="text-[10px] leading-tight text-bark-500">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* About + Health */}
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div className="rounded-2xl bg-cream-50 p-4 shadow-soft ring-1 ring-cream-200">
              <h3 className="flex items-center gap-2 font-display text-lg font-700 text-bark-700">
                <span className="text-violet-500">👤</span> About {rocky.name}
              </h3>
              <dl className="mt-3 space-y-2 text-sm">
                {aboutRocky.map((row) => (
                  <div key={row.k} className="flex gap-4">
                    <dt className="w-32 shrink-0 text-bark-500">{row.k}</dt>
                    <dd className="font-600 text-bark-700">{row.v}</dd>
                  </div>
                ))}
              </dl>
              <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-violet-50 py-2.5 text-sm font-600 text-violet-600">
                View Full Details <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-cream-50 p-4 shadow-soft ring-1 ring-cream-200">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-lg font-700 text-bark-700">
                  <HeartPulse className="h-5 w-5 text-emerald-500" /> Health Summary
                </h3>
                <button className="flex items-center gap-0.5 text-sm font-600 text-sky-500">View All <ChevronRight className="h-4 w-4" /></button>
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-xl bg-emerald-50 p-3">
                <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-500" />
                <div>
                  <p className="font-700 text-emerald-600">Up to date</p>
                  <p className="text-xs text-bark-500">All vaccinations are up to date!</p>
                </div>
              </div>
              <div className="mt-3 space-y-3 text-sm">
                <HealthRow label="Next Vaccine" name="Rabies" date="Aug 12, 2025" note="In 32 days" />
                <HealthRow label="Next Checkup" name="Annual Wellness" date="Sep 05, 2025" note="In 56 days" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-bark-500">Active Medications</p>
                    <p className="font-600 text-bark-700">Heartworm Chewable</p>
                  </div>
                  <span className="text-bark-500">Monthly</span>
                </div>
              </div>
              <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-emerald-50 py-2.5 text-sm font-600 text-emerald-600">
                View Health Records <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Parent + Pet ID safety */}
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div className="rounded-2xl bg-cream-50 p-4 shadow-soft ring-1 ring-cream-200">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-lg font-700 text-bark-700"><span className="text-violet-500">👤</span> Pet Parent</h3>
                <button className="text-sm font-600 text-violet-600">Edit</button>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-b from-rose-200 to-amber-100 text-2xl">👩</span>
                <div className="text-sm">
                  <p className="font-700 text-bark-700">Bhavani M.</p>
                  <p className="flex items-center gap-1 text-bark-500"><Phone className="h-3 w-3" />(312) 555-7849</p>
                  <p className="text-bark-500">bhavani.mitra@gmail.com</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-violet-50 p-3 text-sm">
                <div>
                  <p className="text-violet-600 font-600">Emergency Contact</p>
                  <p className="text-bark-600">Mom (312) 555-9865</p>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-violet-600 shadow-soft"><Phone className="h-4 w-4" /></span>
              </div>
            </div>

            <div className="rounded-2xl bg-cream-50 p-4 shadow-soft ring-1 ring-cream-200">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-lg font-700 text-bark-700"><ShieldCheck className="h-5 w-5 text-amber-500" /> Pet ID & Safety</h3>
                <ChevronRight className="h-5 w-5 text-bark-400" />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <p className="flex-1 text-sm text-bark-600">Rocky&rsquo;s QR can help reunite you if he gets lost.</p>
                <Qr size={60} />
              </div>
              <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-amber-50 py-2.5 text-sm font-600 text-amber-600">
                View Pet ID Card
              </button>
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

function HealthRow({ label, name, date, note }: { label: string; name: string; date: string; note: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-bark-500">{label}</p>
        <p className="font-700 text-bark-700">{name}</p>
      </div>
      <div className="text-right">
        <p className="font-600 text-bark-700">{date}</p>
        <p className="text-emerald-500">{note}</p>
      </div>
    </div>
  );
}
