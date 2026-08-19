"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, PawPrint, Send } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/AuthContext";
import {
  apiGetCommunityPet,
  apiGetPets,
  apiGetPetConnections,
  apiCreatePetConnection,
  ApiError,
  CommunityPetResult,
  Pet,
} from "@/lib/api";

const speciesEmoji: Record<string, string> = {
  DOG: "🐶",
  CAT: "🐱",
  BIRD: "🦜",
  RABBIT: "🐰",
  SMALL: "🐹",
  REPTILE: "🐢",
};

export default function CommunityPetProfilePage() {
  return (
    <ProtectedRoute>
      <CommunityPetProfileContent />
    </ProtectedRoute>
  );
}

function CommunityPetProfileContent() {
  const params = useParams<{ petId: string }>();
  const petId = params.petId;
  const router = useRouter();
  const { accessToken } = useAuth();

  const [pet, setPet] = useState<CommunityPetResult | null>(null);
  const [myPet, setMyPet] = useState<Pet | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found" | "error">("loading");
  const [connectState, setConnectState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (!accessToken || !petId) return;
    let cancelled = false;

    Promise.all([apiGetCommunityPet(accessToken, petId), apiGetPets(accessToken)])
      .then(async ([publicPet, pets]) => {
        if (cancelled) return;
        const storedId = localStorage.getItem("mitra_selected_pet_id");
        const currentPet = pets.find((p) => p.id === storedId) ?? pets[0] ?? null;
        setPet(publicPet);
        setMyPet(currentPet);

        if (currentPet) {
          const connections = await apiGetPetConnections(accessToken, currentPet.id);
          const alreadyConnected = connections.some(
            (c) =>
              (c.requesterId === currentPet.id && c.receiverId === petId) ||
              (c.receiverId === currentPet.id && c.requesterId === petId),
          );
          if (!cancelled && alreadyConnected) setConnectState("sent");
        }
        if (!cancelled) setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setStatus("not-found");
        } else {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, petId]);

  async function handleConnect() {
    if (!accessToken || !myPet || !pet) return;
    setConnectState("sending");
    try {
      await apiCreatePetConnection(accessToken, myPet.id, pet.id);
      setConnectState("sent");
    } catch (err) {
      setConnectState("error");
      if (!(err instanceof ApiError)) console.error(err);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <p className="text-bark-500">Loading…</p>
      </div>
    );
  }

  if (status === "not-found" || status === "error" || !pet) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream-100 px-6 text-center">
        <p className="text-bark-600">We couldn&rsquo;t find that pet.</p>
        <button onClick={() => router.push("/community")} className="text-sm font-600 text-coral-500">
          Back to Community
        </button>
      </div>
    );
  }

  const canConnect = myPet && myPet.id !== pet.id;

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-10 pt-6">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="grid h-10 w-10 place-items-center rounded-full bg-cream-50 text-bark-600 shadow-soft"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="mt-6 flex flex-col items-center">
          {pet.profilePhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pet.profilePhotoUrl}
              alt={pet.name}
              className="h-32 w-32 rounded-full object-cover ring-4 ring-cream-50 shadow-soft"
            />
          ) : (
            <div className="grid h-32 w-32 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-6xl ring-4 ring-cream-50 shadow-soft">
              {speciesEmoji[pet.species.toUpperCase()] ?? "🐾"}
            </div>
          )}
          <h1 className="mt-3 font-display text-2xl font-700 text-bark-700">{pet.name}</h1>
          <p className="text-sm text-bark-500">{pet.breed ?? pet.customSpecies ?? pet.species}</p>
          {pet.personalityTraits.length > 0 && (
            <p className="mt-1 text-xs text-bark-400">{pet.personalityTraits.join(" • ")}</p>
          )}
        </div>

        {pet.bio && (
          <div className="mt-6 rounded-2xl bg-cream-50 p-4 shadow-soft ring-1 ring-cream-200">
            <h2 className="flex items-center gap-2 font-display text-base font-700 text-bark-700">
              <PawPrint className="h-4 w-4 text-coral-500" /> About
            </h2>
            <p className="mt-2 text-sm text-bark-600">{pet.bio}</p>
          </div>
        )}

        {canConnect && (
          <button
            type="button"
            onClick={handleConnect}
            disabled={connectState === "sending" || connectState === "sent"}
            className="mt-6 flex items-center justify-center gap-2 rounded-full bg-coral-500 px-4 py-3 text-sm font-700 text-white shadow-soft disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {connectState === "sent"
              ? "Paw Request Sent"
              : connectState === "sending"
                ? "Sending…"
                : "Send Paw Request"}
          </button>
        )}
        {connectState === "error" && (
          <p className="mt-2 text-center text-xs text-bark-500">Couldn&rsquo;t send the request. Try again.</p>
        )}
      </div>
    </div>
  );
}
