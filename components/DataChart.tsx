"use client";

import { CartesianGrid, XAxis, YAxis, Area, AreaChart } from "recharts";

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

export function DataChart({ chartData }: { chartData: FeedbackScore[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Overtime</CardTitle>
        <CardDescription>
          Scores for the last {chartData?.length} attempts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] max-h-[400px] w-full"
        >
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis hide dataKey="attempt" tickLine={false} axisLine={false} />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
              className="-translate-x-4"
              domain={[0, 100]}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />

            <Area
              dataKey="communication"
              type="natural"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={true}
              fill="var(--color-chart-1)"
              fillOpacity={0.1}
            />
            <Area
              dataKey="problemSolving"
              type="natural"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              dot={true}
              fill="var(--color-chart-2)"
              fillOpacity={0.1}
            />
            <Area
              dataKey="culturalFit"
              type="natural"
              stroke="var(--color-chart-3)"
              strokeWidth={2}
              dot={true}
              fill="var(--color-chart-3)"
              fillOpacity={0.1}
            />
            <Area
              dataKey="clarity"
              type="natural"
              stroke="var(--color-chart-4)"
              strokeWidth={2}
              dot={true}
              fill="var(--color-chart-4)"
              fillOpacity={0.1}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
