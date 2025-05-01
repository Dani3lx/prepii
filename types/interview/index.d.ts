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
