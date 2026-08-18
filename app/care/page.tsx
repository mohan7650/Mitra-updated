"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ChevronDown, ChevronRight, Scissors, Stethoscope,
  Footprints, Home, Shield, Syringe, HeartPulse, AlertTriangle,
  Sparkles, type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/home/BottomNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/AuthContext";
import { careServices } from "@/lib/data";
import {
  apiGetPets,
  apiGetVaccinations,
  apiGetMedicalRecords,
  apiGetMedications,
  apiGetAllergies,
  apiGetWeightRecords,
  apiGetGroomingRecords,
  apiGetReminders,
  ApiError,
  Pet,
  Vaccination,
  MedicalRecord,
  Medication,
  Allergy,
  WeightRecord,
  GroomingRecord,
  Reminder,
} from "@/lib/api";

const icons: Record<string, LucideIcon> = {
  scissors: Scissors, stethoscope: Stethoscope, footprints: Footprints,
  home: Home, shield: Shield, syringe: Syringe, "heart-pulse": HeartPulse,
  "alert-triangle": AlertTriangle,
};

const EMPTY = "Not added yet";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function formatRelative(dateStr: string | null): string {
  if (!dateStr) return "";
  const target = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "In 1 day";
  return `In ${diffDays} days`;
}

interface HealthData {
  vaccinations: Vaccination[];
  medicalRecords: MedicalRecord[];
  medications: Medication[];
  allergies: Allergy[];
  weightRecords: WeightRecord[];
  groomingRecords: GroomingRecord[];
  reminders: Reminder[];
  pet: Pet;
}

export default function CarePage() {
  return (
    <ProtectedRoute>
      <CarePageContent />
    </ProtectedRoute>
  );
}

function CarePageContent() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<HealthData | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    apiGetPets(accessToken)
      .then(async (pets) => {
        if (cancelled) return;
        if (pets.length === 0) {
          router.replace("/onboarding/pet-type");
          return;
        }
        const pet = pets[0];
        const [vaccinations, medicalRecords, medications, allergies, weightRecords, groomingRecords, reminders] =
          await Promise.all([
            apiGetVaccinations(accessToken, pet.id),
            apiGetMedicalRecords(accessToken, pet.id),
            apiGetMedications(accessToken, pet.id),
            apiGetAllergies(accessToken, pet.id),
            apiGetWeightRecords(accessToken, pet.id),
            apiGetGroomingRecords(accessToken, pet.id),
            apiGetReminders(accessToken),
          ]);
        if (cancelled) return;
        setData({ vaccinations, medicalRecords, medications, allergies, weightRecords, groomingRecords, reminders, pet });
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        if (!(err instanceof ApiError)) console.error(err);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, router]);

  if (status === "loading" || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <p className="text-bark-500">Loading care information…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream-100 px-6 text-center">
        <p className="text-bark-600">We couldn&rsquo;t load your pet&rsquo;s care information right now.</p>
        <Link href="/home" className="text-sm font-600 text-coral-500">Back to Home</Link>
      </div>
    );
  }

  const { pet, vaccinations, medicalRecords, medications, allergies, weightRecords, groomingRecords, reminders } = data;

  const nextVaccination =
    [...vaccinations]
      .filter((v) => v.nextDueDate)
      .sort((a, b) => new Date(a.nextDueDate as string).getTime() - new Date(b.nextDueDate as string).getTime())[0]
    ?? vaccinations[0]
    ?? null;

  const activeMedications = medications.filter((m) => m.active);

  const latestWeightRecord = [...weightRecords].sort(
    (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  )[0];
  const latestWeightLabel = latestWeightRecord
    ? `${latestWeightRecord.weight} ${latestWeightRecord.unit} • ${formatDate(latestWeightRecord.recordedAt)}`
    : pet.weight != null
      ? `${pet.weight} ${pet.weightUnit ?? ""}`.trim()
      : EMPTY;

  const nextGrooming =
    [...groomingRecords]
      .filter((g) => g.nextDueDate)
      .sort((a, b) => new Date(a.nextDueDate as string).getTime() - new Date(b.nextDueDate as string).getTime())[0]
    ?? groomingRecords[0]
    ?? null;

  const latestMedicalRecord = [...medicalRecords].sort(
    (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime(),
  )[0];

  const upcomingReminders = reminders
    .filter((r) => r.petId === pet.id && !r.completed)
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 3);

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

          {/* Health overview */}
          <div className="mt-4 rounded-2xl bg-cream-50 p-4 shadow-soft ring-1 ring-cream-200">
            <h3 className="flex items-center gap-2 font-display text-lg font-700 text-bark-700">
              <Sparkles className="h-5 w-5 text-emerald-500" /> {pet.name}&rsquo;s Health Overview
            </h3>

            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-bark-500">Next Vaccination</dt>
                <dd className="text-right font-600 text-bark-700">
                  {nextVaccination
                    ? `${nextVaccination.name}${nextVaccination.nextDueDate ? ` • ${formatRelative(nextVaccination.nextDueDate)}` : ""}`
                    : "No vaccinations added yet"}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="text-bark-500">Active Medications</dt>
                <dd className="text-right font-600 text-bark-700">
                  {activeMedications.length > 0
                    ? activeMedications.map((m) => m.name).join(", ")
                    : "No medications added yet"}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="text-bark-500">Allergies</dt>
                <dd className="text-right font-600 text-bark-700">
                  {allergies.length > 0 ? allergies.map((a) => a.name).join(", ") : "No allergies added"}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="text-bark-500">Current Weight</dt>
                <dd className="text-right font-600 text-bark-700">{latestWeightLabel}</dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="text-bark-500">Next Grooming</dt>
                <dd className="text-right font-600 text-bark-700">
                  {nextGrooming
                    ? `${nextGrooming.serviceType}${nextGrooming.nextDueDate ? ` • ${formatRelative(nextGrooming.nextDueDate)}` : ""}`
                    : "No grooming records added yet"}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="text-bark-500">Latest Medical Record</dt>
                <dd className="text-right font-600 text-bark-700">
                  {latestMedicalRecord
                    ? `${latestMedicalRecord.title} • ${formatDate(latestMedicalRecord.recordDate)}`
                    : "No medical records added yet"}
                </dd>
              </div>
            </dl>

            <div className="mt-4 border-t border-cream-200 pt-3">
              <p className="text-sm font-600 text-bark-600">Upcoming Reminders</p>
              {upcomingReminders.length > 0 ? (
                <ul className="mt-2 space-y-2 text-sm">
                  {upcomingReminders.map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-4">
                      <span className="text-bark-700">{r.title}</span>
                      <span className="text-bark-500">{formatRelative(r.dueAt)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-bark-500">No reminders added yet</p>
              )}
            </div>
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
