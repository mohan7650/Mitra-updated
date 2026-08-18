"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, PawPrint } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/AuthContext";
import { ApiError } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register({ firstName, lastName, email, password });
      router.push("/onboarding/pet-type");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen paw-texture bg-gradient-to-b from-cream-100 to-cream-200">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-8 pt-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Go back"
            className="grid h-9 w-9 place-items-center rounded-full text-bark-600 transition hover:bg-cream-50"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Logo variant="forest" size="md" />
          <span className="h-9 w-9" />
        </div>

        <div className="mt-8 text-center">
          <h1 className="font-display text-3xl font-700 text-bark-700">
            Create your Mitra account
          </h1>
          <p className="mt-2 text-[15px] text-bark-500">
            Join a world made for you and your pet.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="h-14 w-full rounded-2xl bg-cream-50 px-4 text-[15px] text-bark-700 shadow-soft ring-1 ring-cream-300 outline-none focus:ring-2 focus:ring-forest-600"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="h-14 w-full rounded-2xl bg-cream-50 px-4 text-[15px] text-bark-700 shadow-soft ring-1 ring-cream-300 outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-14 w-full rounded-2xl bg-cream-50 px-4 text-[15px] text-bark-700 shadow-soft ring-1 ring-cream-300 outline-none focus:ring-2 focus:ring-forest-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="h-14 w-full rounded-2xl bg-cream-50 px-4 text-[15px] text-bark-700 shadow-soft ring-1 ring-cream-300 outline-none focus:ring-2 focus:ring-forest-600"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="h-14 w-full rounded-2xl bg-cream-50 px-4 text-[15px] text-bark-700 shadow-soft ring-1 ring-cream-300 outline-none focus:ring-2 focus:ring-forest-600"
          />

          {error && <p className="text-center text-sm text-coral-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-forest-600 font-display text-lg font-600 text-cream-50 shadow-card transition hover:bg-forest-700 active:scale-[0.99] disabled:opacity-60"
          >
            <PawPrint className="h-5 w-5 fill-current" />
            {submitting ? "Creating…" : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-bark-500">
          Already have an account?{" "}
          <Link href="/signin" className="font-700 text-forest-600 underline-offset-2 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
