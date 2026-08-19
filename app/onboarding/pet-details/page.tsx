"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronDown,
  Calendar,
  PawPrint,
  Ruler,
  Scale,
  Palette,
  StickyNote,
  HelpCircle,
  Info,
  Heart,
} from "lucide-react";
import Logo from "@/components/Logo";
import ProgressBar from "@/components/onboarding/ProgressBar";
import {
  breedsBySpecies, sizes, coatTypes, coatColors,
  personalityTraitOptions, favoriteActivityOptions, favoriteTreatOptions,
  SelectOption,
} from "@/lib/data";
import { useAuth } from "@/lib/AuthContext";
import { apiCreatePet, ApiError } from "@/lib/api";

const speciesEmoji: Record<string, string> = {
  dog: "🐶",
  cat: "🐱",
  bird: "🦜",
  rabbit: "🐰",
  small: "🐹",
  reptile: "🐢",
  other: "🐾",
};

/* ---- small building blocks ------------------------------------------- */

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
  onChange?: (value: string) => void;
}) {
  return (
    <div className="relative flex items-center rounded-xl bg-cream-100 ring-1 ring-cream-300 focus-within:ring-forest-500">
      {icon && <span className="pl-3 text-bark-500">{icon}</span>}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
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

export default function PetDetailsPage() {
  const router = useRouter();
  const { accessToken } = useAuth();

  const [species, setSpecies] = useState("dog");
  const [customSpecies, setCustomSpecies] = useState("");
  const [name, setName] = useState("");
  const breeds = breedsBySpecies[species] ?? breedsBySpecies.other;
  const [breed, setBreed] = useState(breeds[0]);
  const [customBreed, setCustomBreed] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "unknown">("male");
  const [notes, setNotes] = useState("");
  const [weight, setWeight] = useState("18");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [size, setSize] = useState(sizes[0]);
  const [coatType, setCoatType] = useState(coatTypes[0]);
  const [coatColor, setCoatColor] = useState(coatColors[0].label);
  const [microchipped, setMicrochipped] = useState(true);
  const [vaccinated, setVaccinated] = useState(true);
  const [neutered, setNeutered] = useState(false);
  const [hasAllergies, setHasAllergies] = useState(false);
  const [personalityTraits, setPersonalityTraits] = useState<string[]>([]);
  const [favoriteActivities, setFavoriteActivities] = useState<string[]>([]);
  const [favoriteTreats, setFavoriteTreats] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("mitra_pet_species");
    if (stored) {
      setSpecies(stored);
      setBreed((breedsBySpecies[stored] ?? breedsBySpecies.other)[0]);
    }
    if (stored === "other") {
      setCustomSpecies(sessionStorage.getItem("mitra_pet_custom_species") ?? "");
    }
  }, []);

  const displaySpecies = species === "other" ? customSpecies.trim() || "pet" : species;
  const isOtherBreed = breed === "Other";

  function handleBreedChange(value: string) {
    setBreed(value);
    if (value !== "Other") setCustomBreed("");
  }

  const sexOptions = [
    { id: "male", label: "Male", icon: <span className="text-base leading-none">♂</span> },
    { id: "female", label: "Female", icon: <span className="text-base leading-none">♀</span> },
    { id: "unknown", label: "Unknown", icon: <HelpCircle className="h-4 w-4" /> },
  ] as const;

  async function handleSubmit() {
    if (!accessToken) {
      setError("You need to be signed in to create a pet profile.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your pet's name.");
      return;
    }
    if (isOtherBreed && !customBreed.trim()) {
      setError("Please enter your pet's breed.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const parsedWeight = parseFloat(weight);
      const created = await apiCreatePet(accessToken, {
        name: name.trim(),
        species: species.toUpperCase(),
        customSpecies: species === "other" ? customSpecies.trim() : undefined,
        breed: isOtherBreed ? customBreed.trim() : breed,
        gender: sex.toUpperCase(),
        dateOfBirth: dob || undefined,
        weight: Number.isFinite(parsedWeight) ? parsedWeight : undefined,
        weightUnit,
        size,
        coatType,
        coatColor,
        uniqueMarks: notes || undefined,
        microchipped,
        vaccinated,
        neutered,
        hasAllergies,
        personalityTraits,
        favoriteActivities,
        favoriteTreats,
      });
      sessionStorage.removeItem("mitra_pet_species");
      sessionStorage.removeItem("mitra_pet_custom_species");
      localStorage.setItem("mitra_selected_pet_id", created.id);
      router.push("/profile");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen paw-texture bg-gradient-to-b from-cream-100 to-cream-200">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-6 pt-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/onboarding/pet-type"
            aria-label="Go back"
            className="grid h-9 w-9 place-items-center rounded-full text-bark-600 transition hover:bg-cream-50"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Logo variant="forest" size="md" />
          <span className="font-display text-sm font-600 text-forest-600">Step 2 of 5</span>
        </div>

        <div className="mt-5 px-1">
          <ProgressBar current={2} />
        </div>

        {/* Heading with avatar */}
        <div className="mt-6 flex items-center gap-4">
          <div className="relative">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-5xl ring-4 ring-cream-50">
              {speciesEmoji[species] ?? speciesEmoji.other}
            </div>
            <span className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-forest-600 text-cream-50 ring-2 ring-cream-100">
              <Camera className="h-4 w-4" />
            </span>
          </div>
          <div>
            <h1 className="inline-flex items-start gap-1 font-display text-2xl font-700 leading-tight text-bark-700">
              Tell us about your {displaySpecies}
              <Heart className="mt-1 h-3.5 w-3.5 fill-forest-500 text-forest-500" />
            </h1>
            <p className="mt-1 text-sm text-bark-500">
              Add a few details to create their profile.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="mt-6 space-y-4">
          {/* Pet name */}
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
              {name.trim() && <CheckCircle2 className="mr-3 h-5 w-5 fill-forest-600 text-cream-50" />}
            </div>
          </Card>

          {/* Breed + DOB */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <Label required>Breed</Label>
              <Select value={breed} options={breeds} onChange={handleBreedChange} />
              {isOtherBreed && (
                <div className="mt-3">
                  <Label required>Enter breed</Label>
                  <div className="flex items-center rounded-xl bg-cream-100 ring-1 ring-cream-300 focus-within:ring-forest-500">
                    <input
                      value={customBreed}
                      onChange={(e) => setCustomBreed(e.target.value)}
                      placeholder="Type your pet's breed"
                      className="w-full bg-transparent px-3 py-3 text-[15px] text-bark-700 outline-none"
                    />
                  </div>
                </div>
              )}
            </Card>
            <Card>
              <Label required>Date of Birth</Label>
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

          <label className="flex items-center gap-2.5 rounded-2xl bg-cream-50 px-4 py-3 text-sm text-bark-600 shadow-soft ring-1 ring-cream-200">
            <input type="checkbox" className="h-4 w-4 accent-forest-600" />
            I don&rsquo;t know the exact date of birth
          </label>

          {/* Sex */}
          <Card>
            <Label required>Sex</Label>
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

          {/* Weight + Size */}
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

          {/* Coat type + colour */}
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

          {/* Notes */}
          <Card>
            <Label>Any unique marks or notes?</Label>
            <div className="flex items-start rounded-xl bg-cream-100 ring-1 ring-cream-300 focus-within:ring-forest-500">
              <StickyNote className="ml-3 mt-3 h-4 w-4 text-bark-500" />
              <textarea
                value={notes}
                maxLength={120}
                onChange={(e) => setNotes(e.target.value)}
                rows={1}
                className="w-full resize-none bg-transparent px-2 py-3 text-[15px] text-bark-700 outline-none"
              />
            </div>
            <div className="mt-1 text-right text-xs text-bark-500">{notes.length}/120</div>
          </Card>

          {/* Personality / activities / treats */}
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

          {/* Good to know */}
          <div>
            <p className="mb-2 font-display font-600 text-forest-600">Good to know (optional)</p>
            <div className="grid grid-cols-2 gap-3">
              <YesNo question={`Is your ${displaySpecies} microchipped?`} value={microchipped} onChange={setMicrochipped} />
              <YesNo question={`Is your ${displaySpecies} vaccinated?`} value={vaccinated} onChange={setVaccinated} />
              <YesNo question={`Is your ${displaySpecies} neutered?`} value={neutered} onChange={setNeutered} />
              <YesNo question={`Does your ${displaySpecies} have allergies?`} value={hasAllergies} onChange={setHasAllergies} />
            </div>
          </div>
        </div>

        {error && <p className="mt-4 text-center text-sm text-coral-500">{error}</p>}

        {/* Next */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-forest-600 font-display text-lg font-600 text-cream-50 shadow-card transition hover:bg-forest-700 active:scale-[0.99] disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Next"}
          <ArrowRight className="h-5 w-5" />
        </button>
        <p className="mt-3 flex items-center justify-center gap-1 text-sm text-bark-500">
          You can always update these details later.
          <Heart className="h-3.5 w-3.5 fill-forest-500 text-forest-500" />
        </p>
      </div>
    </main>
  );
}
