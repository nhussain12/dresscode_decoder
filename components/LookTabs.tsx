// Folder tabs on screen 3: one look card visible at a time.
// Uses the standard ARIA tabs pattern: role="tablist" / "tab" / "tabpanel",
// aria-selected, and left/right (plus Home/End) arrow keys to move between tabs.
"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import type { Look } from "@/lib/style";
import { LookCard } from "./LookCard";

// The three tabs, in order, with each card's color.
const TABS: { tier: Look["tier"]; num: string; bg: string }[] = [
  { tier: "play it safe", num: "01", bg: "bg-pink" },
  { tier: "on theme", num: "02", bg: "bg-olive" },
  { tier: "dress to impress", num: "03", bg: "bg-powder" },
];

export function LookTabs({ looks }: { looks: Look[] }) {
  const [active, setActive] = useState(0); // start on tab 01
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Match each tab to its look by tier; fall back to list position if the tier is missing.
  const tabs = TABS.map((t, i) => ({ ...t, look: looks.find((l) => l.tier === t.tier) ?? looks[i] })).filter(
    (t): t is (typeof TABS)[number] & { look: Look } => Boolean(t.look)
  );

  // Arrow keys move selection and focus (wrapping around the ends).
  function onKeyDown(e: KeyboardEvent) {
    const last = tabs.length - 1;
    let next = active;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  const current = tabs[active];
  if (!current) return null;

  return (
    <div className="mt-8">
      <div role="tablist" aria-label="your three looks" onKeyDown={onKeyDown} className="relative z-10 flex items-end gap-1">
        {tabs.map((t, i) => {
          const selected = i === active;
          return (
            <button
              key={t.tier}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`tab-${i}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="look-panel"
              tabIndex={selected ? 0 : -1} // roving tabindex: only the active tab is in the Tab order
              onClick={() => setActive(i)}
              className={`min-h-11 min-w-0 flex-1 rounded-t-lg border-2 border-ink px-2 font-mono text-[13px] leading-tight tracking-[-0.03em] break-words transition-[padding] focus-visible:outline-3 focus-visible:-outline-offset-4 focus-visible:outline-burgundy ${t.bg} ${
                selected
                  ? "-mb-0.5 border-b-0 pt-3 pb-3.5 font-medium" // sits flush with the card below
                  : "pt-2 pb-2 opacity-75 hover:opacity-100"
              }`}
            >
              {/* number on its own line so narrow phones wrap cleanly; screen readers hear "01 · play it safe" */}
              <span className="block text-[12px] opacity-80">
                {t.num}
                <span className="sr-only"> · </span>
              </span>
              {t.tier}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id="look-panel" aria-labelledby={`tab-${active}`} tabIndex={0} className="focus-visible:outline-3 focus-visible:outline-burgundy">
        <LookCard key={current.tier} look={current.look} bg={current.bg} sweetSpot={current.tier === "on theme"} />
      </div>
    </div>
  );
}
