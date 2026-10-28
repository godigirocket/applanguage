type Voice = Pick<SpeechSynthesisVoice, "name" | "lang" | "default" | "localService">;

/** Prefer natural/enhanced voices without falling back to the wrong language. */
export function selectVoice<T extends Voice>(voices: T[], locale: string): T | null {
  const language = locale.toLowerCase().split("-")[0];
  const score = (voice: T) => {
    const name = voice.name.toLowerCase();
    return (
      (/natural|neural|enhanced|premium/.test(name) ? 100 : 0) +
      (/google|samantha|ava|allison|monica|mónica|joana|luciana|paulina/.test(name) ? 35 : 0) +
      (voice.lang.toLowerCase() === locale.toLowerCase() ? 20 : 0) +
      (voice.default ? 4 : 0) -
      (/espeak|mbrola|compact|microsoft (david|zira|mark) desktop/.test(name) ? 40 : 0)
    );
  };
  return (
    voices
      .filter((voice) => voice.lang.toLowerCase().split(/[-_]/)[0] === language)
      .sort((a, b) => score(b) - score(a))[0] ?? null
  );
}
