"use client";

import { isCuid } from "@paralleldrive/cuid2";
import {
  ChartDecreaseIcon,
  ChartIncreaseIcon,
  Cursor02Icon,
  LicenseIcon,
  Link02Icon,
  Megaphone01Icon,
  Notification02Icon,
  Search01Icon,
  SearchAreaIcon,
} from "hugeicons-react";
import { useRouter } from "next/navigation";
import Metrics from "~/app/_components/layouts/studio/shared/Metrics";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { ScrollArea } from "~/components/ui/scroll-area";
import { TrafficSource } from "~/generated/enums";
import { api } from "~/trpc/react";
import StoryAnalyticsInfo from "./StoryAnalyticsInfo";

const Analytics = ({ p }: { p?: string }) => {
  const router = useRouter();

  const { data, isLoading, error } = api.analytics.getOverallAnalytics.useQuery(
    {
      days: 30,
      specific: !!p ? (isCuid(p) ? p : undefined) : undefined,
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  // Traffic source icon and color mapping
  const trafficSourceConfig = {
    [TrafficSource.FEED]: {
      icon: LicenseIcon,
      label: "Feed",
      description: "Content recommended by algorithm",
      colorClasses: {
        bg: "bg-sky-50",
        border: "border-sky-300",
        text: "text-sky-600",
      },
    },
    [TrafficSource.DIRECT]: {
      icon: Cursor02Icon,
      label: "Direct",
      description: "Users visiting directly",
      colorClasses: {
        bg: "bg-gray-50",
        border: "border-gray-300",
        text: "text-gray-700",
      },
    },
    [TrafficSource.NOTIFICATION]: {
      icon: Notification02Icon,
      label: "Notification",
      description: "Push or in-app alerts",
      colorClasses: {
        bg: "bg-amber-50",
        border: "border-amber-300",
        text: "text-amber-600",
      },
    },
    [TrafficSource.ADVERTISEMENT]: {
      icon: Megaphone01Icon,
      label: "Advertisement",
      description: "Paid campaigns or promos",
      colorClasses: {
        bg: "bg-rose-50",
        border: "border-rose-300",
        text: "text-rose-600",
      },
    },
    [TrafficSource.SEARCH]: {
      icon: SearchAreaIcon,
      label: "Search",
      description: "Organic search traffic",
      colorClasses: {
        bg: "bg-green-50",
        border: "border-green-300",
        text: "text-green-600",
      },
    },
    [TrafficSource.REFERRAL]: {
      icon: Link02Icon,
      label: "Referral",
      description: "External links and mentions",
      colorClasses: {
        bg: "bg-violet-50",
        border: "border-violet-300",
        text: "text-violet-600",
      },
    },
  };

  // Rank badge colors
  const rankColors = [
    {
      bg: "bg-yellow-100",
      border: "border-yellow-300",
      text: "text-yellow-700",
    },
    { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-700" },
    {
      bg: "bg-orange-100",
      border: "border-orange-300",
      text: "text-orange-700",
    },
  ];

  if (isLoading) {
    return (
      <main className="px-4 sm:px-6 pb-6">
        <Metrics singleStory={p} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="rounded-md border bg-white border-border shadow-sm h-96 animate-pulse" />
          <div className="rounded-md border bg-white border-border shadow-sm h-96 animate-pulse" />
        </div>
      </main>
    );
  }

  if (error || !data) {
    if (error?.message === "Story not found") {
      router.push("/studio/analytics");
      return <>Redirecting...</>;
    }

    return (
      <main className="px-4 sm:px-6 pb-6">
        <Metrics singleStory={p} />
        <div className="text-center py-12">
          <p className="text-red-600">Failed to load analytics data</p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 sm:px-6 pb-6">
      {p && <StoryAnalyticsInfo info={data.storyInfo!} />}

      <Metrics singleStory={p} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <section className="rounded-md border bg-white border-border shadow-sm">
          <div className="border-b border-border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Traffic Sources
              </h2>
              <Badge variant="secondary" className="text-xs">
                Last {data.period.days} days
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Where your readers are coming from
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            <ScrollArea className="w-full h-[350px] pr-3" type="auto">
              <div className="space-y-4">
                {data.trafficSources
                  .sort((a, b) => b.percentage - a.percentage)
                  .map((source) => {
                    const config = trafficSourceConfig[source.source];

                    const Icon = config.icon;

                    return (
                      <div key={source.source} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 border ${config.colorClasses.border} ${config.colorClasses.bg} rounded-lg`}
                            >
                              <Icon
                                className={`h-4 w-4 ${config.colorClasses.text}`}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {config.label}
                              </p>
                              <p className="text-xs text-slate-500">
                                {config.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-700 font-bold text-lg">
                              {source.percentage}%
                            </p>
                            <div
                              className={`flex items-center gap-1 text-xs ${
                                source.isIncreasing
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {source.isIncreasing ? (
                                <ChartIncreaseIcon className="h-3 w-3" />
                              ) : (
                                <ChartDecreaseIcon className="h-3 w-3" />
                              )}
                              <span>
                                {source.isIncreasing ? "+" : ""}
                                {source.percentageChange}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <Progress
                          variant="info"
                          value={source.percentage}
                          className="h-2 rounded-full"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>{source.visits.toLocaleString()} visits</span>
                          <span>Avg. {source.avgReadTimeMinutes} min read</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </ScrollArea>

            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Total Traffic</span>
                <span className="font-bold text-slate-900">
                  {data.totalTraffic.toLocaleString()} visits
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-md border bg-white border-border shadow-sm">
          <div className="border-b border-border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Top Search Queries
              </h2>
              <Badge variant="secondary" className="text-xs">
                Last {data.period.days} days
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Most searched terms leading to your content
            </p>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {data.searchQueries.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Search01Icon className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No search queries recorded yet</p>
              </div>
            ) : (
              <>
                <ScrollArea className="w-full h-[350px] pr-3 " type="auto">
                  <div className="space-y-4">
                    {data.searchQueries
                      .sort((a, b) => b.percentage - a.percentage)
                      .slice(0, 3)
                      .map((query, index) => {
                        const rankColor = rankColors[index] || rankColors[2];

                        return (
                          <div key={query.query} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div
                                  className={`w-6 h-6 border ${rankColor?.border} ${rankColor?.bg} rounded-full flex items-center justify-center flex-shrink-0`}
                                >
                                  <span
                                    className={`text-xs font-bold ${rankColor?.text}`}
                                  >
                                    {index + 1}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-slate-800 font-semibold truncate">
                                    {query.query}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {query.categories}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0 ml-4">
                                <p className="text-slate-700 font-bold text-lg">
                                  {query.percentage}%
                                </p>
                                <div
                                  className={`flex items-center gap-1 text-xs ${
                                    query.isIncreasing
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {query.isIncreasing ? (
                                    <ChartIncreaseIcon className="h-3 w-3" />
                                  ) : (
                                    <ChartDecreaseIcon className="h-3 w-3" />
                                  )}
                                  <span>
                                    {query.isIncreasing ? "+" : ""}
                                    {query.percentageChange}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Progress
                              variant="info"
                              value={query.percentage}
                              className="h-2 rounded-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>
                                {query.searches.toLocaleString()} searches
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </ScrollArea>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-sm">
                  <span className="text-slate-600">Total Searches</span>
                  <span className="font-bold text-slate-900">
                    {data.totalSearches.toLocaleString()} searches
                  </span>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Analytics;
