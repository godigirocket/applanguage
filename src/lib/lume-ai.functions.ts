import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ChatMsg = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const Input = z.object({
  topic: z.string().min(1).max(80),
  language: z.enum(["pt", "en"]),
  mood: z.enum(["calm", "intensive", "cultural", "confidence"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  studentName: z.string().min(1).max(80),
  messages: z.array(ChatMsg).min(1).max(60),
});

function buildSystem(p: z.infer<typeof Input>) {
  const langName = p.language === "pt" ? "Brazilian Portuguese" : "English";
  const targetLang = p.language === "pt" ? "Portuguese" : "English";
  
  const moodInstructions = {
    calm: "Flow naturally, correct maximum once per 3 messages, always encourage first.",
    intensive: "After each response, add one specific grammar or vocabulary correction in italics.",
    cultural: "Weave in one cultural reference, fact, or story per response.",
    confidence: "Never correct. Only encourage. Celebrate every attempt enthusiastically.",
  }[p.mood];

  const levelRules = {
    beginner: "keep sentences short, use simpler vocabulary, add English hints in parentheses for complex words.",
    intermediate: "use a natural pace, introduce occasional new expressions, and explain idioms if used.",
    advanced: "native-level conversation, challenge with complex ideas and nuanced vocabulary.",
  }[p.level];

  return `You are Lume — a warm, patient, culturally-rich language companion.
You are talking to ${p.studentName}, who is practicing ${targetLang} at a ${p.level} level.
Topic: ${p.topic}. 
Mood: ${p.mood} — ${moodInstructions}

Core Rules:
- Respond in ${targetLang} always.
- Level logic: ${levelRules}
- Always end with a question to keep the conversation flowing.
- Never sound robotic. Be warm, curious, human.
- If you provide a correction, always start with something positive first.
- Max 4 sentences per response unless student asks for an explanation.
- Be an active listener. Show interest in ${p.studentName}'s life.`;
}

export const lumeChat = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const system = buildSystem(data);
    
    // Map roles to Gemini roles
    const contents = data.messages.map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: system }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${text.slice(0, 200)}`);
    }

    const json = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const reply = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
    
    if (!reply) {
      throw new Error("Lume couldn't generate a response. Please try again.");
    }

    return { reply };
  });