import type Anthropic from "@anthropic-ai/sdk";

// ---------- TypeScript labels ----------
// ---------- what comes out: outfit options ----------

export type Look = {
  tier: "play it safe" | "on theme" | "dress to impress";
  name: string;
  pieces: string[];
  accessories: string[];
  colors: { name: string; hex: string }[];
  why: string;
};

export type StyleResult = {
  inspoRead: string;
  looks: Look[];
};

// ---------- what goes in: all given input ----------

export type Answer = { question: string; answer: string };

export type InspoImage = {
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  data: string; // image, encoded as text (base64)
};

export type StyleRequest = {
  dressCode: string;
  understanding?: string;
  answers?: Answer[];
  coverage?: string;
  shoes?: string;
  anythingElse?: string;
  inspo?: InspoImage[];
};

// ---------- JSON schema ----------

const lookSchema = {
  type: "object",
  properties: {
    tier: { type: "string", enum: ["play it safe", "on theme", "dress to impress"] },
    name: { type: "string", description: "a fun 2-4 word name for the look" },
    pieces: {
      type: "array",
      items: { type: "string" },
      description: "3-5 specific clothing pieces, including shoes",
    },
    accessories: {
      type: "array",
      items: { type: "string" },
      description: "0-3 accessories. empty list if the look doesn't need any",
    },
    colors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "human color name, like 'sage green'" },
          hex: { type: "string", description: "hex color code, like #9CAF88" },
        },
        required: ["name", "hex"],
        additionalProperties: false,
      },
      description: "the 2-4 main colors of this look",
    },
    why: { type: "string", description: "one short sentence on why this look works" },
  },
  required: ["tier", "name", "pieces", "accessories", "colors", "why"],
  additionalProperties: false,
};

export const styleSchema = {
  type: "object",
  properties: {
    inspoRead: {
      type: "string",
      description: "one line on the aesthetic you picked up from the inspo images. empty string if there are none.",
    },
    looks: {
      type: "array",
      items: lookSchema,
      description: "exactly 3 looks, in this order: play it safe, on theme, dress to impress",
    },
  },
  required: ["inspoRead", "looks"],
  additionalProperties: false,
};


// ---------- The instructions for Claude ----------

export const styleSystemPrompt = `
you help people figure out what to wear to an event.
you'll get the event, what's already known about it, and details about the person:
their answers to questions, their comfort settings, notes, and sometimes inspo images.
some questions may have been skipped. if so, make a reasonable assumption.

## the 3 looks, always in this order
- "play it safe": classic and impossible to get wrong for this event
- "on theme": leans into the dress code or theme, the sweet spot
- "dress to impress": the boldest option that still fits the event

## the person's limits come first
treat coverage, shoes, and their notes as hard rules for ALL 3 looks.
"dress to impress" means bolder color, texture, or statement pieces,
never less coverage than they asked for and never shoes they said no to.

## inspo images
if there are images, figure out the aesthetic: colors, silhouettes, textures, vibe.
describe it in inspoRead, and pull it into the looks, especially "on theme".
if the inspo clashes with the dress code, keep the spirit of it in a way that fits.
describe clothing only. never comment on anyone's body, and never identify people.

## be specific
name real pieces: "dark straight-leg jeans", not "nice pants".
don't assume gender. use pieces anyone can wear, or give a choice inside one
item ("a midi skirt or wide-leg trousers"), unless the person's details say otherwise.

## voice
lowercase, warm, casual, like a friend in the group chat. keep it short;
people read this on their phone while getting ready.
`.trim();

// ---------- Consolidating all the information ----------

export function buildStyleContent(req: StyleRequest): Anthropic.ContentBlockParam[] {
  const lines = [`dress code: ${req.dressCode}`];
  if (req.understanding) lines.push(`what we know about the event: ${req.understanding}`);

  const answers = req.answers ?? [];
  if (answers.length > 0) {
    lines.push("their answers:");
    for (const a of answers) lines.push(`- ${a.question} → ${a.answer}`);
  }
  if (req.coverage) lines.push(`coverage: ${req.coverage}`);
  if (req.shoes) lines.push(`shoes: ${req.shoes}`);
  if (req.anythingElse) lines.push(`anything else: ${req.anythingElse}`);

  // images first, then the text, so Claude sees the inspo before reading the details
  const content: Anthropic.ContentBlockParam[] = (req.inspo ?? []).map(
    (img): Anthropic.ImageBlockParam => ({
      type: "image",
      source: { type: "base64", media_type: img.mediaType, data: img.data },
    })
  );
  content.push({ type: "text", text: lines.join("\n") });
  return content;
}