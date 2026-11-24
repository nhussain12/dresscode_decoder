import type { CSSProperties } from "react";
// Loading screen while /api/style runs ("styling your looks…").
import { Flower, Sparkle, Star } from "./decorations";

// The three fanned folder cards: color, tab label, resting angle, position.
const FAN = [
  { bg: "bg-pink", tab: "play it safe", r: "-8deg", d: "0s", pos: "left-0 top-6 z-0" },
  { bg: "bg-powder", tab: "dress to impress", r: "7deg", d: "0.4s", pos: "right-0 top-6 z-0" },
  { bg: "bg-olive", tab: "on theme", r: "-1deg", d: "0.2s", pos: "left-1/2 top-0 z-10 -ml-[38%]" },
];

// Swatch colors that "fill in" while we wait.
const SWATCHES = ["#E9B8C6", "#CECB5F", "#4B4E7A", "#66052C", "#C8DCE9", "#F3E19D", "#D9C9EE", "#9CAF88", "#F1EDE5", "#E8A87C", "#1E2A44", "#B5838D"];

export function LoadingStyle() {
  return (
    <main className="relative py-12" aria-busy="true">
      <Star className="absolute top-6 right-2 z-20 w-12" />

      {/* fanned look cards */}
      <div className="relative mx-auto mt-6 h-56 w-full max-w-[340px]" aria-hidden="true">
        {FAN.map((c) => (
          <div
            key={c.tab}
            className={`anim-fan absolute w-[76%] ${c.pos}`}
            style={{ "--r": c.r, "--d": c.d } as CSSProperties}
          >
            <span className={`ml-4 inline-block rounded-t-md border-2 border-b-0 border-ink px-3 py-1 font-mono text-[13px] ${c.bg}`}>
              {c.tab}
            </span>
            <div className={`h-40 rounded-md border-2 border-ink p-4 shadow-paper ${c.bg}`}>
              <div className="h-4 w-3/4 rounded bg-ink/20" />
              <div className="mt-3 h-2.5 w-full rounded bg-ink/15" />
              <div className="mt-2 h-2.5 w-2/3 rounded bg-ink/15" />
              <div className="mt-4 flex gap-2">
                <span className="h-7 w-7 border-2 border-ink bg-white" />
                <span className="h-7 w-7 border-2 border-ink bg-white" />
                <span className="h-7 w-7 border-2 border-ink bg-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Sparkle color="#E9B8C6" className="mt-2 ml-2 w-6" />

      <h1 className="title-shadow mt-6 text-center font-display text-[44px] leading-[1.05] text-burgundy">
        styling your looks…
      </h1>
      <p role="status" className="mx-auto mt-4 max-w-xs text-center text-[18px] leading-snug">
        this one takes a few seconds. we&apos;re putting together 3 looks just for you.
      </p>

      {/* swatch grid that fills in and loops (no counter) */}
      <div className="mx-auto mt-8 max-w-[320px] border-2 border-ink bg-white p-4 shadow-hard" aria-hidden="true">
        <p className="font-mono text-[14px]">mixing colors…</p>
        <div className="mt-3 grid grid-cols-6 gap-2">
          {SWATCHES.map((hex, i) => (
            <span key={hex} className="relative aspect-square border-2 border-dashed border-ink/60">
              <span
                className="anim-swatch absolute -inset-0.5 border-2 border-ink"
                style={{ backgroundColor: hex, "--i": i } as CSSProperties}
              />
            </span>
          ))}
        </div>
      </div>

      {/* while-you-wait note */}
      <div className="tilt-l-sm relative mx-auto mt-10 max-w-[340px] border-2 border-ink bg-warm px-5 py-4 shadow-paper">
        <Flower center="#CECB5F" className="absolute -top-6 -right-4 w-12" />
        <p className="font-serif text-[18px] leading-snug italic">while you wait: go find your other shoe. trust me.</p>
      </div>
    </main>
  );
}
