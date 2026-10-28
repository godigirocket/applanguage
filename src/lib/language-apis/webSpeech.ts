/**
 * Browser Web Speech API wrapper — text-to-speech via `speechSynthesis` and
 * speech-to-text via `SpeechRecognition`. Purely client-side; every function
 * detects support first and never throws when the browser lacks it.
 */
import type { TargetLanguage } from "@/lib/language-content/types";
import { selectVoice } from "./voice-selection";
import recordings from "./recorded-audio.json";
let activeAudio: HTMLAudioElement | null = null;
let playbackId = 0;
export function hasRecordedAudio(text: string, language: TargetLanguage) {
  return Object.hasOwn(recordings, `${language}:${text.trim().toLocaleLowerCase()}`);
}

const SPEECH_LOCALE: Record<TargetLanguage, string> = {
  en: "en-US",
  es: "es-ES",
  pt: "pt-BR",
};

export function isTTSSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.speechSynthesis?.speak === "function" &&
    typeof SpeechSynthesisUtterance === "function"
  );
}

export function speak(
  text: string,
  targetLanguage: TargetLanguage,
  opts: { rate?: number; onError?: () => void; recorded?: boolean } = {},
): boolean {
  if (typeof window === "undefined") return false;
  stopSpeaking();
  const id = playbackId;
  const recording = (recordings as Record<string, { src: string }>)[
    `${targetLanguage}:${text.trim().toLocaleLowerCase()}`
  ];
  if (recording && opts.recorded !== false && typeof Audio !== "undefined") {
    let selected: string | null = null;
    try {
      selected = localStorage.getItem(`lume_voice_${targetLanguage}`);
    } catch {
      /* Browser storage unavailable. */
    }
    if (!selected) {
      const audio = new Audio(recording.src);
      activeAudio = audio;
      audio.playbackRate = opts.rate ?? 1;
      let failed = false;
      const fallback = () => {
        if (failed || id !== playbackId) return;
        failed = true;
        activeAudio = null;
        audio.pause();
        speak(text, targetLanguage, { ...opts, recorded: false });
      };
      audio.onerror = fallback;
      audio.onended = () => {
        if (activeAudio === audio) activeAudio = null;
      };
      void audio.play().catch(fallback);
      return true;
    }
  }
  if (!isTTSSupported()) return false;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LOCALE[targetLanguage];
    const voices = window.speechSynthesis.getVoices();
    let preferred: string | null = null;
    try {
      preferred = localStorage.getItem(`lume_voice_${targetLanguage}`);
    } catch {
      /* Private browser storage may be blocked. */
    }
    utterance.voice =
      voices.find(
        (voice) =>
          voice.voiceURI === preferred && voice.lang.toLowerCase().startsWith(targetLanguage),
      ) ?? selectVoice(voices, utterance.lang);
    // Normal cadence preserves the prosody of enhanced system/browser voices.
    utterance.rate = opts.rate ?? 1;
    utterance.pitch = 1;
    utterance.onerror = (event) => {
      if (event.error !== "canceled" && event.error !== "interrupted") opts.onError?.();
    };
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

/** Populate lazy voice lists before the first user-initiated playback. */
export function warmSpeechVoices(): void {
  try {
    if (isTTSSupported()) window.speechSynthesis.getVoices();
  } catch {
    /* Voice availability must not block the page. */
  }
}

export function stopSpeaking(): void {
  playbackId++;
  if (activeAudio) {
    activeAudio.onerror = null;
    activeAudio.pause();
    activeAudio = null;
  }
  try {
    if (isTTSSupported()) window.speechSynthesis.cancel();
  } catch {
    /* Optional browser service. */
  }
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
export function listenOnce(
  targetLanguage: TargetLanguage,
  timeoutMs = 8000,
): Promise<string | null> {
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
