import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="w-3/5 mt-24 flex flex-col gap-8">
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

      <Card className="">
        <CardContent className="p-4 px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Role</h3>
              <p className="text-xl font-semibold">
                {interview.role ? interview.role : "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Company</h3>
              <p className="text-xl font-semibold">
                {interview.company ? interview.company : "N/A"}
              </p>
            </div>
            <div className="space-y-2 md:text-right">
              <h3 className="text-sm font-medium text-gray-500">
                Overall performance
              </h3>
              <div className="flex items-center justify-end gap-3">
                <p className="text-3xl font-bold">
                  {feedback.overallScore}/100
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-4">
        {feedback.categoryScores.map(({ name, score, comment }) => (
          <Card key={name}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-medium">{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{score}/100</div>
            </CardContent>
            <CardFooter className="text-gray-500">{comment}</CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
