"use server";

import { feedbackSchema, ONE_WEEK } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
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
