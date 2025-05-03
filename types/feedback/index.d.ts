interface GenerateFeedbackProps {
  userId: string;
  transcript: { role: string; content: string }[];
  interviewId: string;
}
