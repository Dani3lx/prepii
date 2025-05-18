import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";
import { interviewPrompt } from "./pompt";

export const ONE_WEEK = 60 * 60 * 24 * 7 * 1000;

export const interviewer = (candidate: string): CreateAssistantDTO => {
  return {
    name: "Interviewer",
    firstMessage: `Hey ${candidate}! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.`,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId: "G7iiSdUpTxfaEQrlPlp1",
      stability: 0.5,
      similarityBoost: 0.8,
      speed: 0.9,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: interviewPrompt,
        },
      ],
      tools: [
        {
          type: "endCall",
        },
      ],
    },
  };
};

export const feedbackSchema = z.object({
  overallScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Clarity and Structure"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
});
