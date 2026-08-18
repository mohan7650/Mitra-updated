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
import { breedsBySpecies, sizes, coatTypes, coatColors } from "@/lib/data";
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

function YesNo({ question, defaultYes }: { question: string; defaultYes: boolean }) {
  const [yes, setYes] = useState(defaultYes);
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
            onClick={() => setYes(o.val)}
            className={`flex-1 rounded-lg py-1.5 text-sm font-700 transition ${
              yes === o.val
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

/* ---- page ------------------------------------------------------------- */

export default function PetDetailsPage() {
  const router = useRouter();
  const { accessToken } = useAuth();

  const [species, setSpecies] = useState("dog");
  const [name, setName] = useState("");
  const breeds = breedsBySpecies[species] ?? breedsBySpecies.other;
  const [breed, setBreed] = useState(breeds[0]);
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "unknown">("male");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("mitra_pet_species");
    if (stored) {
      setSpecies(stored);
      setBreed((breedsBySpecies[stored] ?? breedsBySpecies.other)[0]);
    }
  }, []);

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
    setError(null);
    setSubmitting(true);
    try {
      await apiCreatePet(accessToken, {
        name: name.trim(),
        species: species.toUpperCase(),
        breed,
        gender: sex.toUpperCase(),
        dateOfBirth: dob || undefined,
        bio: notes || undefined,
      });
      sessionStorage.removeItem("mitra_pet_species");
      router.push("/home");
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
              Tell us about your {species}
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
              <Select value={breed} options={breeds} onChange={setBreed} />
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
                    defaultValue="18"
                    inputMode="decimal"
                    className="w-full bg-transparent px-2 py-3 text-[15px] text-bark-700 outline-none"
                  />
                </div>
                <div className="relative flex items-center rounded-xl bg-cream-100 ring-1 ring-cream-300">
                  <select className="appearance-none bg-transparent py-3 pl-3 pr-7 text-[15px] text-bark-700 outline-none">
                    <option>kg</option>
                    <option>lb</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-bark-500" />
                </div>
              </div>
            </Card>
            <Card>
              <Label>Size</Label>
              <Select icon={<Ruler className="h-4 w-4" />} value="Large (20 - 40 kg)" options={sizes} />
            </Card>
          </div>

          {/* Coat type + colour */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <Label>Coat Type</Label>
              <Select icon={<PawPrint className="h-4 w-4" />} value="Medium" options={coatTypes} />
            </Card>
            <Card>
              <Label>Coat Color</Label>
              <div className="relative flex items-center rounded-xl bg-cream-100 ring-1 ring-cream-300">
                <Palette className="ml-3 h-4 w-4 text-bark-500" />
                <span className="ml-2 h-4 w-4 rounded-full" style={{ background: coatColors[0].swatch }} />
                <select
                  defaultValue="Golden"
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

          {/* Good to know */}
          <div>
            <p className="mb-2 font-display font-600 text-forest-600">Good to know (optional)</p>
            <div className="grid grid-cols-2 gap-3">
              <YesNo question={`Is your ${species} microchipped?`} defaultYes />
              <YesNo question={`Is your ${species} vaccinated?`} defaultYes />
              <YesNo question={`Is your ${species} neutered?`} defaultYes={false} />
              <YesNo question={`Does your ${species} have allergies?`} defaultYes={false} />
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
