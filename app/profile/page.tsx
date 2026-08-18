"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Share2, LogOut, BadgeCheck, Calendar, Pencil, UserPlus,
  Home, Info, HeartPulse, FileText, Users, ChevronRight, Video,
  Image as ImageIcon, Gift, ShieldCheck, Phone, ScanLine, Check, Plus, X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PetQrCode from "@/components/PetQrCode";
import BottomNav from "@/components/home/BottomNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/AuthContext";
import {
  apiGetPets, apiGetPetProfile, apiGetPetSafetyProfile,
  Pet, PetProfile, ProfileSafetyProfile, ApiError,
} from "@/lib/api";
import {
  profileTabs, highlights,
  personalityTraitOptions, favoriteActivityOptions, favoriteTreatOptions, optionLabel,
} from "@/lib/data";

const tabIcons: Record<string, typeof Home> = {
  Overview: Home, About: Info, Health: HeartPulse,
  Records: FileText, Moments: FileText, "Paw Pals": UserPlus,
};

const traitTagColors = [
  "bg-forest-400/15 text-forest-600",
  "bg-sky-400/15 text-sky-600",
  "bg-rose-400/15 text-rose-600",
  "bg-amber-400/15 text-amber-600",
  "bg-violet-400/15 text-violet-600",
  "bg-orange-400/15 text-orange-600",
];

const speciesEmoji: Record<string, string> = {
  DOG: "🐶",
  CAT: "🐱",
  BIRD: "🦜",
  RABBIT: "🐰",
  SMALL: "🐹",
  REPTILE: "🐢",
};

const EMPTY = "Not added yet";

function formatAge(dateOfBirth: string | null): string {
  if (!dateOfBirth) return EMPTY;
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let months = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
  if (now.getDate() < dob.getDate()) months -= 1;
  if (months < 0) months = 0;
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"}`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (remMonths === 0) return `${years} ${years === 1 ? "year" : "years"}`;
  return `${years} yr ${remMonths} mo`;
}

