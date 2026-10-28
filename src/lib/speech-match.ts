/** Word error rate: measures the transcript, never accent or phonetic quality. */
export function matchTranscript(target: string, spoken: string): number {
  const words = (text: string) =>
    text
      .normalize("NFC")
      .toLocaleLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[^\p{L}\p{N}'\s]/gu, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  const expected = words(target),
    actual = words(spoken);
  if (!expected.length || !actual.length) return 0;
  let previous = Array.from({ length: actual.length + 1 }, (_, i) => i);
  for (let i = 1; i <= expected.length; i++) {
    const current = [i];
    for (let j = 1; j <= actual.length; j++)
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (expected[i - 1] === actual[j - 1] ? 0 : 1),
      );
    previous = current;
  }
  return Math.max(0, Math.round((1 - previous[actual.length] / expected.length) * 100));
}
