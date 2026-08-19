"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell } from "lucide-react";
import Logo from "@/components/Logo";
import StoryRail from "@/components/home/StoryRail";
import PawMomentCard from "@/components/feed/PawMomentCard";
import BottomNav from "@/components/home/BottomNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/AuthContext";
import {
  apiGetPets,
  apiGetPostsFeed,
  apiGetPetConnections,
  ApiError,
  Pet,
  CommunityPost,
  PetConnection,
} from "@/lib/api";
import { computeConnectionState } from "@/lib/connectionState";

const petEmoji: Record<string, string> = {
  DOG: "🐶",
  CAT: "🐱",
  BIRD: "🦜",
  RABBIT: "🐰",
  SMALL: "🐹",
  REPTILE: "🐢",
};

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  );
}

function HomePageContent() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [pets, setPets] = useState<Pet[] | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [posts, setPosts] = useState<CommunityPost[] | null>(null);
  const [connections, setConnections] = useState<PetConnection[]>([]);
  const [feedError, setFeedError] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    apiGetPets(accessToken)
      .then(async (fetched) => {
        if (cancelled) return;
        if (fetched.length === 0) {
          router.replace("/onboarding/pet-type");
          return;
        }
        setPets(fetched);
        const storedId = localStorage.getItem("mitra_selected_pet_id");
        const currentPet = fetched.find((p) => p.id === storedId) ?? fetched[0];
        setSelectedPetId(currentPet.id);

        const [feed, petConnections] = await Promise.all([
          apiGetPostsFeed(accessToken, currentPet.id),
          apiGetPetConnections(accessToken, currentPet.id),
        ]);
        if (cancelled) return;
        setPosts(feed);
        setConnections(petConnections);
      })
      .catch((err) => {
        if (cancelled) return;
        setPets([]);
        setPosts([]);
        setFeedError(true);
        if (!(err instanceof ApiError)) console.error(err);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, router]);

  const ownPetIds = useMemo(() => new Set((pets ?? []).map((p) => p.id)), [pets]);

  function updatePost(postId: string, patch: Partial<CommunityPost>) {
    setPosts((prev) => (prev ? prev.map((p) => (p.id === postId ? { ...p, ...patch } : p)) : prev));
  }

  function addRepost(newPost: CommunityPost) {
    setPosts((prev) => (prev ? [newPost, ...prev] : prev));
  }

  function markConnectionRequested(receiverPetId: string) {
    if (!selectedPetId) return;
    setConnections((prev) => [
      ...prev,
      {
        id: `pending-${receiverPetId}`,
        requesterId: selectedPetId,
        receiverId: receiverPetId,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  const primaryPet = pets?.[0];

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-cream-100/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 pb-2 pt-4">
            <button
              aria-label="Menu"
              className="grid h-10 w-10 place-items-center rounded-full bg-cream-50 text-bark-600 shadow-soft"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center leading-none">
              <Logo variant="dark" size="md" />
              <span className="mt-1 text-xs text-bark-500">A world for pets 🐾</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                aria-label="Search"
                className="grid h-10 w-10 place-items-center rounded-full bg-cream-50 text-bark-600 shadow-soft"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                aria-label="Notifications"
                className="relative grid h-10 w-10 place-items-center rounded-full bg-cream-50 text-bark-600 shadow-soft"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-coral-500 text-[10px] font-700 text-white ring-2 ring-cream-100">
                  3
                </span>
              </button>
              <span
                title={primaryPet?.name}
                className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-xl ring-2 ring-coral-400"
              >
                {primaryPet ? petEmoji[primaryPet.species] ?? "🐾" : "🐾"}
              </span>
            </div>
          </div>

          <StoryRail />
        </header>

        {/* Feed */}
        <main className="flex-1 space-y-5 px-4 pb-28 pt-3">
          {posts === null ? (
            <p className="py-10 text-center text-sm text-bark-500">Loading Paw Moments…</p>
          ) : posts.length === 0 ? (
            <p className="py-10 text-center text-sm text-bark-500">
              {feedError
                ? "We couldn't load the feed right now."
                : "No Paw Moments yet — share the first one 🐾"}
            </p>
          ) : (
            posts.map((post) =>
              accessToken && selectedPetId ? (
                <PawMomentCard
                  key={post.id}
                  post={post}
                  accessToken={accessToken}
                  selectedPetId={selectedPetId}
                  connectionState={computeConnectionState(post.pet.id, selectedPetId, ownPetIds, connections)}
                  onPostUpdate={updatePost}
                  onRepostCreated={addRepost}
                  onConnectionRequested={markConnectionRequested}
                />
              ) : null,
            )
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
