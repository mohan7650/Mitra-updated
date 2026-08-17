import { Plus } from "lucide-react";
import { stories } from "@/lib/data";

export default function StoryRail() {
  return (
    <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 py-3">
      {/* Add pet */}
      <button type="button" className="flex shrink-0 flex-col items-center gap-1.5">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-coral-500/10 ring-2 ring-dashed ring-coral-400/50">
          <span className="relative text-2xl">
            🐾
            <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-coral-500 text-white">
              <Plus className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
          </span>
        </span>
        <span className="text-xs font-600 text-bark-600">Add Pet</span>
      </button>

      {stories.map((s) => (
        <button key={s.id} type="button" className="flex shrink-0 flex-col items-center gap-1.5">
          <span className="relative rounded-full bg-gradient-to-tr from-coral-500 via-amber-500 to-forest-500 p-[2.5px]">
            <span
              className={`grid h-16 w-16 place-items-center rounded-full bg-gradient-to-b ${s.bg} text-3xl ring-2 ring-cream-100`}
            >
              {s.emoji}
            </span>
            {s.online && (
              <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full bg-forest-500 ring-2 ring-cream-100" />
            )}
          </span>
          <span className="max-w-[64px] truncate text-xs font-600 text-bark-600">{s.name}</span>
        </button>
      ))}
    </div>
  );
}
