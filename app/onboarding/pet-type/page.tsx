"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, PawPrint, ShieldCheck, Heart } from "lucide-react";
import Logo from "@/components/Logo";
import ProgressBar from "@/components/onboarding/ProgressBar";
import PetTypeCard from "@/components/onboarding/PetTypeCard";
import { petTypes } from "@/lib/data";

export default function PetTypePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("dog");
  const [customSpecies, setCustomSpecies] = useState("");

  const isOther = selected === "other";
  const trimmedCustomSpecies = customSpecies.trim();
  const canProceed = !isOther || trimmedCustomSpecies.length > 0;

  function selectType(id: string) {
    setSelected(id);
    if (id !== "other") setCustomSpecies("");
  }

  function handleNext() {
    if (!canProceed) return;
    sessionStorage.setItem("mitra_pet_species", selected);
    if (isOther) {
      sessionStorage.setItem("mitra_pet_custom_species", trimmedCustomSpecies);
    } else {
      sessionStorage.removeItem("mitra_pet_custom_species");
    }
    router.push("/onboarding/pet-details");
  }

  return (
    <main className="min-h-screen paw-texture bg-gradient-to-b from-cream-100 to-cream-200">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-6 pt-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Go back"
            className="grid h-9 w-9 place-items-center rounded-full text-bark-600 transition hover:bg-cream-50"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Logo variant="forest" size="md" />
          <Link href="/home" className="font-display text-base font-600 text-forest-600">
            Skip
          </Link>
        </div>

        {/* Progress */}
        <div className="mt-6 px-1">
          <ProgressBar current={1} />
        </div>

        {/* Heading */}
        <div className="mt-8 text-center">
          <h1 className="inline-flex items-start gap-1 font-display text-3xl font-700 text-bark-700">
            Let&rsquo;s add your pet
            <Heart className="mt-1 h-4 w-4 fill-forest-500 text-forest-500" />
          </h1>
          <p className="mt-2 text-[15px] text-bark-500">
            Who are we adding to your Mitra family?
          </p>
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {petTypes.map((pet) => (
            <PetTypeCard
              key={pet.id}
              pet={pet}
              selected={selected === pet.id}
              onSelect={selectType}
            />
          ))}
        </div>

        {/* Other */}
        <button
          type="button"
          onClick={() => selectType("other")}
          aria-pressed={isOther}
          className={`mt-3 flex w-full items-center justify-center gap-3 rounded-3xl bg-cream-50 py-4 shadow-soft transition ${
            isOther ? "ring-2 ring-forest-600" : "ring-1 ring-cream-300"
          }`}
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-cream-200 text-bark-500">
            <PawPrint className="h-5 w-5 fill-current" />
          </span>
          <span className="font-display text-lg font-600 text-bark-600">Other</span>
        </button>

        {isOther && (
          <div className="mt-3 rounded-2xl bg-cream-50 p-4 shadow-soft ring-1 ring-cream-200">
            <label className="mb-2 block text-sm font-700 text-bark-700">
              What kind of pet is it?
            </label>
            <input
              value={customSpecies}
              onChange={(e) => setCustomSpecies(e.target.value)}
              placeholder="e.g. Ferret, Fish, Horse, Goat"
              className="w-full rounded-xl bg-cream-100 px-3 py-3 text-[15px] text-bark-700 outline-none ring-1 ring-cream-300 focus:ring-forest-500"
            />
          </div>
        )}

        {/* Privacy note */}
        <div className="mt-6 rounded-3xl bg-forest-400/10 px-5 py-4 text-center">
          <div className="flex items-center justify-center gap-2 text-forest-600">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-display font-600">We care about your pet&rsquo;s privacy</span>
          </div>
          <p className="mt-1 text-sm text-bark-500">
            Your pet&rsquo;s information is safe and secure with us.
          </p>
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-4 rounded-full bg-forest-600" />
            <span className="h-1.5 w-1.5 rounded-full bg-forest-400/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-forest-400/50" />
          </div>
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className="mt-6 flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-forest-600 font-display text-lg font-600 text-cream-50 shadow-card transition hover:bg-forest-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Next
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </main>
  );
}
