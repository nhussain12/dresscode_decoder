// Screen 2: "before we style you". Shows what the AI understood, then an
// optional intake form. Everything is optional; the sticky bar sends it off.
"use client";

import type { Understanding } from "@/lib/understand";
import { InspoPicker, type InspoItem } from "./InspoPicker";
import { Paperclip, Sparkle, Star, WavyDivider } from "./decorations";
import { BackLink, ChipGroup, DressCodeTag, PrimaryButton, SecondaryButton, SectionHeading, TextField } from "./ui";

// Fixed "about you" questions, always shown.
export const COVERAGE_OPTIONS = ["keep it covered", "somewhere in between", "show some skin"];
export const SHOES_OPTIONS = ["comfy only", "heels are fine"];

export type Answers = Record<string, string>; // question text → chosen option

type Props = {
  dressCode: string;
  understanding: Understanding;
  eventAnswers: Answers;
  setEventAnswer: (question: string, answer: string | undefined) => void;
  comfortAnswers: Answers;
  setComfortAnswer: (question: string, answer: string | undefined) => void;
  coverage: string;
  setCoverage: (v: string) => void;
  shoes: string;
  setShoes: (v: string) => void;
  anythingElse: string;
  setAnythingElse: (v: string) => void;
  inspo: InspoItem[];
  setInspo: (update: (prev: InspoItem[]) => InspoItem[]) => void;
  onEdit: () => void;
  onStyle: (skip: boolean) => void;
};

export function QuestionsScreen(p: Props) {
  const u = p.understanding;
  // No questions at all means the input wasn't about an event: just nudge back to edit.
  const offTopic = u.eventQuestions.length === 0 && u.comfortQuestions.length === 0;

  return (
    <main className={`relative pt-4 ${offTopic ? "pb-12" : "pb-48"}`}>
      {/* header row */}
      <div className="flex items-center justify-between gap-3">
        <BackLink onClick={p.onEdit}>← edit</BackLink>
        <DressCodeTag text={p.dressCode.trim()} />
      </div>

      <div className="relative mt-4">
        <h1 className="title-shadow pr-14 font-display text-[46px] leading-[0.95] text-burgundy">before we style you</h1>
        <Star className="absolute top-2 right-0 w-12" />
      </div>
      {!offTopic && (
        <p className="mt-3 text-[17px] leading-snug">everything here is optional. tap what you know, skip what you don&apos;t.</p>
      )}

      {/* what the AI understood, on a clipped pink card */}
      <section aria-label="what we understood" className="tilt-l-sm relative mt-7 border-2 border-ink bg-pink px-5 pt-6 pb-5 shadow-paper">
        <Paperclip className="absolute -top-5 left-6 w-5" />
        <p className="font-serif text-[16px] italic">here&apos;s what i&apos;m picking up 👀</p>
        <p className="mt-2 font-serif text-[20px] leading-snug break-words italic">{u.understanding}</p>
        {!offTopic && (
          <span className="mt-4 inline-block rounded-full border-2 border-ink bg-white px-3 py-1 font-mono text-[13px]">
            {u.isVague ? "a few things are fuzzy 🤔" : "pretty clear, just fine-tuning 👌"}
          </span>
        )}
      </section>

      {offTopic ? (
        <PrimaryButton onClick={p.onEdit} className="mt-10">
          ← edit the dress code
        </PrimaryButton>
      ) : (
        <>
          {/* the intake form, styled as a manila folder */}
          <div className="relative mt-10">
            <Sparkle className="absolute -top-3 right-4 w-7" />
            <span className="ml-4 inline-block rounded-t-md border-2 border-b-0 border-ink bg-warm px-4 py-2 font-mono text-[14px]">
              intake form
            </span>
            <div className="-mt-0.5 rounded-md border-2 border-ink bg-warm px-5 py-6">
              {/* about the event */}
              {u.eventQuestions.length > 0 && (
                <section aria-labelledby="h-event">
                  <SectionHeading id="h-event">about the event</SectionHeading>
                  <QuestionList questions={u.eventQuestions} answers={p.eventAnswers} setAnswer={p.setEventAnswer} />
                  <WavyDivider className="my-8" />
                </section>
              )}

              {/* about you: fixed coverage + shoes, then any comfort questions */}
              <section aria-labelledby="h-you">
                <SectionHeading id="h-you">about you</SectionHeading>
                <div className="mt-3 space-y-5 border-t-2 border-dashed border-ink/30 pt-4">
                  <ChipGroup
                    legend="coverage"
                    options={COVERAGE_OPTIONS}
                    value={p.coverage || undefined}
                    onChange={(v) => p.setCoverage(v ?? "")}
                  />
                  <div className="border-t-2 border-dashed border-ink/30 pt-4">
                    <ChipGroup
                      legend="shoes"
                      options={SHOES_OPTIONS}
                      value={p.shoes || undefined}
                      onChange={(v) => p.setShoes(v ?? "")}
                    />
                  </div>
                </div>
                {u.comfortQuestions.length > 0 && (
                  <QuestionList questions={u.comfortQuestions} answers={p.comfortAnswers} setAnswer={p.setComfortAnswer} />
                )}
              </section>

              {/* anything else? */}
              <section className="mt-6 border-t-2 border-dashed border-ink/30 pt-5">
                <SectionHeading>
                  <label htmlFor="anything-else">anything else?</label>
                </SectionHeading>
                <div className="mt-3">
                  <TextField
                    id="anything-else"
                    value={p.anythingElse}
                    onChange={p.setAnythingElse}
                    placeholder="i run cold, no heels over 2 inches, modest outfits…"
                  />
                </div>
              </section>

              {/* add inspo */}
              <section aria-labelledby="h-inspo" className="mt-6 border-t-2 border-dashed border-ink/30 pt-5">
                <SectionHeading id="h-inspo">
                  add inspo <span aria-hidden="true">📌</span>
                </SectionHeading>
                <p className="mt-1 mb-5 font-mono text-[13px] text-ink/80">up to 3 · pinterest pics, a friend&apos;s fit</p>
                <InspoPicker items={p.inspo} setItems={p.setInspo} />
              </section>
            </div>
          </div>

          {/* sticky bottom bar with the two send buttons */}
          <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink/15 bg-cream/95 backdrop-blur-sm">
            <div className="mx-auto max-w-md space-y-2.5 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <PrimaryButton onClick={() => p.onStyle(false)}>style me ✨</PrimaryButton>
              <SecondaryButton onClick={() => p.onStyle(true)}>skip, just style me</SecondaryButton>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

// A list of AI-generated questions, each as a single-select chip group.
function QuestionList({
  questions,
  answers,
  setAnswer,
}: {
  questions: Understanding["eventQuestions"];
  answers: Answers;
  setAnswer: (question: string, answer: string | undefined) => void;
}) {
  return (
    <div className="mt-3">
      {questions.map((q) => (
        <div key={q.question} className="border-t-2 border-dashed border-ink/30 py-4">
          <ChipGroup
            legend={q.question}
            options={q.options}
            value={answers[q.question]}
            onChange={(v) => setAnswer(q.question, v)}
          />
        </div>
      ))}
    </div>
  );
}
