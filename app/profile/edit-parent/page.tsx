"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone } from "lucide-react";
import Logo from "@/components/Logo";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/AuthContext";
import { apiUpdateMe, ApiError } from "@/lib/api";

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

export default function EditParentPage() {
  return (
    <ProtectedRoute>
      <EditParentPageContent />
    </ProtectedRoute>
  );
}

function EditParentPageContent() {
  const router = useRouter();
  const { accessToken, user, setUser } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setPhone(user.phone ?? "");
  }, [user]);

  async function handleSave() {
    if (!accessToken) return;
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name cannot be empty.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const updated = await apiUpdateMe(accessToken, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
      });
      setUser(updated);
      router.push("/profile");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <p className="text-bark-500">Loading…</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen paw-texture bg-gradient-to-b from-cream-100 to-cream-200">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-6 pt-10">
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

        <h1 className="mt-5 font-display text-2xl font-700 text-bark-700">Edit Pet Parent</h1>
        <p className="mt-1 text-sm text-bark-500">Update your contact details below.</p>

        <div className="mt-6 space-y-4">
          <Card>
            <Label required>First Name</Label>
            <div className="flex items-center rounded-xl bg-cream-100 ring-1 ring-cream-300 focus-within:ring-forest-500">
              <User className="ml-3 h-4 w-4 text-bark-500" />
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-transparent px-2 py-3 text-[15px] text-bark-700 outline-none"
                placeholder="First name"
              />
            </div>
          </Card>

          <Card>
            <Label required>Last Name</Label>
            <div className="flex items-center rounded-xl bg-cream-100 ring-1 ring-cream-300 focus-within:ring-forest-500">
              <User className="ml-3 h-4 w-4 text-bark-500" />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-transparent px-2 py-3 text-[15px] text-bark-700 outline-none"
                placeholder="Last name"
              />
            </div>
          </Card>

          <Card>
            <Label>Phone</Label>
            <div className="flex items-center rounded-xl bg-cream-100 ring-1 ring-cream-300 focus-within:ring-forest-500">
              <Phone className="ml-3 h-4 w-4 text-bark-500" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent px-2 py-3 text-[15px] text-bark-700 outline-none"
                placeholder="Phone number"
              />
            </div>
          </Card>

          <Card>
            <Label>Email</Label>
            <div className="flex items-center rounded-xl bg-cream-200 ring-1 ring-cream-300">
              <Mail className="ml-3 h-4 w-4 text-bark-400" />
              <input
                value={user.email}
                disabled
                className="w-full bg-transparent px-2 py-3 text-[15px] text-bark-400 outline-none"
              />
            </div>
            <p className="mt-1.5 text-xs text-bark-400">Email can&rsquo;t be changed here.</p>
          </Card>
        </div>

        {error && <p className="mt-4 text-sm text-coral-500">{error}</p>}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full rounded-xl bg-forest-500 py-3.5 text-center text-[15px] font-700 text-white shadow-soft transition hover:bg-forest-600 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </main>
  );
}
