import { Columns } from "@/components/data-table/Columns";
import { DataTable } from "@/components/data-table/DataTable";
import { DataChart } from "@/components/DataChart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackSummariesByUserId,
  processFeedbackScores,
} from "@/lib/actions/feedback.action";
import {
  Brain,
  Handshake,
  ListChecks,
  MessageCircle,
  MessageSquare,
  Plus,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();
  const feedbackSummaries = await getFeedbackSummariesByUserId(user!.id);
  const feedbackScores = await processFeedbackScores(
    feedbackSummaries.slice(-20)
  );

  const {
    communicationScore,
    problemSolvingScore,
    culturalFitScore,
    clarityScore,
  } = feedbackScores.reduce(
    (totals, current) => ({
      communicationScore: totals.communicationScore + current.communication,
      problemSolvingScore: totals.problemSolvingScore + current.problemSolving,
      culturalFitScore: totals.culturalFitScore + current.culturalFit,
      clarityScore: totals.clarityScore + current.clarity,
    }),
    {
      communicationScore: 0,
      problemSolvingScore: 0,
      culturalFitScore: 0,
      clarityScore: 0,
    }
  );

  const skillScores = [
    {
      name: "Communication",
      score: Math.round(communicationScore / feedbackScores.length),
      icon: MessageCircle,
    },
    {
      name: "Problem Solving",
      score: Math.round(problemSolvingScore / feedbackScores.length),
      icon: Brain,
    },
    {
      name: "Cultural Fit",
      score: Math.round(culturalFitScore / feedbackScores.length),
      icon: Handshake,
    },
    {
      name: "Clarity & Structure",
      score: Math.round(clarityScore / feedbackScores.length),
      icon: ListChecks,
    },
  ];

  return (
    <div className="flex flex-col gap-8 container px-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            Track your progress and prepare for your next interview.
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Link href="/generate">
            <Plus />
            Start New Interview
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {!feedbackSummaries || feedbackSummaries.length <= 0 ? (
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                Looks like you&apos;re just getting started! Kick off your first
                mock interview now and start building your journey toward
                success.
              </p>
            </div>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Average Scores</CardTitle>
                <CardDescription>
                  Your average score across the 4 categories
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {skillScores.map(({ name, score, icon: SkillIcon }) => (
                  <Card key={name}>
                    <CardHeader className="flex flex-row items-center lg:justify-between justify-center space-y-0 max-lg:px-2">
                      <CardTitle className="text-sm font-medium">
                        {name}
                      </CardTitle>
                      {SkillIcon ? (
                        <SkillIcon className="h-4 w-4 text-muted-foreground max-lg:hidden" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      )}
                    </CardHeader>
                    <CardContent className="max-lg:px-4">
                      <div className="text-2xl font-bold mb-2 max-lg:text-center">
                        {score}/100
                      </div>
                      <Progress value={score} />
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
            <DataChart chartData={feedbackScores} />
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Past attempts</CardTitle>
                <CardDescription>
                  Keep track of your previous interview attempts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <DataTable columns={Columns} data={feedbackSummaries} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default page;
