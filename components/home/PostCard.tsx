import { MoreHorizontal, PawPrint, Users } from "lucide-react";
import type { Post } from "@/lib/data";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="overflow-hidden rounded-3xl bg-cream-50 shadow-card ring-1 ring-cream-200">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3">
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-b ${post.avatarBg} text-2xl ring-2 ring-coral-400/60`}
        >
          {post.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-display text-lg font-600 text-bark-700">{post.name}</h3>
            <span className="grid h-4 w-4 place-items-center rounded-full bg-amber-500/20">
              <PawPrint className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
            </span>
          </div>
          <p className="truncate text-xs text-bark-500">
            {post.breed} • {post.location}
          </p>
        </div>
        <span className="text-xs text-bark-500">{post.time}</span>
        <button aria-label="More options" className="text-bark-500">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </header>

      {/* Photo placeholder */}
      <div className={`relative aspect-[4/3] w-full bg-gradient-to-br ${post.photoBg}`}>
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-1 text-white/90 drop-shadow">
            <span className="text-6xl">{post.photoEmoji}</span>
            <span className="text-sm font-600">{post.scene}</span>
          </div>
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-bark-700/70 px-2.5 py-1 text-xs font-600 text-white">
          1/{post.photoCount}
        </span>
      </div>

      {/* Caption */}
      <p className="px-4 pb-3 pt-3 text-[15px] text-bark-700">{post.caption}</p>

      {/* Action bar */}
      <div className="grid grid-cols-3 divide-x divide-cream-200 border-t border-cream-200">
        <button className="flex items-center justify-center gap-2 py-3 text-sm font-700 text-coral-500 transition hover:bg-coral-500/5">
          <PawPrint className="h-5 w-5 fill-current" />
          Paw
        </button>
        <button className="flex items-center justify-center gap-2 py-3 text-sm font-700 text-amber-600 transition hover:bg-amber-500/5">
          <PawPrint className="h-5 w-5" />
          Paw It Forward
        </button>
        <button className="flex items-center justify-center gap-2 py-3 text-sm font-700 text-forest-600 transition hover:bg-forest-500/5">
          <Users className="h-5 w-5" />
          Connect
        </button>
      </div>
    </article>
  );
}
