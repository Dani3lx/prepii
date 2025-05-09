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

    await db.collection("feedbacks").add({
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
    .collection("feedbacks")
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

export async function getFeedbacksByUserId(
  userId: string
): Promise<Feedback[]> {
  const feedbacks = await db
    .collection("feedbacks")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  if (feedbacks.empty) {
    return [];
  }

  return feedbacks.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Feedback[];
}

export async function getFeedbackSummariesByUserId(
  userId: string
): Promise<FeedbackSummary[]> {
  const [interviewSnap, feedbackSnap] = await Promise.all([
    db.collection("interviews").where("userId", "==", userId).get(),
    db
      .collection("feedbacks")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get(),
  ]);

  if (interviewSnap.empty || feedbackSnap.empty) return [];

  const interviews = interviewSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];

  const feedbacks = feedbackSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Feedback[];

  const interviewMap = new Map<string, Interview>();
  interviews.forEach((interview) => interviewMap.set(interview.id, interview));

  const feedbackSummaries: FeedbackSummary[] = feedbacks
    .map((feedback) => {
      const interview = interviewMap.get(feedback.interviewId);
      if (!interview) return null;

      return {
        id: feedback.id,
        interviewId: interview.id,
        overallScore: feedback.overallScore,
        categoryScores: feedback.categoryScores,
        role: interview.role,
        company: interview.company,
        createdAt: feedback.createdAt,
      } as FeedbackSummary;
    })
    .filter(Boolean) as FeedbackSummary[];

  return feedbackSummaries;
}

export const processFeedbackScores = async (
  feedbackSummaries: FeedbackSummary[]
): Promise<FeedbackScore[]> => {
  const scores: FeedbackScore[] = [];
  feedbackSummaries.map((feedbackSummary, index) => {
    const feedbackScore: FeedbackScore = {
      attempt: `Attempt ${feedbackSummaries.length - index}`,
      communication: feedbackSummary.categoryScores[0].score,
      problemSolving: feedbackSummary.categoryScores[1].score,
      culturalFit: feedbackSummary.categoryScores[2].score,
      clarity: feedbackSummary.categoryScores[3].score,
    };
    scores.push(feedbackScore);
  });

  return scores.reverse();
};
