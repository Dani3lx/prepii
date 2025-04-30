import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Link from "next/link";
import React from "react";

const page = async () => {
  const user = await getCurrentUser();

  const pastInterviews = false;
  return (
    <div className="flex items-center mt-24 w-3/5">
      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
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
            {!pastInterviews ? (
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-medium">Communication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">60/100</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-medium">
                      Problem Solving
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">60/100</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-medium">Cultural Fit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">60/100</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
