/**
 * Browser Web Speech API wrapper — text-to-speech via `speechSynthesis` and
 * speech-to-text via `SpeechRecognition`. Purely client-side; every function
 * detects support first and never throws when the browser lacks it.
 */
import type { TargetLanguage } from "@/lib/language-content/types";

const SPEECH_LOCALE: Record<TargetLanguage, string> = {
  en: "en-US",
  es: "es-ES",
  pt: "pt-BR",
};

export function isTTSSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, targetLanguage: TargetLanguage, opts: { rate?: number } = {}): boolean {
  if (!isTTSSupported()) return false;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LOCALE[targetLanguage];
    utterance.rate = opts.rate ?? 0.95;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking(): void {
  if (isTTSSupported()) window.speechSynthesis.cancel();
}

type SpeechRecognitionCtor = new () => SpeechRecognition;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSTTSupported(): boolean {
  return getSpeechRecognitionCtor() !== null;
}

/**
 * Starts a one-shot speech recognition session. Resolves with the best
 * transcript, or `null` if unsupported / the user didn't say anything /
 * recognition errored. Never rejects — pronunciation practice is optional
 * and must never crash the lesson.
 */
export function listenOnce(targetLanguage: TargetLanguage, timeoutMs = 8000): Promise<string | null> {
  const Ctor = getSpeechRecognitionCtor();
  if (!Ctor) return Promise.resolve(null);

  return new Promise((resolve) => {
    const recognition = new Ctor();
    recognition.lang = SPEECH_LOCALE[targetLanguage];
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let settled = false;
    const finish = (result: string | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };

    const timer = setTimeout(() => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
      finish(null);
    }, timeoutMs);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? null;
      finish(transcript);
    };
    recognition.onerror = () => finish(null);
    recognition.onend = () => finish(null);

    try {
      recognition.start();
    } catch {
      finish(null);
    }
  });
}
