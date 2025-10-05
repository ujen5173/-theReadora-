"use client";

import { ArrowRight01Icon } from "hugeicons-react";
import Link from "next/link";
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
  console.log({ data });

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

  const getMetricPair = (
    label: TAB_ENUM
  ): { current: number; delta: number } => {
    switch (label) {
      case "novel_views":
        return {
          current: data?.metrics.novelViews.value ?? 0,
          delta: data?.metrics.novelViews.delta ?? 0,
        };
      case "profile_views":
        return {
          current: data?.metrics.profileViews.value ?? 0,
          delta: data?.metrics.profileViews.delta ?? 0,
        };
      case "retention":
        return {
          current: data?.metrics.retention.value ?? 0,
          delta: data?.metrics.retention.delta ?? 0,
        };
      case "unique_readers":
        return {
          current: data?.metrics.uniqueReaders?.value ?? 0,
          delta: data?.metrics.uniqueReaders?.delta ?? 0,
        };
      case "avg_read_time":
        return {
          current: data?.metrics.avgReadTimeSeconds?.value ?? 0,
          delta: data?.metrics.avgReadTimeSeconds?.delta ?? 0,
        };
      default:
        return { current: 0, delta: 0 };
    }
  };

  const derivePrev = (current: number, delta: number): number => {
    // delta = ((current - prev)/prev)*100 => prev = current / (1 + delta/100)
    if (!isFinite(current) || !isFinite(delta)) return 0;
    const denom = 1 + delta / 100;
    if (denom === 0) return 0;
    if (denom < 0) return 0;
    const prev = current / denom;
    return Number.isFinite(prev) ? Math.max(0, Math.round(prev)) : 0;
  };

  const { current, delta } = getMetricPair(activeTab);
  const prev = derivePrev(current, delta);
  const chartData = [
    { period: "Prev 7d", desktop: prev },
    { period: "Last 7d", desktop: current },
  ];

  return (
    <section className="space-y-4 py-4 sm:py-8">
      <div>
        <Link
          className="inline-block"
          href="/studio/analytics?activeAnalyticsMetric=views"
        >
          <h6 className="text-sm sm:text-base font-bold flex items-center gap-1.5">
            Key metrics <ArrowRight01Icon size="16" strokeWidth={2} />
          </h6>
        </Link>
      </div>

      <div className="rounded-md border border-border shadow bg-white">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div />
          <select
            className="text-sm border rounded px-2 py-1"
            value={range}
            onChange={(e) => setRange(e.target.value as typeof range)}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="3m">Last 3 Months</option>
            <option value="12m">Last 12 Months</option>
            <option value="24m">Last 24 Months</option>
          </select>
        </div>
        <div>
          <ScrollArea className="h-[125px] w-full whitespace-nowrap">
            <div className="flex w-full">
              {METRICS.map((val, idx) => (
                <TabTriggerButton
                  idx={idx}
                  key={val.label}
                  metrics={{
                    ...val,
                    data: (() => {
                      switch (val.label) {
                        case "novel_views":
                          return data?.metrics.novelViews.value ?? 0;
                        case "profile_views":
                          return data?.metrics.profileViews.value ?? 0;
                        case "retention":
                          return data?.metrics.retention.value ?? 0;
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
                        case "retention":
                          return data?.metrics.retention.delta ?? 0;
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
          <ChartContainer className="h-full w-full" config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
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
  activeTab,
  setActiveTab,
}: {
  metrics: (typeof METRICS)[number];
  idx: number;
  activeTab: TAB_ENUM;
  setActiveTab: React.Dispatch<React.SetStateAction<TAB_ENUM>>;
}) => {
  console.log({ metrics });
  const router = useRouter();

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
                  {metrics.delta}% vs prev 7d
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
