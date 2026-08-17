import { PawPrint } from "lucide-react";

// A decorative, deterministic QR-style block — not a real scannable code,
// just a visual stand-in that matches the mockups.
export default function QrPlaceholder({
  size = 72,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const n = 11;
  const cells: boolean[] = [];
  for (let i = 0; i < n * n; i++) {
    // pseudo-random but stable pattern
    cells.push((i * 7 + (i % 5) * 13 + ((i / n) | 0) * 3) % 3 !== 0);
  }
  const finder = (r: number, c: number) =>
    (r < 3 && c < 3) || (r < 3 && c >= n - 3) || (r >= n - 3 && c < 3);

  return (
    <div
      className={`relative grid rounded-md bg-white p-1 ${className}`}
      style={{ width: size, height: size, gridTemplateColumns: `repeat(${n}, 1fr)` }}
      aria-hidden
    >
      {cells.map((on, i) => {
        const r = (i / n) | 0;
        const c = i % n;
        const dark = finder(r, c) ? (r % 2 === 0 || c % 2 === 0) : on;
        return <span key={i} className={dark ? "bg-bark-700" : "bg-transparent"} />;
      })}
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid h-1/3 w-1/3 place-items-center rounded-sm bg-white">
          <PawPrint className="h-3 w-3 text-bark-700 fill-current" />
        </span>
      </span>
    </div>
  );
}
