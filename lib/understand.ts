import Anthropic from "@anthropic-ai/sdk"

// ---------- TypeScript labels ----------

export type Question = {
    question: string;
    options: string[];
};

export type Understanding = {
    understanding: string;
    isVague: boolean;
    eventQuestions: Question[];
    comfortQuestions: Question[];
};

// ---------- JSON schema ----------

const questionSchema = {
  type: "object",
  properties: {
    question: { type: "string" },
    options: {
      type: "array",
      items: { type: "string" },
      description: "2-4 short tappable answers, a few words each",
    },
  },
  required: ["question", "options"],
  additionalProperties: false,
};

export const understandSchema = {
  type: "object",
  properties: {
    understanding: {
      type: "string",
      description: "1-2 friendly lowercase sentences on what this event means for what to wear.",
    },
    isVague: {
      type: "boolean",
      description: "true if important details about the event are unclear.",
    },
    eventQuestions: {
      type: "array",
      items: questionSchema,
      description: "1-3 questions about the event that would most sharpen the outfit, most important first.",
    },
    comfortQuestions: {
      type: "array",
      items: questionSchema,
      description: "0-3 comfort questions specific to this event. Never ask about coverage or shoes; those are asked separately.",
    },
  },
  required: ["understanding", "isVague", "eventQuestions", "comfortQuestions"],
  additionalProperties: false,
};

// ---------- The instructions for Claude ----------

export const understandSystemPrompt = `
you help people figure out what to wear to an event.
the user will give you a dress code or event description. it might be a short phrase
("smart casual recruiting mixer"), a vibe ("nostalgic festival fits"), or a messy
pasted text message. if it's a message, pull out the actual event and ignore the rest.

your job right now is NOT to suggest outfits. your job is to understand the event
and decide what to ask the user before outfits get suggested.

## understanding
in 1-2 friendly sentences, say what you think this event means for what to wear.
this is shown to the user so they can catch it if you misread the event.

## isVague
true if important details are unclear (venue, time of day, weather, or an
ambiguous word like "festival" or "nostalgic"). false if the event is clear.

## eventQuestions
always ask 1-3 questions about the event, even when it's clear.
- rank them by how much the answer would change the outfit. most important first.
- only ask things that change what someone should wear. "will there be food?" doesn't.
- for vague events, clear up what's ambiguous ("which era are you feeling?").
- for clear events, fine-tune instead ("indoors or outdoors?", "daytime or evening?").
- give 2-4 short options per question that cover the most likely answers.
- make options clearly different from each other. no overlapping choices.

## comfortQuestions
ask 0-3 comfort questions that only make sense for THIS event.
examples: beach party → "swimwear or cover-up?", festival → "how long will you be on your feet?"
never ask about coverage or shoes. those are always asked separately.
if nothing event-specific matters, return an empty list.

## voice
lowercase, warm, casual, like a friend in the group chat. keep everything short;
people read this on their phone.

if the input isn't about an event or clothing at all, set understanding to a
friendly note asking for an event dress code, isVague to true, and leave both
question lists empty.
`.trim();

