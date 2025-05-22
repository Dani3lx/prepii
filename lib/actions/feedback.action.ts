"use server";

import { feedbackSchema, ONE_WEEK } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { getCurrentUser } from "./auth.action";
import { feedbackPrompt } from "@/constants/pompt";
import { connectRedis, redisClient } from "../redis";
import { getInterviewById } from "./interview.action";

export const generateFeedback = async (
  props: GenerateFeedbackParams
): Promise<FeedbackGenerationResponse> => {
  const { userId, transcript, interviewId, questions } = props;
  try {
    const formattedTranscript = transcript
      .map((sentence) => `- ${sentence.role}: ${sentence.content}\n`)
      .join("");

    const formattedQuestions = questions
      .map((question, index) => `Question ${index + 1}: ${question}\n`)
      .join();

    const {
      object: { overallScore, categoryScores, strengths, areasForImprovement },
    } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: feedbackPrompt(formattedTranscript, formattedQuestions),
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const createdAt = new Date().toISOString();

    const feedback = await db.collection("feedbacks").add({
      interviewId,
      userId,
      overallScore,
      categoryScores,
      strengths,
      areasForImprovement,
      createdAt: createdAt,
    });

    try {
      await connectRedis();
      const cacheKey = `feedbackSummaries:user:${userId}`;
      const cached =
        ((await redisClient.json.get(cacheKey)) as FeedbackSummary[]) || null;
      if (cached) {
        const interview = await getInterviewById(interviewId);
        if (interview) {
          const summary: FeedbackSummary = {
            id: feedback.id,
            interviewId,
            overallScore,
            categoryScores,
            role: interview.role,
            company: interview.company,
            createdAt: createdAt,
          };

          const updatedSummaries = [summary, ...cached];
          await redisClient.json.set(cacheKey, "$", updatedSummaries);
          await redisClient.expire(cacheKey, ONE_WEEK);
        }
      }
    } catch (e) {
      console.log("Failed to set Redis Cache for feedback: ", e);
    }
    return {
      success: true,
      message: "Feedback generated successfully!",
      context: { feedbackId: feedback.id },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to create feedback",
    };
  }
};

export async function getFeedbackById(id: string): Promise<Feedback | null> {
  const user = await getCurrentUser();

  const feedback = await db.collection("feedbacks").doc(id).get();

  if (!feedback.exists || feedback.data()?.userId !== user?.id) return null;

  return {
    id: feedback.id,
    ...feedback.data(),
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
  const cacheKey = `feedbackSummaries:user:${userId}`;

  // Return Redis cache if available
  try {
    await connectRedis();
    const result =
      ((await redisClient.json.get(cacheKey)) as FeedbackSummary[]) || null;
    if (result) {
      return result;
    }
  } catch (e) {
    console.error("Redis get error:", e);
  }

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

  try {
    await connectRedis();
    await redisClient.json.set(cacheKey, "$", feedbackSummaries);
    await redisClient.expire(cacheKey, ONE_WEEK);
  } catch (error) {
    console.error("Failed to set Redis cache for feedback summaries:", error);
  }

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
