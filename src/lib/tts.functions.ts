import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TTSInput = z.object({
  text: z.string(),
  languageCode: z.enum(["pt-BR", "en-US"]),
});

export const getGoogleTTS = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => TTSInput.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      // Fallback or warning
      console.warn("Missing GOOGLE_CLOUD_API_KEY. Speech synthesis will use browser native fallback.");
      return { audioContent: null };
    }

    try {
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text: data.text },
            voice: {
              languageCode: data.languageCode,
              name: data.languageCode === "pt-BR" ? "pt-BR-Wavenet-A" : "en-US-Wavenet-F",
              ssmlGender: "FEMALE",
            },
            audioConfig: { audioEncoding: "MP3" },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Google TTS Error: ${response.status} ${error}`);
      }

      const json = await response.json();
      return { audioContent: json.audioContent }; // Base64 string
    } catch (error) {
      console.error("TTS fetch failed:", error);
      return { audioContent: null };
    }
  });
