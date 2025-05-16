interface GenerateFeedbackParams {
  userId: string;
  transcript: { role: string; content: string }[];
  questions: string[];
  interviewId: string;
}

interface Feedback {
  id: string;
  interviewId: string;
  overallScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  createdAt: string;
}

interface FeedbackSummary {
  id: string;
  interviewId: string;
  overallScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  role: string;
  company: string;
  createdAt: string;
}

interface FeedbackScore {
  attempt: string;
  communication: number;
  problemSolving: number;
  culturalFit: number;
  clarity: number;
}

type FeedbackContext = {
  feedbackId: string;
};

type FeedbackGenerationResponse = ServerResponse<FeedbackContext>;
