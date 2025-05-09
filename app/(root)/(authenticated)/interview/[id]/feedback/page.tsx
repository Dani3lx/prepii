import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getFeedbackByInterviewId } from "@/lib/actions/feedback.action";
import { getInterviewById } from "@/lib/actions/interview.action";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const [interview, feedback] = await Promise.all([
    getInterviewById(id),
    getFeedbackByInterviewId(id),
  ]);
  if (!feedback || !interview) redirect("/");
  return (
    <div className="container px-8 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-1">Feedback</h1>
          <p className="text-gray-500">
            Performance review and feedback summary
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard">Return to dashboard</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">Overall Performance</CardTitle>
            <CardDescription>
              Summary of your performance review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-md text-gray-700">
            <div className="flex gap-2">
              <span className="font-semibold">Company:</span>
              <span>{interview.company || "N/A"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Role:</span>
              <span>{interview.role || "N/A"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Score:</span>
              <span>{feedback.overallScore}/100</span>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-2xl">Performance Breakdown</CardTitle>
            <CardDescription>Scores by category</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            {feedback.categoryScores.map(({ name, score }) => (
              <div key={name}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{name}</span>
                    <span className="text-sm font-bold">{score}/100</span>
                  </div>
                  <Progress value={70} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {feedback.categoryScores.map(({ name, score, comment }) => (
          <Card key={name}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-medium">{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{score}/100</div>
            </CardContent>
            <CardFooter className="text-gray-500 max-md:text-sm">
              {comment}
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex gap-2">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Areas for improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700">
              {feedback.areasForImprovement.map((improvement, index) => (
                <li key={index} className="flex gap-2">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />{" "}
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
