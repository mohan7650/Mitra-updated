import { Check, PawPrint } from "lucide-react";
import type { PetType } from "@/lib/data";

export default function PetTypeCard({
  pet,
  selected,
  onSelect,
}: {
  pet: PetType;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(pet.id)}
      aria-pressed={selected}
      className={`relative flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-3xl bg-cream-50 p-4 shadow-soft transition ${
        selected
          ? "ring-2 ring-forest-600 bg-forest-400/10"
          : "ring-1 ring-cream-300 hover:ring-forest-400"
      } active:scale-[0.98]`}
    >
      {selected && (
        <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-forest-600 text-cream-50">
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
      )}
      <span
        className={`grid h-[76px] w-[76px] place-items-center rounded-full text-4xl ${pet.ring}`}
      >
        {pet.emoji}
      </span>
      <span className={`flex items-center gap-1.5 font-display text-lg font-600 ${pet.paw}`}>
        <PawPrint className="h-4 w-4 fill-current" />
        {pet.label}
      </span>
    </button>
  );
}
