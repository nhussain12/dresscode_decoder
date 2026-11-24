// "add inspo": pick up to 3 images, shown as polaroids with a remove ✕.
// Images are resized + converted to base64 right when they're picked,
// so they're ready to send (and survive going back and forth between screens).
"use client";

import { useState } from "react";
import { fileToJpegBase64 } from "./resizeImage";

export const MAX_INSPO = 3;

export type InspoItem = {
  id: string;
  previewUrl: string; // for the thumbnail
  data: string; // base64 JPEG without the data: prefix, sent to the API
};

// Simple unique id (crypto.randomUUID needs https, which a phone on local wifi won't have).
let nextId = 0;
const makeId = () => `inspo-${Date.now()}-${nextId++}`;

export function InspoPicker({
  items,
  setItems,
}: {
  items: InspoItem[];
  setItems: (update: (prev: InspoItem[]) => InspoItem[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const left = MAX_INSPO - items.length;

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).slice(0, left);
    setNote(fileList.length > left ? `only ${MAX_INSPO} pics max, so i kept the first ${left}.` : "");
    setBusy(true);
    for (const file of files) {
      try {
        const { data, previewUrl } = await fileToJpegBase64(file);
        setItems((prev) => (prev.length >= MAX_INSPO ? prev : [...prev, { id: makeId(), data, previewUrl }]));
      } catch {
        setNote("couldn't read that one, try another pic.");
      }
    }
    setBusy(false);
  }

  return (
    <div>
      <ul className="flex flex-wrap gap-4">
        {items.map((item, i) => (
          <li
            key={item.id}
            className={`relative w-32 border-2 border-ink bg-white p-2 pb-1 shadow-paper ${i % 2 ? "tilt-r" : "tilt-l"}`}
          >
            {/* washi tape on top */}
            <span aria-hidden="true" className="absolute -top-2.5 left-1/2 h-4 w-14 -translate-x-1/2 bg-olive/80" />
            {/* eslint-disable-next-line @next/next/no-img-element -- local data URL, next/image adds nothing here */}
            <img src={item.previewUrl} alt={`inspo ${i + 1}`} className="aspect-square w-full border border-ink/30 object-cover" />
            <p className="mt-1 font-mono text-[13px]">inspo {i + 1}</p>
            {/* remove button: 44px tap area around a small round ✕ */}
            <button
              type="button"
              onClick={() => setItems((prev) => prev.filter((p) => p.id !== item.id))}
              aria-label={`remove inspo ${i + 1}`}
              className="absolute -top-5 -right-5 flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-3 focus-visible:outline-burgundy"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-white text-[13px]">
                ✕
              </span>
            </button>
          </li>
        ))}

        {/* add tile: a label wrapping the file input, so tapping it opens the photo library on phones */}
        {left > 0 && (
          <li>
            <label className="flex h-40 w-32 cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed border-ink bg-white/40 text-center font-mono text-[14px] hover:bg-white focus-within:outline-3 focus-within:outline-burgundy">
              <span aria-hidden="true" className="font-heavy text-[26px] leading-none">+</span>
              <span>{busy ? "adding…" : items.length === 0 ? "add a pic" : `add (${left} left)`}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                disabled={busy}
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = ""; // let the same file be picked again after removing it
                }}
              />
            </label>
          </li>
        )}
      </ul>
      <p aria-live="polite" className="mt-3 text-[14px] text-burgundy">
        {note}
      </p>
    </div>
  );
}
