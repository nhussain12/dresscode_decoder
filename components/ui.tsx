// Shared building blocks: chips, buttons, the text field, small labels.
"use client";

import { useLayoutEffect, useRef, type ComponentProps, type ReactNode } from "react";

// ---------- Chip ----------
// A tappable pill. Shows a ✓ and turns burgundy when selected.
// min-h-11 = 44px tap target. Text wraps inside the chip instead of overflowing.
export function Chip({
  label,
  selected = false,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex min-h-11 max-w-full items-center rounded-full border-2 border-ink px-4 py-2 text-left font-mono text-[14px] leading-snug tracking-[-0.02em] break-words transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-burgundy ${
        selected ? "bg-burgundy text-white shadow-hard" : "bg-white text-ink hover:bg-warm"
      }`}
    >
      {selected && <span aria-hidden="true" className="mr-1.5">✓</span>}
      <span className="min-w-0">{label}</span>
    </button>
  );
}

// ---------- ChipGroup ----------
// One question with single-select chips. Tapping the selected chip unselects it.
export function ChipGroup({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: string[];
  value: string | undefined;
  onChange: (next: string | undefined) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-[16px] font-semibold leading-snug break-words">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Chip
            key={opt}
            label={opt}
            selected={value === opt}
            onClick={() => onChange(value === opt ? undefined : opt)}
          />
        ))}
      </div>
    </fieldset>
  );
}

// ---------- Buttons ----------
type BtnProps = ComponentProps<"button"> & { children: ReactNode };

// Big burgundy pill with the offset navy shadow.
export function PrimaryButton({ children, className = "", ...rest }: BtnProps) {
  return (
    <button
      type="button"
      {...rest}
      className={`flex min-h-14 w-full items-center justify-center rounded-full border-2 border-ink bg-burgundy px-6 py-3 font-heavy text-[22px] tracking-[-0.03em] text-white shadow-hard transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-burgundy disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-0 disabled:active:shadow-hard ${className}`}
    >
      {children}
    </button>
  );
}

// White outline pill.
export function SecondaryButton({ children, className = "", ...rest }: BtnProps) {
  return (
    <button
      type="button"
      {...rest}
      className={`flex min-h-12 w-full items-center justify-center rounded-full border-2 border-ink bg-white px-6 py-2.5 text-[17px] font-bold text-ink transition hover:bg-warm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-burgundy ${className}`}
    >
      {children}
    </button>
  );
}

// "← edit" style link at the top of a screen.
export function BackLink({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-ml-2 inline-flex min-h-11 items-center rounded-full px-2 font-mono text-[14px] text-ink hover:underline focus-visible:outline-3 focus-visible:outline-burgundy"
    >
      {children}
    </button>
  );
}

// Olive pill tag that shows the dress code at the top of screens 2 and 3.
export function DressCodeTag({ text }: { text: string }) {
  return (
    <span className="tilt-r-sm inline-block max-w-[60%] rounded-full border-2 border-ink bg-olive px-3 py-1 font-mono text-[13px] leading-snug tracking-[-0.02em] break-words">
      {text}
    </span>
  );
}

// Small monospace label like "pieces" or "why it works".
export function MonoLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-mono text-[13px] font-medium tracking-[-0.01em] ${className}`}>{children}</p>;
}

// Big chunky section heading ("about the event", "add inspo").
export function SectionHeading({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="font-heavy text-[26px] leading-tight tracking-[-0.03em]">
      {children}
    </h2>
  );
}

// ---------- TextField ----------
// Clean multi-line input that grows as you type. Never tilted.
// 17px text keeps iPhone Safari from zooming in on focus.
export function TextField({
  id,
  value,
  onChange,
  placeholder,
  rows = 2,
  ariaDescribedBy,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  ariaDescribedBy?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Resize to fit the content whenever the value changes.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 4}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      id={id}
      rows={rows}
      value={value}
      placeholder={placeholder}
      aria-describedby={ariaDescribedBy}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full resize-none overflow-hidden rounded-xl border-2 border-ink bg-white px-4 py-3 text-[17px] leading-relaxed text-ink placeholder:text-ink/45 focus:border-burgundy focus:outline-none focus:ring-4 focus:ring-burgundy/25"
    />
  );
}
