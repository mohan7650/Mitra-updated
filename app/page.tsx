import Link from "next/link";
import { PawPrint, User, Heart, Leaf, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import FeatureStrip from "@/components/welcome/FeatureStrip";

const peekPets = ["🐶", "🐰", "🐱", "🐶", "🐹", "🦜", "🐹", "🐢"];

export default function WelcomePage() {
  return (
    <main className="min-h-screen paw-texture bg-gradient-to-b from-cream-100 to-cream-200">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-8 pt-12">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 text-forest-600">
          <Leaf className="h-4 w-4 -rotate-45" strokeWidth={2.5} />
          <span className="font-display text-lg font-600">Welcome to</span>
          <Leaf className="h-4 w-4 rotate-[135deg]" strokeWidth={2.5} />
        </div>

        {/* Hero wordmark with peeking pets */}
        <div className="mt-6 flex flex-col items-center">
          <div className="mb-1 flex gap-1 text-2xl">
            {peekPets.map((p, i) => (
              <span
                key={i}
                className="drop-shadow-sm"
                style={{ transform: `translateY(${i % 2 === 0 ? "4px" : "0"})` }}
              >
                {p}
              </span>
            ))}
          </div>
          <Logo variant="forest" size="xl" />
        </div>

        {/* Tagline */}
        <h1 className="mt-8 text-center font-display text-[26px] font-700 leading-tight">
          <span className="text-forest-600">Their world. </span>
          <span className="text-coral-500">Your love. </span>
          <span className="text-bark-700">Together.</span>
        </h1>

        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-forest-400/60" />
          <Heart className="h-4 w-4 fill-forest-500 text-forest-500" />
          <span className="h-px w-10 bg-forest-400/60" />
        </div>

        <p className="mt-4 text-center text-[15px] leading-relaxed text-bark-500">
          All the care, love and happiness your pet deserves,
          <br className="hidden sm:block" /> in one beautiful place.
        </p>

        {/* Primary actions */}
        <div className="mt-8 space-y-3">
          <Link
            href="/signup"
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-forest-600 font-display text-lg font-600 text-cream-50 shadow-card transition hover:bg-forest-700 active:scale-[0.99]"
          >
            <PawPrint className="h-5 w-5 fill-current" />
            Create Account
          </Link>
          <Link
            href="/signin"
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full border-2 border-forest-600 bg-transparent font-display text-lg font-600 text-forest-600 transition hover:bg-forest-600/5 active:scale-[0.99]"
          >
            <User className="h-5 w-5" />
            Sign In
          </Link>
        </div>

        <p className="mt-4 text-center text-sm text-bark-500">
          Already have an account?{" "}
          <Link href="/signin" className="font-700 text-forest-600 underline-offset-2 hover:underline">
            Sign in
          </Link>
        </p>

        {/* Feature strip */}
        <div className="mt-8">
          <FeatureStrip />
        </div>

        {/* Footer trust line */}
        <div className="mt-6 flex items-center justify-center gap-2 text-bark-500">
          <ShieldCheck className="h-4 w-4 text-forest-500" />
          <span className="text-sm">Trusted by pet parents everywhere.</span>
        </div>
      </div>
    </main>
  );
}
