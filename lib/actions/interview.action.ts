"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getCurrentUser } from "./auth.action";

export const generateInterview = async (
  param: GenerateInterviewParams
): Promise<InterviewGenerationResponse> => {
  const { role, company, description, userid } = param;

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
            The job role is ${role}.
            The company is ${company}.
            The job description is ${description}.
            The amount of questions is 3.
            Please return only the questions, without any additional text.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
            Return the questions formatted like this:
            ["Question 1", "Question 2", "Question 3"]
        `,
    });

    const interview = {
      role: role,
      company: company,
      questions: JSON.parse(questions),
      userId: userid,
      createdAt: new Date().toISOString(),
    };

    const interviewRecord = await db.collection("interviews").add(interview);

    return {
      success: true,
      message: "Interview has been successfully created!",
      context: { interviewId: interviewRecord.id },
    };
  } catch (error) {
    console.log("Something went wrong: ", error);
    return {
      success: false,
      message: "Something went wrong, please try again.",
    };
  }
};

export const getInterviewById = async (
  id: string
): Promise<Interview | null> => {
  try {
    const user = await getCurrentUser();
    const interviewRecord = await db.collection("interviews").doc(id).get();

    if (!interviewRecord.exists || interviewRecord.data()?.userId != user?.id) {
      return null;
    }

    const interview = {
      id: interviewRecord.id,
      ...interviewRecord.data(),
    } as Interview;

    return interview;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getInterviewsByUserId = async (
  userId: string
): Promise<Interview[]> => {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  if (interviews.empty) {
    return [];
  }

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
};
