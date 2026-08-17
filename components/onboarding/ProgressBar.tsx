export default function ProgressBar({
  current,
  total = 5,
}: {
  current: number;
  total?: number;
}) {
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              done ? "bg-forest-600" : active ? "bg-forest-500" : "bg-cream-300"
            }`}
          />
        );
      })}
    </div>
  );
}
