import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";
import { interviewPrompt } from "./pompt";

export const ONE_WEEK = 60 * 60 * 24 * 7 * 1000;

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
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

export const feedbackPrompt = (formattedTranscript: string): string => `
You are an AI interviewer reviewing a mock interview. Your role is to provide a structured, objective evaluation of the candidate's performance.

Be thorough and critical in your analysis—your goal is to help the candidate improve. Highlight both strengths and specific areas where the candidate can grow. Avoid being overly lenient; focus on actionable and honest feedback.

Transcript:
${formattedTranscript}

Evaluate the candidate in each of the categories below. For each category, assign a score from 0 to 100 and justify your rating with detailed reasoning. Do not add or remove any categories:

- **Communication Skills**: Clarity, tone, fluency, and how effectively the candidate communicated ideas.
- **Problem-Solving**: Ability to understand, analyze, and address problems with logical or creative solutions.
- **Cultural Fit**: Alignment with the values and expectations of a professional workplace and the target role.
- **Confidence & Clarity**: Confidence in delivery, clarity of responses, engagement level, and structured thinking (e.g., use of the STAR method).
`;
