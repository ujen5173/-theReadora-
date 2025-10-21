"use client";

import { ArrowRight01Icon } from "hugeicons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import useProfileAnalytics from "~/app/studio/hooks/useProfileAnalytics";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

export const METRICS = [
  {
    label: "novel_views",
    title: "Novel Views",
    delta: 0,
    data: 0,
    value: 0,
    tooltipDescription:
      "The number of times viewers watched your videos in the selected date range.",
  },
  {
    label: "profile_views",
    title: "Profile Views",
    delta: 0,
    data: 0,
    value: 0,
    tooltipDescription:
      "The number of times your profile was viewed in the selected date range.",
  },

  {
    label: "retention",
    title: "Retention",
    delta: 0,
    data: 0,
    value: 0,
    tooltipDescription:
      "The percentage of readers who continue reading your stories, indicating how well you retain your audience over time.",
  },
  {
    label: "unique_readers",
    title: "Unique Readers",
    delta: 0,
    data: 0,
    value: 0,
    tooltipDescription:
      "Distinct readers that engaged with your stories in the selected period.",
  },
  {
    label: "avg_read_time",
    title: "Avg Read Time (s)",
    delta: 0,
    data: 0,
    value: 0,
    tooltipDescription:
      "Average time readers spent per day across your stories in seconds.",
  },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export const m = METRICS.map((e) => e.label);
export type TAB_ENUM = (typeof m)[number];

const Metrics = () => {
  const [range, setRange] = useState<
    "24h" | "7d" | "30d" | "3m" | "12m" | "24m"
  >("7d");

  const { isLoading, data } = useProfileAnalytics(range);

  const validateParams = (param: string): boolean => {
    return m.includes(param as TAB_ENUM);
  };

  const router = useRouter();

  const params = (useSearchParams().get("activeAnalyticsMetric") ??
    "novel_views") as TAB_ENUM;

  const [activeTab, setActiveTab] = useState<TAB_ENUM>(
    validateParams(params)
      ? params
      : ((() => {
          router.push(`?activeAnalyticsMetric=${m[0]}`);
          return m[0];
        })() as TAB_ENUM)
  );

  // Helper to get the correct chartData for the active metric
  const getActiveChartData = () => {
    if (!data) return [];
    switch (activeTab) {
      case "novel_views":
        return data.metrics.novelViews.chartData;
      case "profile_views":
        return data.metrics.profileViews.chartData;
      // case "retention":
      //   return data.metrics.retention.chartData;
      case "unique_readers":
        return data.metrics.uniqueReaders?.chartData;
      case "avg_read_time":
        return data.metrics.avgReadTimeSeconds?.chartData;
      default:
        return [];
    }
  };

  return (
    <section className="space-y-4 py-4 sm:py-6">
      <div>
        <h6 className="text-sm sm:text-base font-bold flex items-center gap-1.5">
          Key metrics <ArrowRight01Icon size="16" strokeWidth={2} />
        </h6>
      </div>

      <div className="rounded-md border border-border shadow bg-white">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div />
          <Select
            value={range}
            onValueChange={(value) => setRange(value as typeof range)}
          >
            <SelectTrigger className="text-sm border rounded px-2 py-1">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="12m">Last 12 Months</SelectItem>
              <SelectItem value="24m">Last 24 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <ScrollArea className="h-[125px] w-full whitespace-nowrap">
            <div className="flex w-full">
              {METRICS.map((val, idx) => (
                <TabTriggerButton
                  idx={idx}
                  key={val.label}
                  range={range}
                  metrics={{
                    ...val,
                    data: (() => {
                      switch (val.label) {
                        case "novel_views":
                          return data?.metrics.novelViews.value ?? 0;
                        case "profile_views":
                          return data?.metrics.profileViews.value ?? 0;
                        // case "retention":
                        // return data?.metrics.retention.value ?? 0;
                        case "unique_readers":
                          return data?.metrics.uniqueReaders?.value ?? 0;
                        case "avg_read_time":
                          return data?.metrics.avgReadTimeSeconds?.value ?? 0;
                        default:
                          return 0;
                      }
                    })() as number,
                    delta: (() => {
                      switch (val.label) {
                        case "novel_views":
                          return data?.metrics.novelViews.delta ?? 0;
                        case "profile_views":
                          return data?.metrics.profileViews.delta ?? 0;
                        // case "retention":
                        //   return data?.metrics.retention.delta ?? 0;
                        case "unique_readers":
                          return data?.metrics.uniqueReaders?.delta ?? 0;
                        case "avg_read_time":
                          return data?.metrics.avgReadTimeSeconds?.delta ?? 0;
                        default:
                          return 0;
                      }
                    })() as number,
                  }}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              ))}
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <div className="h-64 sm:h-80 w-full">
          {/* Chart for the active metric */}
          <ChartContainer className="h-full w-full" config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={
                (getActiveChartData() ?? []).map((d: any) => ({
                  period: d.date,
                  desktop: d.value,
                })) as any[]
              }
              margin={{
                left: 8,
                right: 8,
                top: 8,
                bottom: 8,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value}
                fontSize={12}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" hideLabel />}
              />
              <Area
                dataKey="desktop"
                type="linear"
                fill="var(--color-desktop)"
                fillOpacity={0.1}
                stroke="var(--color-desktop)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>
    </section>
  );
};

export default Metrics;

const TabTriggerButton = ({
  metrics,
  idx,
  range = "7d",
  activeTab,
  setActiveTab,
}: {
  metrics: (typeof METRICS)[number];
  idx: number;
  range: "24h" | "7d" | "30d" | "3m" | "12m" | "24m";
  activeTab: TAB_ENUM;
  setActiveTab: React.Dispatch<React.SetStateAction<TAB_ENUM>>;
}) => {
  const router = useRouter();

  const refactorRange = (r: "24h" | "7d" | "30d" | "3m" | "12m" | "24m") => {
    const data = {
      h: "hour",
      d: "days",
      m: "months",
    };

    const match = r.match(/(\d+)([hdm])/);
    if (!match) return r;

    const [, value, unit] = match;
    return `${value} ${data[unit as keyof typeof data]}`;
  };

  return (
    <Tooltip>
      <TooltipTrigger className="flex-1 min-w-[10rem] sm:min-w-[12rem] lg:min-w-[15rem]">
        <div>
          <div className="flex w-full">
            <div
              role="button"
              onClick={() => {
                setActiveTab(metrics.label as TAB_ENUM);
                router.push(`?activeAnalyticsMetric=${metrics.label}`);
              }}
              className={cn(
                "w-full flex border-t-4 cursor-pointer border-transparent flex-col p-2 sm:p-3 lg:p-4 space-y-1 sm:space-y-2 items-center transition-colors",
                activeTab === metrics.label
                  ? "border-t-blue-500 bg-blue-50/30"
                  : "hover:border-t-slate-200 hover:bg-slate-50/50",
                "border-b border-b-slate-200"
              )}
            >
              <h4 className="text-xs sm:text-sm lg:text-base font-bold text-slate-900 text-center leading-tight">
                {metrics.title}
              </h4>
              <p className="text-blue-500 font-bold text-base sm:text-lg lg:text-xl">
                {metrics.data || "-"}
              </p>
              {typeof metrics.delta === "number" && (
                <p
                  className={cn(
                    "font-bold text-xs sm:text-sm lg:text-base",
                    (metrics.delta ?? 0) >= 0
                      ? "text-emerald-600"
                      : "text-rose-600"
                  )}
                >
                  {(metrics.delta ?? 0) >= 0 ? "+" : ""}
                  {metrics.delta}% vs prev {refactorRange(range)}
                </p>
              )}
            </div>
            {idx !== METRICS.length - 1 && (
              <Separator
                orientation="vertical"
                className="h-[auto!important] hidden sm:block"
              />
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        variant="outline"
        className="p-3 sm:p-4 max-w-2xs font-medium text-slate-700 text-xs sm:text-sm leading-snug text-center"
      >
        <p>{metrics.tooltipDescription}</p>
      </TooltipContent>
    </Tooltip>
  );
};
