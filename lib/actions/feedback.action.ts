"use server";

import { feedbackPrompt, feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { getCurrentUser } from "./auth.action";

export const generateFeedback = async (
  props: GenerateFeedbackParams
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

export async function getFeedbackByInterviewId(
  interviewId: string
): Promise<Feedback | null> {
  const user = await getCurrentUser();

  const feedback = await db
    .collection("feedback")
    .where("userId", "==", user?.id)
    .where("interviewId", "==", interviewId)
    .limit(1)
    .get();

  if (feedback.empty) return null;

  const feedbackDoc = feedback.docs[0];

  return {
    id: feedbackDoc.id,
    ...feedbackDoc.data(),
  } as Feedback;
}
