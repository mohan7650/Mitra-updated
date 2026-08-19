"use client";

import { useEffect, useState } from "react";
import {
  UserPlus, Bell, Search, SlidersHorizontal, ChevronRight,
  Check, X, Calendar, MapPin, PawPrint, Send, Compass,
} from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/home/BottomNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/AuthContext";
import { communityShortcuts, meetups } from "@/lib/data";
import {
  apiGetPets,
  apiGetPostsFeed,
  apiCreatePetPost,
  apiGetPetConnections,
  apiUpdateConnectionStatus,
  apiSearchCommunityPets,
  ApiError,
  Pet,
  CommunityPost,
  PetConnection,
  CommunityPetResult,
} from "@/lib/api";

const speciesEmoji: Record<string, string> = {
  DOG: "🐶",
  CAT: "🐱",
  BIRD: "🦜",
  RABBIT: "🐰",
  SMALL: "🐹",
  REPTILE: "🐢",
};

function formatTimeAgo(dateStr: string): string {
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommunityPage() {
  return (
    <ProtectedRoute>
      <CommunityPageContent />
    </ProtectedRoute>
  );
}

function CommunityPageContent() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [pet, setPet] = useState<Pet | null>(null);
  const [posts, setPosts] = useState<CommunityPost[] | null>(null);
  const [connections, setConnections] = useState<PetConnection[] | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [caption, setCaption] = useState("");
  const [posting, setPosting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CommunityPetResult[] | null>(null);
  const [searchStatus, setSearchStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  async function loadCommunity(token: string, currentPet: Pet) {
    const [feed, petConnections] = await Promise.all([
      apiGetPostsFeed(token),
      apiGetPetConnections(token, currentPet.id),
    ]);
    setPosts(feed);
    setConnections(petConnections);
  }

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    apiGetPets(accessToken)
      .then(async (pets) => {
        if (cancelled) return;
        if (pets.length === 0) {
          router.replace("/onboarding/pet-type");
          return;
        }
        const storedId = localStorage.getItem("mitra_selected_pet_id");
        const currentPet = pets.find((p) => p.id === storedId) ?? pets[0];
        setPet(currentPet);
        await loadCommunity(accessToken, currentPet);
        if (cancelled) return;
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        if (!(err instanceof ApiError)) console.error(err);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, router]);

  useEffect(() => {
    if (!accessToken) return;
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults(null);
      setSearchStatus("idle");
      return;
    }

    setSearchStatus("loading");
    let cancelled = false;
    const timer = setTimeout(() => {
      apiSearchCommunityPets(accessToken, trimmed)
        .then((results) => {
          if (cancelled) return;
          setSearchResults(results);
          setSearchStatus("ready");
        })
        .catch((err) => {
          if (cancelled) return;
          setSearchStatus("error");
          if (!(err instanceof ApiError)) console.error(err);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [accessToken, searchQuery]);

  async function handleCreatePost() {
    if (!accessToken || !pet || !caption.trim()) return;
    setPosting(true);
    try {
      await apiCreatePetPost(accessToken, pet.id, caption.trim());
      setCaption("");
      await loadCommunity(accessToken, pet);
    } catch (err) {
      if (!(err instanceof ApiError)) console.error(err);
    } finally {
      setPosting(false);
    }
  }

  async function handleConnectionResponse(connectionId: string, response: "ACCEPTED" | "REJECTED") {
    if (!accessToken || !pet) return;
    try {
      await apiUpdateConnectionStatus(accessToken, connectionId, response);
      const petConnections = await apiGetPetConnections(accessToken, pet.id);
      setConnections(petConnections);
    } catch (err) {
      if (!(err instanceof ApiError)) console.error(err);
    }
  }

  if (status === "loading" || !pet || !posts || !connections) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-100">
        <p className="text-bark-500">Loading community…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream-100 px-6 text-center">
        <p className="text-bark-600">We couldn&rsquo;t load the community right now.</p>
      </div>
    );
  }

  const pendingIncoming = connections.filter((c) => c.status === "PENDING" && c.receiverId === pet.id);

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        {/* Header */}
        <header className="px-4 pt-5">
          <div className="flex items-center justify-between">
            <button aria-label="Add friend" className="grid h-11 w-11 place-items-center rounded-full bg-cream-50 text-bark-600 shadow-soft">
              <UserPlus className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-3xl font-700 text-bark-700">Community</h1>
                <span className="text-lg text-coral-500">🐾</span>
              </div>
              <p className="text-xs text-bark-500">Find your pack. Build bonds. ❤️</p>
            </div>
            <div className="flex items-center gap-1">
              <button aria-label="Notifications" className="relative grid h-11 w-11 place-items-center rounded-full bg-cream-50 text-bark-600 shadow-soft">
                <Bell className="h-5 w-5" />
                {pendingIncoming.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-coral-500 text-[10px] font-700 text-white ring-2 ring-cream-100">
                    {pendingIncoming.length}
                  </span>
                )}
              </button>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-lg ring-2 ring-coral-400">
                {speciesEmoji[pet.species.toUpperCase()] ?? "🐾"}
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 flex items-center gap-2 rounded-full bg-cream-50 px-4 py-3 shadow-soft ring-1 ring-cream-200">
            <Search className="h-5 w-5 text-bark-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pets, breeds or locations"
              className="w-full bg-transparent text-sm text-bark-700 outline-none placeholder:text-bark-400"
            />
            <SlidersHorizontal className="h-5 w-5 text-bark-400" />
          </div>

          {searchStatus !== "idle" && (
            <div className="mt-3 rounded-2xl bg-cream-50 p-3 shadow-soft ring-1 ring-cream-200">
              {searchStatus === "loading" && (
                <p className="px-1 py-2 text-sm text-bark-500">Searching…</p>
              )}
              {searchStatus === "error" && (
                <p className="px-1 py-2 text-sm text-bark-500">Something went wrong. Try again.</p>
              )}
              {searchStatus === "ready" && searchResults && searchResults.length === 0 && (
                <p className="px-1 py-2 text-sm text-bark-500">No matching pets found</p>
              )}
              {searchStatus === "ready" && searchResults && searchResults.length > 0 && (
                <ul className="divide-y divide-cream-200">
                  {searchResults.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => router.push(`/community/pets/${r.id}`)}
                        className="flex w-full items-center gap-3 py-2 text-left"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-xl">
                          {r.profilePhotoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={r.profilePhotoUrl} alt={r.name} className="h-full w-full object-cover" />
                          ) : (
                            speciesEmoji[r.species.toUpperCase()] ?? "🐾"
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-700 text-bark-700">{r.name}</p>
                          <p className="truncate text-[11px] text-bark-500">{r.breed ?? r.customSpecies ?? r.species}</p>
                          {r.personalityTraits.length > 0 && (
                            <p className="truncate text-[11px] text-bark-400">{r.personalityTraits.join(" • ")}</p>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </header>

        <main className="flex-1 pb-28">
          {/* Shortcuts */}
          <div className="mt-4 grid grid-cols-3 gap-3 px-4">
            {communityShortcuts.map((s) => (
              <button key={s.id} className={`flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-br ${s.bg} p-3 shadow-soft`}>
                <span className="text-3xl">{s.emoji}</span>
                <span className="text-center text-xs font-700 text-bark-700">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Paw Moments (real PetPost feed) */}
          <SectionHead icon={<PawPrint className="h-5 w-5 text-coral-500" />} title="Paw Moments" />
          <div className="mx-4 mt-3 rounded-2xl bg-cream-50 p-3 shadow-soft ring-1 ring-cream-200">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-lg">
                {speciesEmoji[pet.species.toUpperCase()] ?? "🐾"}
              </span>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={`Share a moment as ${pet.name}…`}
                maxLength={200}
                className="w-full rounded-full bg-cream-100 px-3 py-2 text-sm text-bark-700 outline-none placeholder:text-bark-400"
              />
              <button
                type="button"
                onClick={handleCreatePost}
                disabled={!caption.trim() || posting}
                aria-label="Share Paw Moment"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-coral-500 text-white disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {posts.length === 0 ? (
            <p className="mx-4 mt-3 text-sm text-bark-500">No Paw Moments yet — be the first to share one 🐾</p>
          ) : (
            <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-4">
              {posts.map((p) => (
                <div key={p.id} className="w-56 shrink-0 rounded-2xl bg-cream-50 p-3 shadow-soft ring-1 ring-cream-200">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-lg">
                      {speciesEmoji[p.pet.species.toUpperCase()] ?? "🐾"}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-700 text-bark-700">{p.pet.name}</p>
                      <p className="truncate text-[11px] text-bark-500">{p.pet.breed ?? p.pet.species}</p>
                    </div>
                  </div>
                  {p.caption && <p className="mt-2 text-sm text-bark-600">{p.caption}</p>}
                  <div className="mt-2 flex items-center justify-between text-xs text-bark-400">
                    <span>{formatTimeAgo(p.createdAt)}</span>
                    <span className="flex items-center gap-1">🐾 {p.interactions.length}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pets near you — no discovery API exists yet */}
          <SectionHead icon={<MapPin className="h-5 w-5 text-forest-500" />} title="Pets Near You" />
          <div className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-cream-50 p-4 shadow-soft ring-1 ring-cream-200">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest-400/15 text-forest-600">
              <Compass className="h-5 w-5" />
            </span>
            <p className="text-sm text-bark-600">Pet discovery is coming soon — check back once nearby pets can be found.</p>
          </div>

          {/* Connection requests (real PetConnection, pending + incoming) */}
          <div className="mx-4 mt-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-700 text-bark-700">
              <span className="text-violet-500">🐾</span> Connection Requests
              {pendingIncoming.length > 0 && (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-coral-500 text-[11px] font-700 text-white">
                  {pendingIncoming.length}
                </span>
              )}
            </h2>
          </div>
          {pendingIncoming.length === 0 ? (
            <p className="mx-4 mt-3 text-sm text-bark-500">No connection requests yet</p>
          ) : (
            <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-4">
              {pendingIncoming.map((r) => (
                <div key={r.id} className="w-40 shrink-0 rounded-2xl bg-cream-50 p-3 text-center shadow-soft ring-1 ring-cream-200">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-b from-cream-200 to-cream-100 text-3xl ring-2 ring-coral-300">🐾</span>
                  <p className="mt-2 font-700 text-bark-700">Pending request</p>
                  <p className="text-[11px] text-bark-400">Wants to connect with {pet.name}</p>
                  <div className="mt-2 flex justify-center gap-2">
                    <button
                      type="button"
                      aria-label="Decline"
                      onClick={() => handleConnectionResponse(r.id, "REJECTED")}
                      className="grid h-9 w-9 place-items-center rounded-full bg-cream-200 text-bark-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Accept"
                      onClick={() => handleConnectionResponse(r.id, "ACCEPTED")}
                      className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-white"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming meetups — demo content, no Meetup model exists yet */}
          <div className="mx-4 mt-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-700 text-bark-700">
              <Calendar className="h-5 w-5 text-rose-400" /> Upcoming Meetups
            </h2>
            <button className="flex items-center gap-0.5 text-sm font-600 text-sky-500">See all <ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="mx-4 mt-3 space-y-3">
            {meetups.map((m) => (
              <div key={m.id} className="flex overflow-hidden rounded-2xl bg-cream-50 shadow-soft ring-1 ring-cream-200">
                <div className={`grid w-32 shrink-0 place-items-center bg-gradient-to-br ${m.bg} text-4xl`}>{m.scene}</div>
                <div className="flex-1 p-3">
                  <p className="font-display font-700 text-bark-700">{m.title} {m.emoji}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-bark-500"><Calendar className="h-3.5 w-3.5" />{m.date}</p>
                  <p className="flex items-center gap-1 text-xs text-bark-500"><MapPin className="h-3.5 w-3.5" />{m.place}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {["🐶", "🦊", "🐕", "🐩"].map((e, i) => (
                        <span key={i} className="grid h-6 w-6 place-items-center rounded-full bg-cream-200 text-xs ring-2 ring-cream-50">{e}</span>
                      ))}
                      <span className="grid h-6 min-w-6 place-items-center rounded-full bg-cream-300 px-1 text-[10px] font-700 text-bark-600 ring-2 ring-cream-50">{m.extra}</span>
                    </div>
                    <button className="rounded-full bg-coral-500/15 px-4 py-1.5 text-sm font-600 text-coral-500">Join</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mx-4 mt-5 flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-display text-lg font-700 text-bark-700">{icon} {title}</h2>
    </div>
  );
}
