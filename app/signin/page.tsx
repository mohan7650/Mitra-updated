"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/AuthContext";
import { ApiError } from "@/lib/api";

export default function SigninPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/home");
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
            Welcome back to Mitra
          </h1>
          <p className="mt-2 text-[15px] text-bark-500">
            Sign in to continue caring for your pet.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
            className="h-14 w-full rounded-2xl bg-cream-50 px-4 text-[15px] text-bark-700 shadow-soft ring-1 ring-cream-300 outline-none focus:ring-2 focus:ring-forest-600"
          />

          {error && <p className="text-center text-sm text-coral-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-forest-600 font-display text-lg font-600 text-cream-50 shadow-card transition hover:bg-forest-700 active:scale-[0.99] disabled:opacity-60"
          >
            <User className="h-5 w-5" />
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-bark-500">
          <Link href="/forgot-password" className="hover:underline">
            Forgot password?
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-bark-500">
          Don&rsquo;t have an account?{" "}
          <Link href="/signup" className="font-700 text-forest-600 underline-offset-2 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}
