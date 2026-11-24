// Error screen ("oops.exe"). Shown when either API call fails.
// "try again" re-runs the failed call; "start over" (or the ×) resets everything.
"use client";

import { useEffect, useRef } from "react";
import { RetroWindow } from "./RetroWindow";
import { Flower, Sparkle, Star } from "./decorations";
import { PrimaryButton, SecondaryButton } from "./ui";

export function ErrorScreen({ onRetry, onStartOver }: { onRetry: () => void; onStartOver: () => void }) {
  // Move keyboard/screen-reader focus to the main action so the error is announced.
  const retryRef = useRef<HTMLButtonElement>(null);
  useEffect(() => retryRef.current?.focus(), []);

  return (
    <main className="relative flex min-h-dvh flex-col justify-center py-16">
      <Sparkle color="#E9B8C6" className="absolute top-20 left-4 w-8" />
      <Star className="absolute top-14 right-4 w-12" />
      <Sparkle color="#CECB5F" className="absolute right-10 bottom-36 w-6" />
      <Flower className="absolute bottom-20 left-3 w-12" />

      <div className="tilt-r-sm" role="alert">
        <RetroWindow title="oops.exe" barColor="bg-pink" onClose={onStartOver} closeLabel="close and start over">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-ink bg-olive font-heavy text-[26px]"
            >
              !
            </span>
            <h1 className="font-display text-[32px] leading-[1.05] text-burgundy">hmm, that didn&apos;t go through</h1>
          </div>
          <p className="mt-5 text-[18px] leading-relaxed">
            something glitched on our end, not yours. everything you typed is still here, so just try again.
          </p>
          <div className="mt-6 space-y-3">
            <PrimaryButton ref={retryRef} onClick={onRetry}>
              try again
            </PrimaryButton>
            <SecondaryButton onClick={onStartOver}>start over</SecondaryButton>
          </div>
        </RetroWindow>
      </div>
    </main>
  );
}
