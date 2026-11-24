// The whole app lives on this one page. All state is kept here, and `screen`
// decides which screen component to show. Going back and forth between screens
// never clears what the user entered; only "start over" / "decode another" do.
"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Understanding } from "@/lib/understand";
import type { Answer, StyleRequest, StyleResult } from "@/lib/style";
import { postJson } from "@/components/api";
import { InputScreen } from "@/components/InputScreen";
import { LoadingUnderstand } from "@/components/LoadingUnderstand";
import { QuestionsScreen, type Answers } from "@/components/QuestionsScreen";
import { LoadingStyle } from "@/components/LoadingStyle";
import { LooksScreen } from "@/components/LooksScreen";
import { ErrorScreen } from "@/components/ErrorScreen";
import type { InspoItem } from "@/components/InspoPicker";

type Screen = "input" | "loadingUnderstand" | "questions" | "loadingStyle" | "looks" | "error";

export default function Home() {
  // ---------- state ----------
  const [screen, setScreen] = useState<Screen>("input");

  // screen 1
  const [dressCode, setDressCode] = useState("");

  // result of /api/understand, plus the (trimmed) dress code it was made for
  const [understanding, setUnderstanding] = useState<Understanding | null>(null);
  const [decodedFor, setDecodedFor] = useState("");

  // screen 2 answers
  const [eventAnswers, setEventAnswers] = useState<Answers>({});
  const [comfortAnswers, setComfortAnswers] = useState<Answers>({});
  const [coverage, setCoverage] = useState("");
  const [shoes, setShoes] = useState("");
  const [anythingElse, setAnythingElse] = useState("");
  const [inspo, setInspo] = useState<InspoItem[]>([]);

  // result of /api/style
  const [result, setResult] = useState<StyleResult | null>(null);

  // which call failed, and whether the last style call was a "skip", so "try again" can repeat it
  const [failed, setFailed] = useState<"understand" | "style" | null>(null);
  const [lastSkip, setLastSkip] = useState(false);

  // Every screen change starts at the top of the page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  // ---------- step 1: understand the event ----------
  async function decode() {
    const code = dressCode.trim();
    if (!code) return;

    // Same dress code as last time? Reuse the understanding and keep all answers.
    if (understanding && code === decodedFor) {
      setScreen("questions");
      return;
    }

    setScreen("loadingUnderstand");
    try {
      const data = await postJson<Understanding>("/api/understand", { dressCode: code });
      setUnderstanding(data);
      setDecodedFor(code);
      // New questions, so old answers to the old questions no longer apply.
      // Coverage, shoes, "anything else?" and inspo are kept.
      setEventAnswers({});
      setComfortAnswers({});
      setScreen("questions");
    } catch {
      setFailed("understand");
      setScreen("error");
    }
  }

  // ---------- step 2: build the StyleRequest from everything on screen 2 ----------
  function buildStyleRequest(skip: boolean): StyleRequest {
    const req: StyleRequest = { dressCode: dressCode.trim(), understanding: understanding?.understanding };
    if (skip) return req; // "skip, just style me": dress code + understanding only

    // Only questions the user actually answered, in the order they were asked.
    const answers: Answer[] = [];
    for (const q of understanding?.eventQuestions ?? []) {
      if (eventAnswers[q.question]) answers.push({ question: q.question, answer: eventAnswers[q.question] });
    }
    for (const q of understanding?.comfortQuestions ?? []) {
      if (comfortAnswers[q.question]) answers.push({ question: q.question, answer: comfortAnswers[q.question] });
    }
    if (answers.length > 0) req.answers = answers;

    // Optional fields go in only if filled in.
    if (coverage) req.coverage = coverage;
    if (shoes) req.shoes = shoes;
    if (anythingElse.trim()) req.anythingElse = anythingElse.trim();

    // Images were already resized + base64'd when picked.
    if (inspo.length > 0) req.inspo = inspo.map((img) => ({ mediaType: "image/jpeg", data: img.data }));
    return req;
  }

  // ---------- step 3: style the looks ----------
  async function style(skip: boolean) {
    setLastSkip(skip);
    setScreen("loadingStyle");
    try {
      const data = await postJson<StyleResult>("/api/style", buildStyleRequest(skip));
      setResult(data);
      setScreen("looks");
    } catch {
      setFailed("style");
      setScreen("error");
    }
  }

  // ---------- error + reset ----------
  function retry() {
    if (failed === "understand") decode();
    else style(lastSkip);
  }

  function resetAll() {
    setDressCode("");
    setUnderstanding(null);
    setDecodedFor("");
    setEventAnswers({});
    setComfortAnswers({});
    setCoverage("");
    setShoes("");
    setAnythingElse("");
    setInspo([]);
    setResult(null);
    setFailed(null);
    setLastSkip(false);
    setScreen("input");
  }

  // ---------- pick the screen ----------
  let content: ReactNode = null;
  if (screen === "input") {
    content = <InputScreen dressCode={dressCode} setDressCode={setDressCode} onDecode={decode} />;
  } else if (screen === "loadingUnderstand") {
    content = <LoadingUnderstand dressCode={dressCode.trim()} />;
  } else if (screen === "questions" && understanding) {
    content = (
      <QuestionsScreen
        dressCode={dressCode}
        understanding={understanding}
        eventAnswers={eventAnswers}
        setEventAnswer={(q, a) => setEventAnswers((prev) => withAnswer(prev, q, a))}
        comfortAnswers={comfortAnswers}
        setComfortAnswer={(q, a) => setComfortAnswers((prev) => withAnswer(prev, q, a))}
        coverage={coverage}
        setCoverage={setCoverage}
        shoes={shoes}
        setShoes={setShoes}
        anythingElse={anythingElse}
        setAnythingElse={setAnythingElse}
        inspo={inspo}
        setInspo={setInspo}
        onEdit={() => setScreen("input")}
        onStyle={style}
      />
    );
  } else if (screen === "loadingStyle") {
    content = <LoadingStyle />;
  } else if (screen === "looks" && result) {
    content = (
      <LooksScreen
        dressCode={dressCode}
        result={result}
        onEditAnswers={() => setScreen("questions")}
        onDecodeAnother={resetAll}
      />
    );
  } else if (screen === "error") {
    content = <ErrorScreen onRetry={retry} onStartOver={resetAll} />;
  }

  // Mobile-first column, centered with a max width on desktop.
  return <div className="mx-auto w-full max-w-md overflow-x-clip px-5">{content}</div>;
}

// Set or clear (when answer is undefined) one question's answer.
function withAnswer(prev: Answers, question: string, answer: string | undefined): Answers {
  const next = { ...prev };
  if (answer === undefined) delete next[question];
  else next[question] = answer;
  return next;
}
