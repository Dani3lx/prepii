"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { useRouter } from "next/navigation";
import { generateFeedback } from "@/lib/actions/feedback.action";
import { Mic, MicOff, Phone } from "lucide-react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({ user, interview }: AgentProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [joining, setJoining] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const router = useRouter();

  // Initializes vapi
  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setJoining(false);
    };
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript,
        };

        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: VapiError) => {
      if (error.errorMsg == "Meeting has ended") return;
      console.log("Error:", error.errorMsg);
      toast.error("Something went wrong during the call");
    };

    // Initialize vapi by opening listener.
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      // Turns off the listener
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleGenerateFeedback = async (messages: SavedMessage[]) => {
    try {
      const { success, message, context } = await generateFeedback({
        interviewId: interview.id,
        userId: user.id,
        transcript: messages,
        questions: interview.questions,
      });

      console.log(`/feedback/${context?.feedbackId}`);
      if (success) {
        toast.success(message);
        router.push(`/feedback/${context?.feedbackId}`);
      } else {
        console.log("Error saving feedback");
        toast.error(message);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handles end of call
  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      setLoading(true);
      handleGenerateFeedback(messages);
    }
  }, [messages, callStatus]);

  const handleMute = async () => {
    vapi.setMuted(!isMuted);
    setIsMuted((prev) => !prev);
  };

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    setJoining(true);

    let formattedQuestions = "";

    if (interview.questions) {
      formattedQuestions = interview.questions
        .map((question) => `- ${question}`)
        .join("\n");
    }

    await vapi.start(interviewer(user.firstname), {
      variableValues: {
        questions: formattedQuestions,
      },
    });
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      {callStatus === CallStatus.INACTIVE ? (
        <div className="alt-background rounded-xl p-8 container flex flex-col justify-center items-center gap-8 h-[66vh]">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            {interview?.role ? interview.role : "Behavioural"} Interview with{" "}
            {interview?.company ? interview.company : "Lily"}
          </h1>
          <div className="flex flex-col gap-4">
            <Image
              src="/interviewer.svg"
              alt="interviewer"
              width={120}
              height={120}
            />
            <p>Lily is in this call</p>
          </div>

          <Button className="w-1/3 p-6" onClick={handleCall}>
            {!joining ? "Join Call" : "Joining ..."}
          </Button>
        </div>
      ) : (
        <div className="w-screen h-screen fixed top-0 left-0 bg-black flex flex-col justify-center items-center p-12 z-50">
          <div
            className={cn(
              "w-full h-full bg-white/20 flex flex-col justify-center items-center rounded-3xl gap-4",
              isSpeaking ? "border-5 border-green-500" : ""
            )}
          >
            <Image
              src="/interviewer.svg"
              alt="Lily"
              width={128}
              height={128}
              className="object-cover bg-white rounded-full"
            />
            <h3 className="text-white">Lily Chen</h3>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              className={cn(
                "h-14 w-14 rounded-full cursor-pointer",
                isMuted && "bg-red-600 hover:bg-red-700"
              )}
              disabled={loading}
              onClick={handleMute}
            >
              {isMuted ? (
                <MicOff className="scale-130" />
              ) : (
                <Mic className="scale-130" />
              )}
            </Button>
            <Button
              variant={"destructive"}
              onClick={handleDisconnect}
              disabled={loading}
              className="h-14 w-20 rounded-full cursor-pointer"
            >
              {<Phone className="rotate-135 scale-130" />}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Agent;
