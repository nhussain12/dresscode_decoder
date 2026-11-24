// Screen 1: type (or tap) a dress code, then "decode it →".
"use client";

import { Flower, Sparkle, Star, Tape } from "./decorations";
import { PrimaryButton, TextField } from "./ui";

// Example chips. Colors match the mockup; tapping just fills the input.
const EXAMPLES = [
  { text: "smart casual recruiting mixer", bg: "bg-pink", fg: "text-ink" },
  { text: "nostalgic festival fits", bg: "bg-burgundy", fg: "text-white" },
  { text: "black tie wedding", bg: "bg-olive", fg: "text-ink" },
];

export function InputScreen({
  dressCode,
  setDressCode,
  onDecode,
}: {
  dressCode: string;
  setDressCode: (v: string) => void;
  onDecode: () => void;
}) {
  const canDecode = dressCode.trim() !== "";

  return (
    <main className="relative pt-10 pb-12">
      {/* title */}
      <div className="relative">
        <h1 className="title-shadow pr-12 font-display text-[56px] leading-[1.0] text-burgundy">
          dress code decoder
        </h1>
        <Star className="absolute top-0 right-0 w-14" />
        <Sparkle className="absolute top-24 right-6 w-7" />
      </div>
      <p className="mt-5 text-[19px] leading-snug">
        the dress code is the same for everyone. your outfit shouldn&apos;t be.
      </p>

      {/* taped paper card holding the input (card tilts, input doesn't) */}
      <form
        className="relative mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          if (canDecode) onDecode();
        }}
      >
        <div className="tilt-l-sm relative rounded-md border-2 border-ink bg-warm px-5 pt-8 pb-6 shadow-paper">
          <Tape className="absolute -top-3 left-1/2 -translate-x-1/2" />
          <Flower className="absolute -top-6 -right-3 w-12" />
          <label htmlFor="dress-code" className="mb-3 block font-mono text-[14px] leading-snug tracking-[-0.01em]">
            type the dress code or paste the group chat message
          </label>
          <div className="tilt-r-sm">
            <TextField
              id="dress-code"
              value={dressCode}
              onChange={setDressCode}
              placeholder="e.g. cocktail attire, rooftop, 7pm"
              rows={3}
            />
          </div>
        </div>

        {/* example chips */}
        <p className="mt-10 font-mono text-[14px]">or tap one ↓</p>
        <div className="mt-3 flex flex-col items-start gap-3">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.text}
              type="button"
              onClick={() => setDressCode(ex.text)}
              className={`min-h-11 max-w-full rounded-full border-2 border-ink px-5 py-2.5 text-left font-mono text-[15px] leading-snug tracking-[-0.02em] break-words shadow-[inset_0_0_0_4px_white,4px_4px_0_0_rgb(30_42_68/0.25)] transition hover:brightness-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-burgundy ${ex.bg} ${ex.fg}`}
            >
              {ex.text}
            </button>
          ))}
        </div>
        <Sparkle color="#E9B8C6" className="mt-4 w-6" />

        <PrimaryButton type="submit" disabled={!canDecode} className="mt-8 text-[26px]">
          decode it →
        </PrimaryButton>
        {!canDecode && (
          <p className="mt-2 text-center text-[13px] text-ink/70">type a dress code or tap an example first</p>
        )}
      </form>

      <p className="mt-5 text-center font-mono text-[14px] text-ink/75">no sign up. no judgment. just fits.</p>
    </main>
  );
}
