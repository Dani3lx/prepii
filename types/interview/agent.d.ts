enum MessageRoleEnum {
  USER = "user",
  SYSTEM = "system",
  ASSISTANT = "assistant",
}

enum TranscriptTypeEnum {
  PARTIAL = "partial",
  FINAL = "final",
}

interface Message {
  type: string;
  role: MessageRoleEnum;
  transcriptType: TranscriptTypeEnum;
  transcript: string;
}
