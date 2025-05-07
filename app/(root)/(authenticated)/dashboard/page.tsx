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
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackSummariesByUserId,
  processFeedbackScores,
} from "@/lib/actions/feedback.action";
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
    },
    {
      name: "Problem Solving",
      score: Math.round(problemSolvingScore / feedbackScores.length),
    },
    {
      name: "Cultural Fit",
      score: Math.round(culturalFitScore / feedbackScores.length),
    },
    {
      name: "Clarity and Structure",
      score: Math.round(clarityScore / feedbackScores.length),
    },
  ];

  return (
    <div className="flex items-center my-24 w-3/5">
      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold tracking-tight">
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
            <Link href="/generate">Start New Interview</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Progress Overview</CardTitle>
            <CardDescription>
              Track your interview preparation journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!feedbackSummaries ? (
              <div className="rounded-lg border bg-card p-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">Getting Started</h3>
                  <p className="text-sm text-muted-foreground">
                    Looks like you&apos;re just getting started! Kick off your
                    first mock interview now and start building your journey
                    toward success.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4 grid-cols-4">
                  {skillScores.map(({ name, score }) => (
                    <Card key={name}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-medium">{name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{score}/100</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <DataChart chartData={feedbackScores} />
              </>
            )}
          </CardContent>
        </Card>
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
      </div>
    </div>
  );
};

export default page;
