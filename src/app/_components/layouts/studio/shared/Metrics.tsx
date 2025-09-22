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
    data: 0 as number,
    per: 3,
    d: 4,
    tooltipDescription:
      "The number of times viewers watched your videos in the selected date range.",
  },
  {
    label: "profile_views",
    title: "Profile Views",
    data: 0 as number,
    per: 3,
    d: 4,
    tooltipDescription:
      "The number of times your profile was viewed in the selected date range.",
  },
  {
    label: "likes",
    title: "Likes",
    data: 0 as number,
    per: 3,
    d: 4,
    tooltipDescription:
      "The number of likes your videos received in the selected date range.",
  },
  {
    label: "reviews",
    title: "Reviews",
    data: 0 as number,
    per: 0,
    d: 0,
    tooltipDescription:
      "The number of comments your videos received in the selected date range.",
  },
  {
    label: "shares",
    title: "Shares",
    data: 0 as number,
    per: 3,
    d: 4,
    tooltipDescription:
      "The number of shares your videos reveived in the selected date range.",
  },
] as const;

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "January", desktop: 86 },
  { month: "February", desktop: 7 },
  { month: "March", desktop: 37 },
  { month: "April", desktop: 3 },
  { month: "May", desktop: 9 },
  { month: "June", desktop: 14 },
  { month: "July", desktop: 14 },
];

export const m = METRICS.map((e) => e.label);
export type TAB_ENUM = (typeof m)[number];

const Metrics = () => {
  const { isLoading, data } = useProfileAnalytics();

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
                          return data?.analytics?.workViews ?? 0;
                        case "profile_views":
                          return data?.followersCount ?? 0;
                        case "likes":
                          return data?.analytics?.likes ?? 0;
                        case "reviews":
                          return data?.analytics?.reviews ?? 0;
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
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
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
              <p className="text-slate-600 font-bold text-xs sm:text-sm lg:text-base">
                {metrics.per || "-"}({metrics.d || "-"})
              </p>
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
