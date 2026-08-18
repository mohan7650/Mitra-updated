"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ChevronDown, HelpCircle, Scale, Ruler, Palette,
  PawPrint, StickyNote, Info, Calendar,
} from "lucide-react";
import Logo from "@/components/Logo";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/AuthContext";
import { apiGetPets, apiUpdatePet, ApiError, Pet } from "@/lib/api";
import {
  breedsBySpecies, sizes, coatTypes, coatColors,
  personalityTraitOptions, favoriteActivityOptions, favoriteTreatOptions,
  SelectOption,
} from "@/lib/data";

/* ---- small building blocks (mirrors onboarding/pet-details styling) --- */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-cream-50 p-4 shadow-soft ring-1 ring-cream-200">
      {children}
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 flex items-center gap-1 text-sm font-700 text-bark-700">
      {children}
      {required && <span className="text-coral-500">*</span>}
    </label>
  );
}

function Select({
  icon,
  value,
  options,
  onChange,
}: {
  icon?: React.ReactNode;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative flex items-center rounded-xl bg-cream-100 ring-1 ring-cream-300 focus-within:ring-forest-500">
      {icon && <span className="pl-3 text-bark-500">{icon}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none bg-transparent py-3 ${icon ? "pl-2" : "pl-3"} pr-8 text-[15px] text-bark-700 outline-none`}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-bark-500" />
    </div>
  );
}

function YesNo({
  question,
  value,
  onChange,
}: {
  question: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="rounded-2xl bg-cream-50 p-3 shadow-soft ring-1 ring-cream-200">
      <div className="mb-2 flex items-center gap-1 text-[13px] font-600 text-bark-600">
        {question}
        <Info className="h-3 w-3 text-bark-500/60" />
      </div>
      <div className="flex gap-1.5">
        {[
          { label: "Yes", val: true },
          { label: "No", val: false },
        ].map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => onChange(o.val)}
            className={`flex-1 rounded-lg py-1.5 text-sm font-700 transition ${
              value === o.val
                ? "bg-forest-400/20 text-forest-600 ring-1 ring-forest-500"
                : "text-bark-500 ring-1 ring-cream-300"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChipSelect({
  options,
  selected,
  onChange,
  max,
}: {
  options: SelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  max: number;
}) {
  const atMax = selected.length >= max;

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
      return;
    }
    if (atMax) return;
    onChange([...selected, value]);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o.value)}
              disabled={!on && atMax}
              className={`rounded-full px-3 py-1.5 text-sm font-600 transition ${
                on
                  ? "bg-forest-400/20 text-forest-600 ring-1 ring-forest-500"
                  : "text-bark-500 ring-1 ring-cream-300 disabled:opacity-40"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-bark-400">
        {selected.length}/{max} selected{atMax ? " — maximum reached" : ""}
      </p>
    </div>
  );
}

/* ---- page ------------------------------------------------------------- */

export default function EditProfilePage() {
  return (
    <ProtectedRoute>
      <EditProfilePageContent />
    </ProtectedRoute>
  );
}

function EditProfilePageContent() {
  const router = useRouter();
  const { accessToken } = useAuth();

  const [pet, setPet] = useState<Pet | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [customSpecies, setCustomSpecies] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState<"MALE" | "FEMALE" | "UNKNOWN">("UNKNOWN");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [size, setSize] = useState(sizes[0]);
  const [coatType, setCoatType] = useState(coatTypes[0]);
  const [coatColor, setCoatColor] = useState(coatColors[0].label);
  const [uniqueMarks, setUniqueMarks] = useState("");
  const [bio, setBio] = useState("");
  const [microchipped, setMicrochipped] = useState(false);
  const [vaccinated, setVaccinated] = useState(false);
  const [neutered, setNeutered] = useState(false);
  const [hasAllergies, setHasAllergies] = useState(false);
  const [personalityTraits, setPersonalityTraits] = useState<string[]>([]);
  const [favoriteActivities, setFavoriteActivities] = useState<string[]>([]);
  const [favoriteTreats, setFavoriteTreats] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    apiGetPets(accessToken)
      .then((pets) => {
        if (cancelled) return;
        if (pets.length === 0) {
          router.replace("/onboarding/pet-type");
          return;
        }
        const storedId = localStorage.getItem("mitra_selected_pet_id");
        const current = pets.find((p) => p.id === storedId) ?? pets[0];
        setPet(current);
        setName(current.name);
        setBreed(current.breed ?? "");
        setCustomSpecies(current.customSpecies ?? "");
        setDob(current.dateOfBirth ? current.dateOfBirth.slice(0, 10) : "");
        const gender = current.gender?.toUpperCase();
        setSex(gender === "MALE" || gender === "FEMALE" ? gender : "UNKNOWN");
        setWeight(current.weight != null ? String(current.weight) : "");
        setWeightUnit(current.weightUnit ?? "kg");
        setSize(current.size ?? sizes[0]);
        setCoatType(current.coatType ?? coatTypes[0]);
        setCoatColor(current.coatColor ?? coatColors[0].label);
        setUniqueMarks(current.uniqueMarks ?? "");
        setBio(current.bio ?? "");
        setMicrochipped(current.microchipped ?? false);
        setVaccinated(current.vaccinated ?? false);
        setNeutered(current.neutered ?? false);
        setHasAllergies(current.hasAllergies ?? false);
        setPersonalityTraits(current.personalityTraits ?? []);
        setFavoriteActivities(current.favoriteActivities ?? []);
        setFavoriteTreats(current.favoriteTreats ?? []);
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

  async function handleSave() {
    if (!accessToken || !pet) return;
    if (!name.trim()) {
      setError("Pet name cannot be empty.");
      return;
    }
    if (pet.species.toUpperCase() === "OTHER" && !customSpecies.trim()) {
      setError("Please enter what kind of pet it is.");
      return;
    }
    let parsedWeight: number | undefined;
    if (weight.trim()) {
      parsedWeight = parseFloat(weight);
      if (!Number.isFinite(parsedWeight)) {
        setError("Weight must be a number.");
        return;
      }
    }
    if (dob && Number.isNaN(new Date(dob).getTime())) {
      setError("Date of birth is not a valid date.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      await apiUpdatePet(accessToken, pet.id, {
        name: name.trim(),
        customSpecies: pet.species.toUpperCase() === "OTHER" ? customSpecies.trim() : undefined,
        breed: breed || undefined,
        gender: sex,
        dateOfBirth: dob || undefined,
        weight: parsedWeight,
        weightUnit,
        size,
        coatType,
        coatColor,
        uniqueMarks: uniqueMarks || undefined,
        bio: bio || undefined,
        microchipped,
        vaccinated,
        neutered,
        hasAllergies,
        personalityTraits,
        favoriteActivities,
        favoriteTreats,
      });
      router.push("/profile");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || !pet) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <p className="text-bark-500">Loading pet details…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream-100 px-6 text-center">
        <p className="text-bark-600">We couldn&rsquo;t load your pet&rsquo;s details right now.</p>
        <button type="button" onClick={() => router.push("/profile")} className="text-sm font-600 text-coral-500">
          Back to Profile
        </button>
      </div>
    );
  }

  const breeds = breedsBySpecies[pet.species.toLowerCase()] ?? breedsBySpecies.other;
  const breedOptions = breeds.includes(breed) || !breed ? breeds : [breed, ...breeds];

  const sexOptions = [
    { id: "MALE" as const, label: "Male", icon: <span className="text-base leading-none">♂</span> },
    { id: "FEMALE" as const, label: "Female", icon: <span className="text-base leading-none">♀</span> },
    { id: "UNKNOWN" as const, label: "Unknown", icon: <HelpCircle className="h-4 w-4" /> },
  ];

  return (
    <main className="min-h-screen paw-texture bg-gradient-to-b from-cream-100 to-cream-200">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-6 pt-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            aria-label="Cancel"
            className="grid h-9 w-9 place-items-center rounded-full text-bark-600 transition hover:bg-cream-50"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <Logo variant="forest" size="md" />
          <span className="w-9" />
        </div>

        <h1 className="mt-5 font-display text-2xl font-700 text-bark-700">Edit {pet.name}&rsquo;s Profile</h1>
        <p className="mt-1 text-sm text-bark-500">Update your pet&rsquo;s details below.</p>

        <div className="mt-6 space-y-4">
          <Card>
            <Label required>Pet Name</Label>
            <div className="flex items-center rounded-xl bg-cream-100 ring-1 ring-cream-300 focus-within:ring-forest-500">
              <PawPrint className="ml-3 h-4 w-4 text-bark-500" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent px-2 py-3 text-[15px] text-bark-700 outline-none"
                placeholder="Your pet's name"
              />
            </div>
          </Card>

          {pet.species.toUpperCase() === "OTHER" && (
            <Card>
              <Label required>What kind of pet is it?</Label>
              <div className="flex items-center rounded-xl bg-cream-100 ring-1 ring-cream-300 focus-within:ring-forest-500">
                <input
                  value={customSpecies}
                  onChange={(e) => setCustomSpecies(e.target.value)}
                  placeholder="e.g. Ferret, Fish, Horse, Goat"
                  className="w-full bg-transparent px-3 py-3 text-[15px] text-bark-700 outline-none"
                />
              </div>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <Label>Breed</Label>
              <Select value={breed || breedOptions[0]} options={breedOptions} onChange={setBreed} />
            </Card>
            <Card>
              <Label>Date of Birth</Label>
              <div className="flex items-center rounded-xl bg-cream-100 py-1 pl-3 pr-3 ring-1 ring-cream-300">
                <Calendar className="h-4 w-4 text-bark-500" />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="ml-2 w-full flex-1 bg-transparent py-2 text-[15px] text-bark-700 outline-none"
                />
              </div>
            </Card>
          </div>

          <Card>
            <Label>Sex</Label>
            <div className="grid grid-cols-3 gap-2">
              {sexOptions.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setSex(o.id)}
                  className={`flex items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-700 transition ${
                    sex === o.id
                      ? "bg-forest-400/15 text-forest-600 ring-1 ring-forest-500"
                      : "text-bark-500 ring-1 ring-cream-300"
                  }`}
                >
                  {o.icon}
                  {o.label}
                </button>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <Label>Current Weight</Label>
              <div className="flex gap-2">
                <div className="flex flex-1 items-center rounded-xl bg-cream-100 ring-1 ring-cream-300">
                  <Scale className="ml-2 h-4 w-4 text-bark-500" />
                  <input
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    inputMode="decimal"
                    className="w-full bg-transparent px-2 py-3 text-[15px] text-bark-700 outline-none"
                  />
                </div>
                <div className="relative flex items-center rounded-xl bg-cream-100 ring-1 ring-cream-300">
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value)}
                    className="appearance-none bg-transparent py-3 pl-3 pr-7 text-[15px] text-bark-700 outline-none"
                  >
                    <option>kg</option>
                    <option>lb</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-bark-500" />
                </div>
              </div>
            </Card>
            <Card>
              <Label>Size</Label>
              <Select icon={<Ruler className="h-4 w-4" />} value={size} options={sizes} onChange={setSize} />
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <Label>Coat Type</Label>
              <Select icon={<PawPrint className="h-4 w-4" />} value={coatType} options={coatTypes} onChange={setCoatType} />
            </Card>
            <Card>
              <Label>Coat Color</Label>
              <div className="relative flex items-center rounded-xl bg-cream-100 ring-1 ring-cream-300">
                <Palette className="ml-3 h-4 w-4 text-bark-500" />
                <span
                  className="ml-2 h-4 w-4 rounded-full"
                  style={{ background: coatColors.find((c) => c.label === coatColor)?.swatch ?? coatColors[0].swatch }}
                />
                <select
                  value={coatColor}
                  onChange={(e) => setCoatColor(e.target.value)}
                  className="w-full appearance-none bg-transparent py-3 pl-2 pr-8 text-[15px] text-bark-700 outline-none"
                >
                  {coatColors.map((c) => (
                    <option key={c.label}>{c.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-bark-500" />
              </div>
            </Card>
          </div>

          <Card>
            <Label>Any unique marks or notes?</Label>
            <div className="flex items-start rounded-xl bg-cream-100 ring-1 ring-cream-300 focus-within:ring-forest-500">
              <StickyNote className="ml-3 mt-3 h-4 w-4 text-bark-500" />
              <textarea
                value={uniqueMarks}
                maxLength={120}
                onChange={(e) => setUniqueMarks(e.target.value)}
                rows={1}
                className="w-full resize-none bg-transparent px-2 py-3 text-[15px] text-bark-700 outline-none"
              />
            </div>
            <div className="mt-1 text-right text-xs text-bark-500">{uniqueMarks.length}/120</div>
          </Card>

          <Card>
            <Label>Bio</Label>
            <div className="flex items-start rounded-xl bg-cream-100 ring-1 ring-cream-300 focus-within:ring-forest-500">
              <StickyNote className="ml-3 mt-3 h-4 w-4 text-bark-500" />
              <textarea
                value={bio}
                maxLength={200}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full resize-none bg-transparent px-2 py-3 text-[15px] text-bark-700 outline-none"
              />
            </div>
            <div className="mt-1 text-right text-xs text-bark-500">{bio.length}/200</div>
          </Card>

          <div>
            <p className="mb-2 font-display font-600 text-forest-600">Good to know</p>
            <div className="grid grid-cols-2 gap-3">
              <YesNo question={`Is your ${pet.species.toLowerCase()} microchipped?`} value={microchipped} onChange={setMicrochipped} />
              <YesNo question={`Is your ${pet.species.toLowerCase()} vaccinated?`} value={vaccinated} onChange={setVaccinated} />
              <YesNo question={`Is your ${pet.species.toLowerCase()} neutered?`} value={neutered} onChange={setNeutered} />
              <YesNo question={`Does your ${pet.species.toLowerCase()} have allergies?`} value={hasAllergies} onChange={setHasAllergies} />
            </div>
          </div>

          <Card>
            <Label>Personality Traits</Label>
            <ChipSelect options={personalityTraitOptions} selected={personalityTraits} onChange={setPersonalityTraits} max={5} />
          </Card>

          <Card>
            <Label>Favorite Activities</Label>
            <ChipSelect options={favoriteActivityOptions} selected={favoriteActivities} onChange={setFavoriteActivities} max={8} />
          </Card>

          <Card>
            <Label>Favorite Treats</Label>
            <ChipSelect options={favoriteTreatOptions} selected={favoriteTreats} onChange={setFavoriteTreats} max={8} />
          </Card>
        </div>

        {error && <p className="mt-4 text-center text-sm text-coral-500">{error}</p>}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="flex h-14 items-center justify-center rounded-full bg-cream-200 font-display text-lg font-600 text-bark-600 transition active:scale-[0.99]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex h-14 items-center justify-center rounded-full bg-forest-600 font-display text-lg font-600 text-cream-50 shadow-card transition hover:bg-forest-700 active:scale-[0.99] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}
