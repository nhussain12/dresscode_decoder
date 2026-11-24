// Small decorative SVG stickers. All are aria-hidden: they're just for looks.
import { useId } from "react";

type DecoProps = { className?: string };

// Silver five-point star with a navy outline.
export function Star({ className = "" }: DecoProps) {
  const id = useId();
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E7E9EF" />
          <stop offset="1" stopColor="#8E94A6" />
        </linearGradient>
      </defs>
      <path
        d="M50 6 L62 38 L96 40 L69 61 L79 94 L50 75 L21 94 L31 61 L4 40 L38 38 Z"
        fill={`url(#${id})`}
        stroke="#1E2A44"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Four-point sparkle. Pass a fill color.
export function Sparkle({ className = "", color = "#CECB5F" }: DecoProps & { color?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className}>
      <path
        d="M20 2 C22 14 26 18 38 20 C26 22 22 26 20 38 C18 26 14 22 2 20 C14 18 18 14 20 2 Z"
        fill={color}
        stroke="#1E2A44"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Five-petal daisy with a colored center.
export function Flower({ className = "", center = "#E9B8C6" }: DecoProps & { center?: string }) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={className}>
      {petals.map((deg) => (
        <circle
          key={deg}
          cx="50"
          cy="27"
          r="17"
          fill="#fff"
          stroke="#1E2A44"
          strokeWidth="4"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="12" fill={center} stroke="#1E2A44" strokeWidth="3" />
    </svg>
  );
}

// Grey paperclip, used to "clip" the understanding card.
export function Paperclip({ className = "" }: DecoProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 60" className={className}>
      <path
        d="M8 44 V12 a6 6 0 0 1 12 0 V48 a8 8 0 0 1 -16 0 V18"
        fill="none"
        stroke="#8E94A6"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// A strip of translucent washi tape.
export function Tape({ className = "", color = "rgb(206 203 95 / 0.8)" }: DecoProps & { color?: string }) {
  return <span aria-hidden="true" className={`block h-6 w-24 ${className}`} style={{ backgroundColor: color }} />;
}

// Burgundy squiggle used between sections.
export function WavyDivider({ className = "" }: DecoProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 300 20" preserveAspectRatio="none" className={`h-5 w-full ${className}`}>
      <path
        d="M0 10 Q 18.75 0 37.5 10 T 75 10 T 112.5 10 T 150 10 T 187.5 10 T 225 10 T 262.5 10 T 300 10"
        fill="none"
        stroke="#66052C"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
