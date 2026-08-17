import { Menu, Search, Bell } from "lucide-react";
import Logo from "@/components/Logo";
import StoryRail from "@/components/home/StoryRail";
import PostCard from "@/components/home/PostCard";
import BottomNav from "@/components/home/BottomNav";
import { posts } from "@/lib/data";

export default function HomePage() {
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
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-amber-100 text-xl ring-2 ring-coral-400">
                🐶
              </span>
            </div>
          </div>

          <StoryRail />
        </header>

        {/* Feed */}
        <main className="flex-1 space-y-5 px-4 pb-28 pt-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
