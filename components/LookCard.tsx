// One outfit card: name, pieces, accessories, color palette, and why it works.
import type { Look } from "@/lib/style";
import { MonoLabel } from "./ui";

export function LookCard({ look, bg, sweetSpot }: { look: Look; bg: string; sweetSpot: boolean }) {
  return (
    <article className={`relative border-2 border-ink px-5 pt-6 pb-6 shadow-hard ${bg}`}>
      {/* the "★ the sweet spot" sticker on the "on theme" card */}
      {sweetSpot && (
        <span className="tilt-r mb-3 inline-block rounded-full border-2 border-ink bg-burgundy px-3 py-1 font-mono text-[13px] text-white">
          ★ the sweet spot
        </span>
      )}

      <h2 className="font-heavy text-[30px] leading-[1.05] tracking-[-0.03em] break-words">{look.name.toLowerCase()}</h2>

      {/* pieces */}
      <MonoLabel className="mt-5">pieces</MonoLabel>
      <ul className="mt-1">
        {look.pieces.map((piece) => (
          <li key={piece} className="border-b-2 border-dashed border-ink/25 py-2.5 text-[17px] leading-snug break-words">
            {piece}
          </li>
        ))}
      </ul>

      {/* accessories (hidden if there aren't any) */}
      {look.accessories.length > 0 && (
        <>
          <MonoLabel className="mt-5">accessories</MonoLabel>
          <ul className="mt-2 flex flex-wrap gap-2">
            {look.accessories.map((a) => (
              <li
                key={a}
                className="max-w-full rounded-full border-2 border-ink bg-white px-3 py-1.5 font-mono text-[13px] leading-snug tracking-[-0.02em] break-words"
              >
                {a}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* color palette: each square is filled with the hex the AI picked */}
      <MonoLabel className="mt-5">colors</MonoLabel>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-3 border-2 border-ink bg-white p-4">
        {look.colors.map((c) => (
          <li key={c.name + c.hex} className="flex w-[72px] flex-col items-center gap-1.5 text-center">
            <span aria-hidden="true" className="h-12 w-12 border-2 border-ink" style={{ backgroundColor: safeHex(c.hex) }} />
            <span className="font-mono text-[12px] leading-tight break-words">{c.name}</span>
          </li>
        ))}
      </ul>

      {/* why it works */}
      <MonoLabel className="mt-5">why it works</MonoLabel>
      <p className="mt-1 font-serif text-[18px] leading-snug break-words italic">{look.why}</p>
    </article>
  );
}

// Only pass real hex colors to CSS; fall back to a neutral grey otherwise.
function safeHex(hex: string) {
  const h = hex.trim().startsWith("#") ? hex.trim() : `#${hex.trim()}`;
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(h) ? h : "#cccccc";
}
