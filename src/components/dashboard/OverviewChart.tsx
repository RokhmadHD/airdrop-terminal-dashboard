// src/components/dashboard/OverviewChart.tsx
"use client";

import { NewUserStat } from "@/lib/types";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ChartConfig, ChartContainer } from "../ui/chart";

interface OverviewChartProps {
  data: NewUserStat[];
}

const chartConfig = {
    count: {
        label: "Count",
        color: "#60a5fa",
    },
} satisfies ChartConfig

export function OverviewChart({ data }: OverviewChartProps) {
    console.log(data)
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart data={data}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          allowDecimals={false}
        />
        <Tooltip
          cursor={{ fill: 'transparent' }}
          contentStyle={{
            background: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}