// Screen 3: "your looks". Optional inspo read, folder tabs, and "decode another".
import type { StyleResult } from "@/lib/style";
import { LookTabs } from "./LookTabs";
import { Sparkle, Star } from "./decorations";
import { BackLink, DressCodeTag, MonoLabel, PrimaryButton } from "./ui";

export function LooksScreen({
  dressCode,
  result,
  onEditAnswers,
  onDecodeAnother,
}: {
  dressCode: string;
  result: StyleResult;
  onEditAnswers: () => void;
  onDecodeAnother: () => void;
}) {
  return (
    <main className="relative pt-4 pb-14">
      <div className="flex items-center justify-between gap-3">
        <BackLink onClick={onEditAnswers}>← edit answers</BackLink>
        <DressCodeTag text={dressCode.trim()} />
      </div>

      <div className="relative mt-4">
        <h1 className="title-shadow pr-14 font-display text-[50px] leading-none text-burgundy">your looks</h1>
        <Star className="absolute top-0 right-0 w-12" />
      </div>
      <p className="mt-3 flex items-center gap-2 text-[17px]">
        3 ways to wear it, from easy to bold. <Sparkle className="w-6" />
      </p>

      {/* what the AI picked up from the inspo pics (only if there was any) */}
      {result.inspoRead.trim() !== "" && (
        <section aria-label="from your inspo" className="tilt-r-sm relative mt-7 border-2 border-ink bg-white px-5 pt-6 pb-5 shadow-paper">
          <span aria-hidden="true" className="absolute -top-3 left-6 h-5 w-20 -rotate-3 bg-pink/80" />
          <MonoLabel>
            from your inspo <span aria-hidden="true">📌</span>
          </MonoLabel>
          <p className="mt-2 font-serif text-[18px] leading-snug break-words italic">{result.inspoRead}</p>
        </section>
      )}

      <LookTabs looks={result.looks} />

      <PrimaryButton onClick={onDecodeAnother} className="mt-12">
        decode another
      </PrimaryButton>
    </main>
  );
}
