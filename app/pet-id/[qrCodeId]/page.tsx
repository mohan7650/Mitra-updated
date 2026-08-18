"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PawPrint, ShieldAlert } from "lucide-react";
import { apiGetPublicPetByQr, PublicPetSafetyInfo } from "@/lib/api";

const speciesEmoji: Record<string, string> = {
  DOG: "🐶",
  CAT: "🐱",
  BIRD: "🦜",
  RABBIT: "🐰",
  SMALL: "🐹",
};

export default function PublicPetSafetyPage() {
  const params = useParams<{ qrCodeId: string }>();
  const qrCodeId = params.qrCodeId;

  const [pet, setPet] = useState<PublicPetSafetyInfo | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found" | "error">("loading");

  useEffect(() => {
    if (!qrCodeId) return;
    let cancelled = false;

    apiGetPublicPetByQr(qrCodeId)
      .then((result) => {
        if (cancelled) return;
        if (!result) {
          setStatus("not-found");
          return;
        }
        setPet(result);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [qrCodeId]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <p className="text-bark-500">Loading…</p>
      </div>
    );
  }

  if (status === "not-found" || status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream-100 px-6 text-center">
        <ShieldAlert className="h-10 w-10 text-bark-400" />
        <p className="font-display text-xl font-700 text-bark-700">Pet ID not found</p>
        <p className="text-sm text-bark-500">This QR code doesn&rsquo;t match a Mitra pet.</p>
      </div>
    );
  }

  if (!pet) return null;

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-10 pt-8">
        <div className="flex items-center justify-center gap-2">
          <PawPrint className="h-5 w-5 text-coral-500" />
          <span className="font-display text-lg font-700 text-bark-700">Mitra Pet Safety</span>
        </div>

        <div className="mt-6 flex flex-col items-center">
          {pet.profilePhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pet.profilePhotoUrl}
              alt={pet.petName}
              className="h-32 w-32 rounded-full object-cover ring-4 ring-cream-50 shadow-soft"
            />
          ) : (
            <div className="grid h-32 w-32 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-6xl ring-4 ring-cream-50 shadow-soft">
              {speciesEmoji[pet.species.toUpperCase()] ?? "🐾"}
            </div>
          )}
          <h1 className="mt-3 font-display text-2xl font-700 text-bark-700">{pet.petName}</h1>
          <p className="text-sm text-bark-500">{pet.breed ?? pet.species}</p>
        </div>

        <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-center shadow-soft ring-1 ring-amber-100">
          <p className="text-sm font-600 text-amber-700">
            If you found this pet, please use the safety information below.
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-cream-50 p-4 shadow-soft ring-1 ring-cream-200">
          <h2 className="font-display text-base font-700 text-bark-700">Emergency Notes</h2>
          <p className="mt-2 text-sm text-bark-600">
            {pet.emergencyNotes || "No emergency notes have been added for this pet."}
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-bark-400">Mitra Pet ID: {pet.qrCodeId}</p>
      </div>
    </div>
  );
}
