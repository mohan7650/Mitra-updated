import { PawPrint, Repeat2 } from "lucide-react";
import type { CommunityPost } from "@/lib/api";
import type { ConnectionState } from "@/lib/connectionState";
import PawMomentActions from "@/components/feed/PawMomentActions";

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

function Avatar({ species, photoUrl }: { species: string; photoUrl: string | null }) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt=""
        className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-coral-400/60"
      />
    );
  }
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-2xl ring-2 ring-coral-400/60">
      {speciesEmoji[species.toUpperCase()] ?? "🐾"}
    </span>
  );
}

interface Props {
  post: CommunityPost;
  accessToken: string;
  selectedPetId: string;
  connectionState: ConnectionState;
  onPostUpdate: (postId: string, patch: Partial<CommunityPost>) => void;
  onRepostCreated: (newPost: CommunityPost) => void;
  onConnectionRequested: (receiverPetId: string) => void;
}

export default function PawMomentCard({
  post,
  accessToken,
  selectedPetId,
  connectionState,
  onPostUpdate,
  onRepostCreated,
  onConnectionRequested,
}: Props) {
  const subtitle = post.pet.breed ?? post.pet.customSpecies ?? post.pet.species;

  return (
    <article className="overflow-hidden rounded-3xl bg-cream-50 shadow-card ring-1 ring-cream-200">
      <header className="flex items-center gap-3 px-4 py-3">
        <Avatar species={post.pet.species} photoUrl={post.pet.profilePhotoUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-display text-lg font-600 text-bark-700">{post.pet.name}</h3>
            <span className="grid h-4 w-4 place-items-center rounded-full bg-amber-500/20">
              <PawPrint className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
            </span>
          </div>
          <p className="truncate text-xs text-bark-500">{subtitle}</p>
        </div>
        <span className="shrink-0 text-xs text-bark-500">{formatTimeAgo(post.createdAt)}</span>
      </header>

      {post.originalPost && (
        <div className="mx-4 mb-3 rounded-2xl bg-cream-100 p-3 ring-1 ring-cream-200">
          <p className="flex items-center gap-1.5 text-xs font-600 text-bark-500">
            <Repeat2 className="h-3.5 w-3.5" /> {post.pet.name} pawed this forward
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Avatar species={post.originalPost.pet.species} photoUrl={post.originalPost.pet.profilePhotoUrl} />
            <div className="min-w-0">
              <p className="truncate text-sm font-700 text-bark-700">{post.originalPost.pet.name}</p>
              {post.originalPost.caption && (
                <p className="truncate text-sm text-bark-600">{post.originalPost.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {post.caption && <p className="px-4 pb-3 text-[15px] text-bark-700">{post.caption}</p>}

      <div className="flex items-center gap-1.5 px-4 pb-3 text-sm font-700 text-coral-500">
        <PawPrint className="h-4 w-4 fill-current" />
        {post.pawCount}
      </div>

      <PawMomentActions
        post={post}
        accessToken={accessToken}
        selectedPetId={selectedPetId}
        connectionState={connectionState}
        onPostUpdate={onPostUpdate}
        onRepostCreated={onRepostCreated}
        onConnectionRequested={onConnectionRequested}
      />
    </article>
  );
}
