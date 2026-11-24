# dress code decoder

An easy, quick, and no-nonsense tool that solves all those "I have nothing to wear" moments. With dress code decoder, users can type in a dress code, answer a few quick questions, and get 3 outfit ideas that makes deciding what to wear much easier!

**live demo:** (https://dresscode-decoder.vercel.app/)

**The core idea:** the dress code is the same for everyone, but your outfit shouldn't be. So the app asks about the event *and* about you (comfort, notes, inspo pics) before suggesting anything.

## how it works

```
you type a dress code
   ↓  AI call #1: "understand"
"before we style you" screen
   - what the AI thinks the event is
   - questions about the event (tap to answer)
   - coverage + shoes
   - questions about comfort for this specific event
   - "anything else?" + inspo upload
   ↓  AI call #2: "style"
your 3 looks: play it safe / on theme / dress to impress
```
- **Model:** Claude Sonnet 5.5 (`claude-sonnet-5-5`) via the Anthropic API
- **Stack:** Next.js + TypeScript + Tailwind, on Vercel. The API key only lives on the server.
- **Two calls on purpose:** the first figures out what to ask, while the second makes the outfits. One job per prompt makes each easier to test and fix.

## how I designed the prompts

The full prompts are in `lib/understand.ts` and `lib/style.ts`. The main ideas:

- **one job per prompt:** "understand" only decides what to ask, and "style" only makes the outfits
- **ask only what changes the outfit**, most important first
- **inspo is a direction, not a copy:** it shapes the vibe without recreating the outfit

## output format

Both calls return **structured JSON** instead of a paragraph, so the app always knows exactly where everything is.
 
**understand** returns:
```ts
{
  understanding: string,       // what the AI thinks the event is, shown back to you
  isVague: boolean,            // shows "a few things are fuzzy" vs "pretty clear"
  eventQuestions: { question, options[] }[],    // 1–3
  comfortQuestions: { question, options[] }[]   // 0–3, specific to this event
}
```
 
**style** returns:
```ts
{
  inspoRead: string,           // what it picked up from your inspo ("" if none)
  looks: {
    tier, name, pieces[], accessories[],
    colors: { name, hex }[],   // drawn as color swatches
    why
  }[]                          // always 3
}
```

**play it safe / on theme / dress to impress.** Comfort settings are hard rules for all 3, so "dress to impress" means bolder color or texture, **never less coverage.** Inspo pics steer the style but never get judged, and it doesn't assume gender or depict anyone. 

## handling vague input

- **It always asks** 1–3 questions, ranked by how much they'd change the outfit. Vague events get clarifying questions ("which era?"), clear ones get fine-tuning ("indoors or outdoors?").
- **It shows its understanding first**, so you can catch a misread before answering.
- **Everything is skippable**, including a "skip, just style me" button that makes reasonable assumptions.
- **Off-topic input** gets a friendly note asking for an event instead of fake questions.

## what I'd build next

- save your comfort settings for next time
- a follow-up chat to refine looks
- generate images of clothing items that are suggested
- enable users to upload pictures of clothes already in their closet to get suggestions that don't require any extra purchases

## run it locally

```bash
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
npm run dev
```
