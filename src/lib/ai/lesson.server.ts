import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

export type GeneratedLesson = {
  title: string;
  summary: string;
  sections: { heading: string; content: string }[];
  keyTakeaways: string[];
  questions: { question: string; options: string[]; answerIndex: number; explanation: string }[];
};

export class LessonError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function generateLesson(input: {
  topic: string;
  preference: string;
  level: string;
}): Promise<GeneratedLesson> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new LessonError("AI is not configured.", 401);

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const system = `You are an expert adaptive tutor. Create a personalized lesson tailored to the learner's preference and level.
Respond with ONLY a JSON object (no markdown fences) of this shape:
{"title": string, "summary": string, "sections": [{"heading": string, "content": string}], "keyTakeaways": string[], "questions": [{"question": string, "options": string[4], "answerIndex": number (0-3), "explanation": string}]}
Use 3-5 sections (each 80-180 words), 3-5 key takeaways, and exactly 5 multiple-choice practice questions.
Adapt style to the preference: visual -> describe diagrams, analogies and mental images; hands-on -> worked examples and small exercises; reading -> clear structured prose; auditory -> conversational, story-like explanations; concise -> short bullet-style content.`;

  let text: string;
  try {
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      system,
      prompt: `Topic: ${input.topic}\nLearning preference: ${input.preference}\nLevel: ${input.level}`,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    text = await result.text;
  } catch (err: unknown) {
    const e = err as { statusCode?: number; message?: string };
    const status = e.statusCode ?? 500;
    if (status === 429) throw new LessonError("Too many requests right now. Please wait a moment and try again.", 429);
    if (status === 402) throw new LessonError("AI credits are exhausted. Please add credits to continue.", 402);
    throw new LessonError(e.message || "Lesson generation failed.", status);
  }

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new LessonError("The AI returned an unexpected response. Please try again.", 500);
  try {
    const parsed = JSON.parse(match[0]) as GeneratedLesson;
    parsed.sections ??= [];
    parsed.keyTakeaways ??= [];
    parsed.questions = (parsed.questions ?? []).filter((q) => Array.isArray(q.options) && q.options.length >= 2);
    return parsed;
  } catch {
    throw new LessonError("The AI returned an unreadable lesson. Please try again.", 500);
  }
}
