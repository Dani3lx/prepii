"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  communication: {
    label: "Communication Skills",
    color: "#2563eb",
  },
  problemSolving: {
    label: "Problem Solving",
    color: "#4f46e5",
  },
  culturalFit: {
    label: "Cultural Fit",
    color: "#6366f1",
  },
  clarity: {
    label: "Clarity and Structure",
    color: "#818cf8",
  },
} satisfies ChartConfig;

export function DataChart({ data }: { data: FeedbackSummary[] }) {
  const chartData: FeedbackScore[] = [];
  data.map((feedbackSummary, index) => {
    const feedbackScore: FeedbackScore = {
      attempt: `${index + 1}`,
      communication: feedbackSummary.categoryScores[0].score,
      problemSolving: feedbackSummary.categoryScores[1].score,
      culturalFit: feedbackSummary.categoryScores[2].score,
      clarity: feedbackSummary.categoryScores[3].score,
    };
    chartData.push(feedbackScore);
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Overtime</CardTitle>
        <CardDescription>Last {data.length} attempts</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px]">
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis hide dataKey="attempt" tickLine={false} axisLine={false} />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
              domain={[0, 100]}
              className="-translate-x-4"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />

            <Line
              dataKey="communication"
              type="monotone"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="problemSolving"
              type="monotone"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="culturalFit"
              type="monotone"
              stroke="var(--color-chart-3)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="clarity"
              type="monotone"
              stroke="var(--color-chart-4)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
