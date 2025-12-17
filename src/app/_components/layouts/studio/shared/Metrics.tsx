"use client";

import { ArrowRight01Icon, LockPasswordIcon } from "hugeicons-react";
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
import { useUserStore } from "~/store/userStore";

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

// Types
export const m = METRICS.map((e) => e.label);
export type TAB_ENUM = (typeof m)[number];
export type DateRangeType = "24h" | "7d" | "30d" | "3m" | "12m" | "24m";

const Metrics = () => {
  const [range, setRange] = useState<DateRangeType>("30d");
  const { data } = useProfileAnalytics(range);
  const { user } = useUserStore();

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 gap-3 sm:gap-0">
          <div />
          <Select
            value={range}
            onValueChange={(value) => setRange(value as DateRangeType)}
          >
            <SelectTrigger className="text-sm border w-full sm:w-[180px] rounded px-2 py-1">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent align="end" className="w-[180px]">
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="3m" disabled={!user?.premium}>
                <div className="flex justify-between items-center w-full">
                  <span>Last 3 Months</span>
                  <LockPasswordIcon className="size-4 text-slate-700" />
                </div>
              </SelectItem>
              <SelectItem value="12m" disabled={!user?.premium}>
                <div className="flex justify-between items-center w-full">
                  <span>Last 12 Months</span>
                  <LockPasswordIcon className="size-4 text-slate-700" />
                </div>
              </SelectItem>
              <SelectItem value="24m" disabled={!user?.premium}>
                <div className="flex justify-between items-center w-full">
                  <span>Last 24 Months</span>
                  <LockPasswordIcon className="size-4 text-slate-700" />
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full">
          <div className="overflow-x-auto overflow-y-hidden flex custom-scroll max-h-[125px] w-full">
            {METRICS.map((val, idx) => (
              <div key={val.label} className="flex-shrink-0">
                <TabTriggerButton
                  idx={idx}
                  range={range}
                  metrics={{
                    ...val,
                    data: (() => {
                      switch (val.label) {
                        case "novel_views":
                          return data?.metrics.novelViews.value ?? 0;
                        case "profile_views":
                          return data?.metrics.profileViews.value ?? 0;
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
              </div>
            ))}
          </div>
        </div>

        <div className="h-64 sm:h-80 w-full">
          <ChartContainer
            className="h-full w-full aspect-auto"
            config={
              {
                [activeTab]: {
                  label:
                    METRICS.find((m) => m.label === activeTab)?.title ??
                    activeTab,
                  color: "var(--chart-1)",
                },
              } satisfies ChartConfig
            }
          >
            <AreaChart
              accessibilityLayer
              data={
                (getActiveChartData() ?? []).map((d: any) => ({
                  period: d.date,
                  [activeTab]: d.value,
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
                dataKey={activeTab}
                type="linear"
                fill={`var(--color-${activeTab})`}
                fillOpacity={0.1}
                stroke={`var(--color-${activeTab})`}
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

// Helper component for metric tabs
interface TabTriggerButtonProps {
  metrics: (typeof METRICS)[number];
  idx: number;
  range: DateRangeType;
  activeTab: TAB_ENUM;
  setActiveTab: React.Dispatch<React.SetStateAction<TAB_ENUM>>;
}

const TabTriggerButton = ({
  metrics,
  idx,
  range,
  activeTab,
  setActiveTab,
}: TabTriggerButtonProps) => {
  const router = useRouter();

  const refactorRange = (r: DateRangeType) => {
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
      <TooltipTrigger className="block w-[10rem] sm:w-[12rem] lg:w-[15rem]">
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
