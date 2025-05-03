interface GenerateFeedbackParams {
  userId: string;
  transcript: { role: string; content: string }[];
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
