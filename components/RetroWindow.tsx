// Old-school computer window used by the loading and error screens.
// The _ □ × controls and the menu bar are decorative (muted + aria-hidden),
// except the × when `onClose` is passed: then it's a real button.
import type { ReactNode } from "react";

export function RetroWindow({
  title,
  barColor,
  showMenu = false,
  onClose,
  closeLabel,
  className = "",
  children,
}: {
  title: string;
  barColor: string; // Tailwind bg class, e.g. "bg-olive"
  showMenu?: boolean;
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`relative border-[3px] border-ink bg-white shadow-[8px_8px_0_0_var(--color-ink)] ${className}`}>
      {/* title bar */}
      <div className={`flex items-center justify-between gap-3 border-b-[3px] border-ink px-4 py-2 ${barColor}`}>
        <span className="font-mono text-[15px] font-medium">{title}</span>
        {onClose ? (
          <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="-m-2.5 flex h-11 w-11 items-center justify-center focus-visible:outline-3 focus-visible:outline-burgundy"
            >
              <span className="flex h-6 w-6 items-center justify-center border-2 border-ink bg-white text-[13px] leading-none">
                ✕
              </span>
            </button>
        ) : (
          <DecorativeControls />
        )}
      </div>

      {/* menu bar, decorative only */}
      {showMenu && (
        <div aria-hidden="true" className="flex gap-6 border-b-2 border-ink/30 px-4 py-1.5 font-mono text-[13px] text-ink/40 select-none">
          <span>file</span>
          <span>edit</span>
          <span>view</span>
          <span>help</span>
        </div>
      )}

      <div className="p-6">{children}</div>
    </div>
  );
}

// Muted, non-interactive window buttons.
function DecorativeControls() {
  const symbols = ["_", "□", "✕"];
  return (
    <div aria-hidden="true" className="flex gap-1.5 opacity-40 select-none">
      {symbols.map((s) => (
        <span key={s} className="flex h-6 w-6 items-center justify-center border-2 border-ink/70 text-[12px] leading-none">
          {s}
        </span>
      ))}
    </div>
  );
}
