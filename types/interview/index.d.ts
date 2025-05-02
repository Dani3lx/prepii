interface GenerateInterviewParams {
  role: string;
  company: string;
  description: string;
  userid: string;
}

type InterviewContext = {
  interviewId: string;
};

type InterviewGenerationResponse = ServerResponse<InterviewContext>;

interface Interview {
  id: string;
  role: string;
  company: string;
  questions: string[];
  createdAt: string;
  userId: string;
}
