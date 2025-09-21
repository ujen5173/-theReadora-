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
    data: 0,
    per: 3,
    d: 4,
    tooltipDescription:
      "The number of times viewers watched your videos in the selected date range.",
  },
  {
    label: "profile_views",
    title: "Profile Views",
    data: 423,
    per: 3,
    d: 4,
    tooltipDescription:
      "The number of times your profile was viewed in the selected date range.",
  },
  {
    label: "likes",
    title: "Likes",
    data: 0,
    per: 3,
    d: 4,
    tooltipDescription:
      "The number of likes your videos received in the selected date range.",
  },
  {
    label: "reviews",
    title: "Reviews",
    data: 0,
    per: 0,
    d: 0,
    tooltipDescription:
      "The number of comments your videos received in the selected date range.",
  },
  {
    label: "shares",
    title: "Shares",
    data: 0,
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
    <section className="space-y-4 py-8">
      <div>
        <Link
          className="inline-block"
          href="/studio/analytics?activeAnalyticsMetric=views"
        >
          <h6 className="text-base font-bold flex items-center gap-1.5">
            Key metrics <ArrowRight01Icon size="16" strokeWidth={2} />
          </h6>
        </Link>
      </div>

      <div className="rounded-md overflow-x-auto border border-border shadow bg-white">
        <div className="grid grid-cols-5 w-full min-w-max">
          {METRICS.map((val, idx) => (
            <TabTriggerButton
              idx={idx}
              key={val.label}
              metrics={{
                ...val,
                data:
                  val.label === "novel_views"
                    ? data?.analytics?.totals?.views ?? 0
                    : val.label === "profile_views"
                    ? data?.followersCount ?? 0
                    : val.label === "likes"
                    ? data?.analytics?.totals?.likes ?? 0
                    : val.label === "reviews"
                    ? data?.analytics?.totals?.reviews ?? 0
                    : 0,
              }}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          ))}
        </div>
        <div className="h-80 w-full">
          <ChartContainer className="h-full w-full" config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={
                data?.analytics?.monthlyActiveReaders?.map((d) => ({
                  month: d.month,
                  desktop: d.value,
                })) ?? chartData
              }
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
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

  console.log({ activeTab, lb: metrics.label });

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="min-w-[15rem]">
          <div className="flex w-full">
            <div
              role="button"
              onClick={() => {
                setActiveTab(metrics.label as TAB_ENUM);
                router.push(`?activeAnalyticsMetric=${metrics.label}`);
              }}
              className={cn(
                "w-full flex border-t-4 cursor-pointer border-transparent flex-col p-4 space-y-2 items-center",
                activeTab === metrics.label
                  ? "border-t-blue-500"
                  : "hover:border-t-slate-200",
                "border-b border-b-slate-200 "
              )}
            >
              <h4 className="text-base font-bold text-slate-900">
                {metrics.title}
              </h4>
              <p className="text-blue-500 font-bold text-base">
                {metrics.data || "-"}
              </p>
              <p className="text-slate-600 font-bold text-base">
                {metrics.per || "-"}({metrics.d || "-"})
              </p>
            </div>
            {idx !== METRICS.length - 1 && (
              <Separator
                orientation="vertical"
                className="h-[auto!important]"
              />
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        variant="outline"
        className="p-4 max-w-2xs font-medium text-slate-700 text-sm leading-snug text-center"
      >
        <p>{metrics.tooltipDescription}</p>
      </TooltipContent>
    </Tooltip>
  );
};
