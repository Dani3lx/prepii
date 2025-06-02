import { ONE_WEEK } from "@/constants";
import { db } from "@/firebase/admin";
import { connectRedis, redisClient } from "../redis";
import { getCurrentUser } from "./auth.data";

export async function getFeedbackById(id: string): Promise<Feedback | null> {
  const user = await getCurrentUser();

  const feedback = await db.collection("feedbacks").doc(id).get();

  if (!feedback.exists || feedback.data()?.userId !== user?.id) return null;

  return {
    id: feedback.id,
    ...feedback.data(),
  } as Feedback;
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