function formatBornOn(dateOfBirth: string | null): string {
  if (!dateOfBirth) return EMPTY;
  const dob = new Date(dateOfBirth);
  return `Born on ${dob.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
}

function formatGender(gender: string | null): string {
  if (!gender) return EMPTY;
  const g = gender.toUpperCase();
  if (g === "MALE") return "Male";
  if (g === "FEMALE") return "Female";
  if (g === "UNKNOWN") return "Unknown";
  return gender;
}

function formatWeight(latestWeight: PetProfile["health"]["latestWeight"]): string {
  if (!latestWeight) return EMPTY;
  return `${latestWeight.weight}${latestWeight.unit ? ` ${latestWeight.unit}` : ""}`;
}

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

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}

const SELECTED_PET_KEY = "mitra_selected_pet_id";

function ProfilePageContent() {
  const [tab, setTab] = useState("Overview");
  const { logout, accessToken } = useAuth();
  const router = useRouter();

  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const [profile, setProfile] = useState<PetProfile | null>(null);
  const [safety, setSafety] = useState<ProfileSafetyProfile | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // Load the pet list once, then decide which pet is selected.
  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    apiGetPets(accessToken)
      .then((fetchedPets) => {
        if (cancelled) return;
        if (fetchedPets.length === 0) {
          router.replace("/onboarding/pet-type");
          return;
        }
        setPets(fetchedPets);
        const storedId = localStorage.getItem(SELECTED_PET_KEY);
        const storedStillExists = storedId && fetchedPets.some((p) => p.id === storedId);
        setSelectedPetId(storedStillExists ? storedId : fetchedPets[0].id);
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

  // Refetch profile + safety data whenever the selected pet changes.
  useEffect(() => {
    if (!accessToken || !selectedPetId) return;
    let cancelled = false;
    setStatus("loading");

    Promise.all([
      apiGetPetProfile(accessToken, selectedPetId),
      apiGetPetSafetyProfile(accessToken, selectedPetId),
    ])
      .then(([fetchedProfile, fetchedSafety]) => {
        if (cancelled) return;
        setProfile(fetchedProfile);
        setSafety(fetchedSafety);
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
  }, [accessToken, selectedPetId]);

  function handleSelectPet(petId: string) {
    setSwitcherOpen(false);
    if (petId === selectedPetId) return;
    localStorage.setItem(SELECTED_PET_KEY, petId);
    setSelectedPetId(petId);
  }

  function handleAddPet() {
    setSwitcherOpen(false);
    router.push("/onboarding/pet-type");
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  if (status === "loading" || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <p className="text-bark-500">Loading profile…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream-100 px-6 text-center">
        <p className="text-bark-600">We couldn&rsquo;t load your pet&rsquo;s profile right now.</p>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-600 text-coral-500"
        >
          Log out
        </button>
      </div>
    );
  }

  const { pet, owner, profilePhoto, health, emergencyContacts, socialStats } = profile;
  const primaryContact = emergencyContacts[0] ?? null;
  const primaryMedication = health.activeMedications[0] ?? null;
  const ownerName = `${owner.firstName} ${owner.lastName}`.trim();

  const aboutRows = [
    { k: "Breed", v: pet.breed ?? EMPTY },
    { k: "Gender", v: formatGender(pet.gender) },
    { k: "Weight", v: formatWeight(health.latestWeight) },
    { k: "Color", v: pet.coatColor ?? EMPTY },
    {
      k: "Personality",
      v: pet.personalityTraits.length > 0
        ? pet.personalityTraits.map((t) => optionLabel(personalityTraitOptions, t)).join(", ")
        : EMPTY,
    },
    {
      k: "Favorite Activities",
      v: pet.favoriteActivities.length > 0
        ? pet.favoriteActivities.map((t) => optionLabel(favoriteActivityOptions, t)).join(", ")
        : EMPTY,
    },
    {
      k: "Favorite Treats",
      v: pet.favoriteTreats.length > 0
        ? pet.favoriteTreats.map((t) => optionLabel(favoriteTreatOptions, t)).join(", ")
        : EMPTY,
    },
  ];

  const statsDisplay = [
    { label: "Paw Moments", value: String(socialStats.pawMoments), icon: "image", tint: "bg-emerald-100 text-emerald-600" },
    { label: "Paw Pals", value: String(socialStats.pawPals), icon: "users", tint: "bg-violet-100 text-violet-600" },
    { label: "Meetups", value: "0", icon: "calendar", tint: "bg-rose-100 text-rose-500" },
    { label: "Paw It Forward", value: "0", icon: "gift", tint: "bg-orange-100 text-orange-500" },
  ];
  const statIcons: Record<string, typeof Home> = {
    image: ImageIcon, users: Users, calendar: Calendar, gift: Gift,
  };

  const safetyBlurb = safety?.emergencyNotes || `${pet.name}’s QR can help reunite you if they get lost.`;

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <main className="flex-1 px-4 pb-28 pt-5">
          {/* Header row */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              {profilePhoto?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profilePhoto.imageUrl}
                  alt={pet.name}
                  className="h-28 w-28 rounded-full object-cover ring-4 ring-cream-50 shadow-soft"
                />
              ) : (
                <div className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-6xl ring-4 ring-cream-50 shadow-soft">
                  {speciesEmoji[pet.species.toUpperCase()] ?? "🐾"}
                </div>
              )}
              <span className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-sky-500 text-white ring-2 ring-cream-100">
                <ScanLine className="h-4 w-4" />
              </span>
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-3xl font-700 text-bark-700">{pet.name}</h1>
                <BadgeCheck className="h-6 w-6 fill-sky-500 text-cream-50" />
              </div>
              <p className="text-sm text-bark-500">
                {pet.breed ?? EMPTY} • {formatAge(pet.dateOfBirth)}
              </p>
              {pet.personalityTraits.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {pet.personalityTraits.map((trait, i) => (
                    <span
                      key={trait}
                      className={`rounded-full px-3 py-1 text-sm font-600 ${traitTagColors[i % traitTagColors.length]}`}
                    >
                      {optionLabel(personalityTraitOptions, trait)}
                    </span>
                  ))}
                </div>
              )}
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

          {/* Bio */}
          {pet.bio && (
            <p className="mt-3 text-sm text-bark-600">{pet.bio}</p>
          )}

          {/* Born */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-bark-600">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-bark-500" />{formatBornOn(pet.dateOfBirth)}</span>
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
                Pet ID: <span className="font-700 text-bark-700">{safety?.qrCodeId ?? "Generating…"}</span>
              </p>
            </div>
            {safety?.qrCodeId ? (
              <PetQrCode qrCodeId={safety.qrCodeId} size={74} />
            ) : (
              <div className="grid h-[74px] w-[74px] place-items-center rounded-md bg-cream-200" />
            )}
          </div>

          {/* Actions */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link
              href="/profile/edit"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-coral-500/10 font-600 text-coral-500"
            >
              <Pencil className="h-4 w-4" /> Edit Profile
            </Link>
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

          {/* Social highlights (demo content — no backing data model yet) */}
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
            {statsDisplay.map((s) => {
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
                <span className="text-violet-500">👤</span> About {pet.name}
              </h3>
              <dl className="mt-3 space-y-2 text-sm">
                {aboutRows.map((row) => (
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
                <Link href="/profile/health" className="flex items-center gap-0.5 text-sm font-600 text-sky-500">
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-xl bg-emerald-50 p-3">
                <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-500" />
                <div>
                  <p className="font-700 text-emerald-600">Health records available</p>
                  <p className="text-xs text-bark-500">Vaccinations, medications & allergies below.</p>
                </div>
              </div>
              <div className="mt-3 space-y-3 text-sm">
                <HealthRow
                  label="Next Vaccine"
                  name={health.nextVaccination?.name ?? "No upcoming vaccination"}
                  date={health.nextVaccination ? formatDate(health.nextVaccination.nextDueDate) : ""}
                  note={health.nextVaccination ? formatRelative(health.nextVaccination.nextDueDate) : ""}
                />
                <HealthRow
                  label="Next Checkup"
                  name={health.nextCheckup?.title ?? "Not scheduled"}
                  date={health.nextCheckup ? formatDate(health.nextCheckup.dueAt) : ""}
                  note={health.nextCheckup ? formatRelative(health.nextCheckup.dueAt) : ""}
                />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-bark-500">Active Medications</p>
                    <p className="font-600 text-bark-700">{primaryMedication?.name ?? "No active medications"}</p>
                  </div>
                  <span className="text-bark-500">{primaryMedication?.frequency ?? ""}</span>
                </div>
              </div>
              <Link
                href="/profile/health"
                className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-emerald-50 py-2.5 text-sm font-600 text-emerald-600"
              >
                View Health Records <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Parent + Pet ID safety */}
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div className="rounded-2xl bg-cream-50 p-4 shadow-soft ring-1 ring-cream-200">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-lg font-700 text-bark-700"><span className="text-violet-500">👤</span> Pet Parent</h3>
                <button
                  type="button"
                  onClick={() => router.push("/profile/edit-parent")}
                  className="text-sm font-600 text-violet-600"
                >
                  Edit
                </button>
              </div>

              {/* My Pets switcher */}
              <div className="mt-3 flex items-center justify-between rounded-xl bg-cream-100 p-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-xs font-600 text-bark-500">My Pets</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-cream-50 py-1 pl-1 pr-2.5 shadow-soft">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-sm">
                      {speciesEmoji[pet.species.toUpperCase()] ?? "🐾"}
                    </span>
                    <span className="truncate text-sm font-600 text-bark-700">{pet.name}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSwitcherOpen(true)}
                  className="shrink-0 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-600 text-violet-600"
                >
                  {pets.length > 1 ? "Switch / +" : "+ Add pet"}
                </button>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-b from-rose-200 to-amber-100 text-2xl">👤</span>
                <div className="text-sm">
                  <p className="font-700 text-bark-700">{ownerName || EMPTY}</p>
                  <p className="flex items-center gap-1 text-bark-500"><Phone className="h-3 w-3" />{owner.phone || EMPTY}</p>
                  <p className="text-bark-500">{owner.email}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-violet-50 p-3 text-sm">
                <div>
                  <p className="text-violet-600 font-600">Emergency Contact</p>
                  <p className="text-bark-600">
                    {primaryContact
                      ? `${primaryContact.name}${primaryContact.relationship ? ` (${primaryContact.relationship})` : ""} — ${primaryContact.phone}`
                      : EMPTY}
                  </p>
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
                <p className="flex-1 text-sm text-bark-600">{safetyBlurb}</p>
                {safety?.qrCodeId ? (
                  <PetQrCode qrCodeId={safety.qrCodeId} size={60} />
                ) : (
                  <div className="h-[60px] w-[60px] rounded-md bg-cream-200" />
                )}
              </div>
              {safety?.qrCodeId && (
                <Link
                  href={`/pet-id/${safety.qrCodeId}`}
                  target="_blank"
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-amber-50 py-2.5 text-sm font-600 text-amber-600"
                >
                  View Pet ID Card
                </Link>
              )}
            </div>
          </div>
        </main>

        {switcherOpen && (
          <PetSwitcherSheet
            pets={pets}
            selectedPetId={selectedPetId}
            onSelect={handleSelectPet}
            onAddPet={handleAddPet}
            onClose={() => setSwitcherOpen(false)}
          />
        )}

        <BottomNav />
      </div>
    </div>
  );
}

function PetSwitcherSheet({
  pets,
  selectedPetId,
  onSelect,
  onAddPet,
  onClose,
}: {
  pets: Pet[];
  selectedPetId: string | null;
  onSelect: (petId: string) => void;
  onAddPet: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bark-700/40" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-3xl bg-cream-50 p-5 pb-8 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-700 text-bark-700">My Pets</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full bg-cream-200 text-bark-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 space-y-1.5">
          {pets.map((p) => {
            const isSelected = p.id === selectedPetId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect(p.id)}
                className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left ${
                  isSelected ? "bg-violet-50" : "bg-transparent"
                }`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-xl">
                  {speciesEmoji[p.species.toUpperCase()] ?? "🐾"}
                </span>
                <span className="flex-1 truncate font-600 text-bark-700">{p.name}</span>
                {isSelected && <Check className="h-5 w-5 text-violet-600" />}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onAddPet}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-violet-100 py-3 text-sm font-600 text-violet-600"
        >
          <Plus className="h-4 w-4" /> Add another pet
        </button>
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
      {(date || note) && (
        <div className="text-right">
          {date && <p className="font-600 text-bark-700">{date}</p>}
          {note && <p className="text-emerald-500">{note}</p>}
        </div>
      )}
    </div>
  );
}
