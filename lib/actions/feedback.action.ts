"use server";

import { feedbackPrompt, feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

export const generateFeedback = async (
  props: GenerateFeedbackProps
): Promise<ServerResponse> => {
  const { userId, transcript, interviewId } = props;
  try {
    const formattedTranscript = transcript
      .map((sentence) => `- ${sentence.role}: ${sentence.content}\n`)
      .join("");

    const {
      object: { overallScore, categoryScores, strengths, areasForImprovement },
    } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: feedbackPrompt(formattedTranscript),
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    await db.collection("feedback").add({
      interviewId,
      userId,
      overallScore,
      categoryScores,
      strengths,
      areasForImprovement,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "Feedback generated successfully!",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to create feedback",
    };
  }
};
