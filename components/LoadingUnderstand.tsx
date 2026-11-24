import type { CSSProperties } from "react";
// Loading screen while /api/understand runs ("decoding.exe").
import { RetroWindow } from "./RetroWindow";
import { Flower, Sparkle, Star } from "./decorations";

const BLOCKS = 10; // squares in the looping progress bar

export function LoadingUnderstand({ dressCode }: { dressCode: string }) {
  return (
    <main className="relative flex min-h-dvh flex-col justify-center py-16" aria-busy="true">
      <Star className="absolute top-14 right-4 w-12" />
      <Flower center="#CECB5F" className="absolute bottom-20 left-2 w-12" />
      <Sparkle color="#CECB5F" className="absolute right-10 bottom-36 w-6" />

      <div className="relative">
        <Sparkle color="#E9B8C6" className="absolute -top-4 -left-3 z-10 w-8" />
        <RetroWindow title="decoding.exe" barColor="bg-olive" showMenu>
          <h1 className="font-display text-[30px] leading-tight text-burgundy">reading the vibe…</h1>

          {/* the user's dress code, on a little paper slip */}
          <p className="tilt-l-sm mt-4 inline-block max-w-full border-2 border-ink bg-warm px-4 py-2 font-mono text-[15px] break-words">
            “{dressCode}”
          </p>

          {/* looping progress blocks (no fake numbers) */}
          <div className="mt-5 flex gap-1 border-2 border-ink p-1" aria-hidden="true">
            {Array.from({ length: BLOCKS }, (_, i) => (
              <span
                key={i}
                className="anim-block h-6 flex-1 bg-burgundy"
                style={{ "--i": i } as CSSProperties}
              />
            ))}
          </div>

          <ul className="mt-5 space-y-2 font-mono text-[14px]">
            <li>✓ read the dress code</li>
            <li>
              <span className="anim-blink inline-block" aria-hidden="true">→</span> figuring out what&apos;s fuzzy
            </li>
          </ul>
        </RetroWindow>
      </div>

      <p role="status" className="mt-8 text-center font-serif text-[19px] italic">
        this one takes a few seconds
      </p>
    </main>
  );
}
