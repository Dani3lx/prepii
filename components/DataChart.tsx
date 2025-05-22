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
    <Card className="col-span-3">
      <CardHeader className="relative">
        <CardTitle className="text-2xl">Progress Over Time</CardTitle>
        <CardDescription>
          Your performance across the last {chartData?.length} attempts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px] max-h-[400px] w-full"
        >
          <AreaChart accessibilityLayer data={chartData}>
            <defs>
              <linearGradient id="fill-1" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fill-2" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-2)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fill-3" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-3)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-3)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fill-4" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-4)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-4)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis hide dataKey="attempt" tickLine={false} axisLine={false} />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
              domain={[0, 100]}
              allowDataOverflow={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend
              className="max-sm:hidden"
              content={<ChartLegendContent />}
            />

            <Area
              dataKey="communication"
              type="natural"
              fill="url(#fill-1)"
              stroke="var(--color-chart-1)"
              stackId="a"
              fillOpacity={0.3}
            />
            <Area
              dataKey="problemSolving"
              type="natural"
              fill="url(#fill-2)"
              stroke="var(--color-chart-2)"
              stackId="b"
              fillOpacity={0.3}
            />
            <Area
              dataKey="culturalFit"
              type="natural"
              fill="url(#fill-3)"
              stroke="var(--color-chart-3)"
              stackId="c"
              fillOpacity={0.3}
            />
            <Area
              dataKey="clarity"
              type="natural"
              fill="url(#fill-4)"
              stroke="var(--color-chart-4)"
              stackId="d"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
