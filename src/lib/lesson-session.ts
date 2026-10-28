/** A finite sequence: each activity is visited once, including on resume. */
export type LessonActivity = {
  type: "vocab" | "quiz" | "listening" | "speaking" | "translation" | "dragdrop";
  title?: string;
  question?: string;
  word?: string;
  meaning?: string | Partial<Record<"en" | "es" | "pt", string>>;
  example?: string;
  options?: string[];
  correct?: number;
  audioText?: string;
  targetPhrase?: string;
  correctTranslation?: string;
  explanation?: string;
  sentence?: string;
  tokens?: string[];
  answerTokens?: string[];
};

export interface LessonSession {
  version: 1;
  cursor: number;
  results: Array<boolean | null>;
  startedAt: number;
}

export function buildActivities(steps: any[]): LessonActivity[] {
  return steps.flatMap((step): LessonActivity[] => {
    switch (step.type) {
      case "vocab":
        return (step.words || [])
          .filter((w: any) => w.word)
          .map((w: any) => ({ ...w, type: "vocab" }));
      case "quiz":
      case "listening":
        return step.options?.length > 1 &&
          Number.isInteger(step.correct) &&
          step.options[step.correct] !== undefined
          ? [step]
          : [];
      case "speaking":
        return step.targetPhrase ? [step] : [];
      case "translation":
        return step.correctTranslation ? [step] : [];
      case "dragdrop":
        return step.tokens?.length && step.answerTokens?.length ? [step] : [];
      default:
        return [];
    }
  });
}

export function normalizeAnswer(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[\p{P}\p{S}]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function freshSession(): LessonSession {
  return { version: 1, cursor: 0, results: [], startedAt: Date.now() };
}

export function restoreSession(raw: unknown, count: number): LessonSession | null {
  const value = raw as LessonSession | null;
  if (
    !value ||
    value.version !== 1 ||
    !Number.isInteger(value.cursor) ||
    value.cursor < 0 ||
    value.cursor > count ||
    !Array.isArray(value.results)
  )
    return null;
  if (
    value.results.length !== value.cursor ||
    value.results.some((r) => r !== null && typeof r !== "boolean")
  )
    return null;
  return { ...value, startedAt: Number.isFinite(value.startedAt) ? value.startedAt : Date.now() };
}

export function advanceSession(
  session: LessonSession,
  count: number,
  result: boolean | null,
): LessonSession {
  if (session.cursor >= count) return session;
  return { ...session, cursor: session.cursor + 1, results: [...session.results, result] };
}

export function sessionAccuracy(session: LessonSession): number {
  const scored = session.results.filter((r) => r !== null);
  return scored.length ? Math.round((scored.filter(Boolean).length / scored.length) * 100) : 0;
}
