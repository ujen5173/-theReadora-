import { TrafficSource, type StoryStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  addDays,
  addMonths,
  format,
  isAfter,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

function generateDateBuckets(start: Date, end: Date, type: "day" | "month") {
  const buckets: string[] = [];
  let current = type === "day" ? startOfDay(start) : startOfMonth(start);
  const formatter =
    type === "day"
      ? (d: Date) => format(d, "yyyy-MM-dd")
      : (d: Date) => format(d, "yyyy-MM");

  while (!isAfter(current, end)) {
    buckets.push(formatter(current));
    current = type === "day" ? addDays(current, 1) : addMonths(current, 1);
  }
  return buckets;
}

function mapMetricToChartData(
  buckets: string[],
  stats: {
    date: Date;
    totalViews?: number;
    profileViews?: number;
    uniqueReaders?: number;
    avgReadTime?: number;
  }[],
  metric: "totalViews" | "uniqueReaders" | "avgReadTime" | "profileViews",
  type: "day" | "month"
) {
  const statMap = new Map<string, (typeof stats)[0]>();
  stats.forEach((stat) => {
    const key =
      type === "day"
        ? format(stat.date, "yyyy-MM-dd")
        : format(stat.date, "yyyy-MM");
    statMap.set(key, stat);
  });

  return buckets.map((bucket) => ({
    date: bucket,
    value: statMap.get(bucket)?.[metric] ?? 0,
  }));
}

// Helper function to calculate percentage changes
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

// Helper function to get date range
function getDateRange(days: number) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const previousEndDate = new Date(startDate);
  previousEndDate.setDate(previousEndDate.getDate() - 1);
  const previousStartDate = new Date(previousEndDate);
  previousStartDate.setDate(previousStartDate.getDate() - days);

  return {
    current: { start: startDate, end: endDate },
    previous: { start: previousStartDate, end: previousEndDate },
  };
}

// Helper function to extract categories from search query
// You should enhance this based on your actual category system
function extractCategories(query: string): string {
  const lowerQuery = query.toLowerCase();
  const categories: string[] = [];

  // Basic category detection
  if (lowerQuery.includes("romance")) categories.push("Romance");
  if (lowerQuery.includes("drama")) categories.push("Drama");
  if (lowerQuery.includes("nsfw") || lowerQuery.includes("adult"))
    categories.push("Mature");
  if (lowerQuery.includes("contemporary")) categories.push("Contemporary");

  return categories.length > 0 ? categories.join(" • ") : "General";
}

export const analyticsRouter = createTRPCRouter({
  // TODO: fix the analytics, currently there is no raw array of data of each day.
  getProfileAnalytics: protectedProcedure
    .input(
      z
        .object({
          range: z.enum(["24h", "7d", "30d", "3m", "12m", "24m"]),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        // Gather base info
        const base = await ctx.postgresDb.user.findFirst({
          where: { id: userId },
          select: {
            followersCount: true,
            followingCount: true,
            name: true,
            image: true,
            stories: { select: { id: true } },
          },
        });

        if (!base) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        const storyIds = base.stories.map((s) => s.id);

        const now = new Date();
        const selected = input?.range ?? "7d";
        const rangeToMs = (range: typeof selected) => {
          switch (range) {
            case "24h":
              return 24 * 60 * 60 * 1000;
            case "7d":
              return 7 * 24 * 60 * 60 * 1000;
            case "30d":
              return 30 * 24 * 60 * 60 * 1000;
            case "3m":
              return 90 * 24 * 60 * 60 * 1000; // approx
            case "12m":
              return 365 * 24 * 60 * 60 * 1000; // approx
            case "24m":
              return 730 * 24 * 60 * 60 * 1000; // approx
          }
        };

        const span = rangeToMs(selected);
        const start = new Date(now.getTime() - span);
        const prevStart = new Date(now.getTime() - 2 * span);
        const prevEnd = start;

        // Story views (StoryDailyStats) - last n days vs previous n days
        const [recentStats, prevStats] = await Promise.all([
          ctx.postgresDb.storyDailyStats.findMany({
            where: {
              storyId: { in: storyIds },
              date: { gte: start, lte: now },
            },
            select: {
              totalViews: true,
              uniqueReaders: true,
              avgReadTime: true,
              createdAt: true,
            },
          }),
          ctx.postgresDb.storyDailyStats.findMany({
            where: {
              storyId: { in: storyIds },
              date: { gte: prevStart, lte: prevEnd },
            },
            select: {
              totalViews: true,
              uniqueReaders: true,
              avgReadTime: true,
            },
          }),
        ]);

        const sumViews = (arr: { totalViews: number }[]) =>
          arr.reduce((s, x) => s + (x.totalViews || 0), 0);
        const sumUnique = (arr: { uniqueReaders: number }[]) =>
          arr.reduce((s, x) => s + (x.uniqueReaders || 0), 0);
        const avgRead = (arr: { avgReadTime: number }[]) =>
          arr.length === 0
            ? 0
            : Math.round(
                arr.reduce((s, x) => s + (x.avgReadTime || 0), 0) / arr.length
              );

        // Profile views - last n vs previous n
        const [recentProfileViews, prevProfileViews] = await Promise.all([
          ctx.postgresDb.profileViews.findMany({
            where: {
              viewedUserId: userId,
              createdAt: { gte: start, lte: now },
            },
            select: {
              createdAt: true,
            },
          }),
          ctx.postgresDb.profileViews.findMany({
            where: {
              viewedUserId: userId,
              createdAt: { gte: prevStart, lte: prevEnd },
            },
          }),
        ]);

        const recentViews = sumViews(recentStats);
        const prevViews = sumViews(prevStats);
        const recentUnique = sumUnique(recentStats);
        const prevUnique = sumUnique(prevStats);
        const recentAvgRead = avgRead(recentStats);
        const prevAvgRead = avgRead(prevStats);

        const recentProfileViewsData = sumViews(
          recentProfileViews.map((e, idx) => ({
            totalViews: idx + 1,
          }))
        );
        const prevProfileViewsData = sumViews(
          recentProfileViews.map((e, idx) => ({
            totalViews: idx + 1,
          }))
        );

        const pct = (curr: number, prev: number) => {
          if (prev === 0) return curr > 0 ? 100 : 0;
          return Math.round(((curr - prev) / prev) * 100);
        };

        // Determine bucket type
        const bucketType = ["12m", "24m"].includes(selected) ? "month" : "day";
        const buckets = generateDateBuckets(start, now, bucketType);

        // Create chartData for each metric
        const novelViewsChartData = mapMetricToChartData(
          buckets,
          recentStats.map(({ createdAt, ...rest }) => ({
            ...rest,
            date: createdAt,
          })),
          "totalViews",
          bucketType
        );
        const uniqueReadersChartData = mapMetricToChartData(
          buckets,
          recentStats.map(({ createdAt, ...rest }) => ({
            ...rest,
            date: createdAt,
          })),
          "uniqueReaders",
          bucketType
        );
        const avgReadTimeChartData = mapMetricToChartData(
          buckets,
          recentStats.map(({ createdAt, ...rest }) => ({
            ...rest,
            date: createdAt,
          })),
          "avgReadTime",
          bucketType
        );
        const profileViewsChartData = mapMetricToChartData(
          buckets,
          recentProfileViews.map(({ createdAt }, index) => ({
            profileViews: index + 1,
            date: createdAt,
          })),
          "profileViews",
          bucketType
        );

        return {
          followersCount: base.followersCount,
          followingCount: base.followingCount,
          name: base.name,
          image: base.image,
          totalStories: storyIds.length,
          metrics: {
            novelViews: {
              value: recentViews,
              delta: pct(recentViews, prevViews),
              thisMonthRawData: recentViews,
              chartData: novelViewsChartData,
            },
            uniqueReaders: {
              value: recentUnique,
              delta: pct(recentUnique, prevUnique),
              thisMonthRawData: recentUnique,
              chartData: uniqueReadersChartData,
            },
            avgReadTimeSeconds: {
              value: recentAvgRead,
              delta: pct(recentAvgRead, prevAvgRead),
              thisMonthRawData: recentAvgRead,
              chartData: avgReadTimeChartData,
            },
            profileViews: {
              value: recentProfileViewsData,
              delta: pct(recentProfileViewsData, prevProfileViewsData),
              thisMonthRawData: recentProfileViewsData,
              chartData: profileViewsChartData,
            },

            _range: selected,
          },
        };
      } catch (err) {
        console.log({ err });
        if (err instanceof TRPCError) throw err;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong!",
        });
      }
    }),

  getOverallAnalytics: protectedProcedure
    .input(
      z.object({
        days: z.number().default(30), // Number of days to analyze
        specific: z.string().cuid().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { days, specific } = input;
        const dateRange = getDateRange(days);

        let story: {
          id: string;
          thumbnail: string;
          title: string;
          slug: string;
          createdAt: Date;
          updatedAt: Date;
          genreSlug: string;
          storyStatus: StoryStatus;
          readingTime: number;
          readCount: number;
          isCompleted: boolean;
          ratingCount: number;
          averageRating: number;
          chapterCount: number;
        } | null = null;

        if (specific) {
          story =
            (await ctx.postgresDb.story.findUnique({
              where: {
                id: specific,
              },
              select: {
                id: true,
                thumbnail: true,
                title: true,
                slug: true,
                createdAt: true,
                updatedAt: true,
                genreSlug: true,
                storyStatus: true,
                readingTime: true,
                readCount: true,
                isCompleted: true,
                ratingCount: true,
                averageRating: true,
                chapterCount: true,
              },
            })) ?? null;

          if (!story) {
            throw new TRPCError({
              message: "Story not found",
              code: "NOT_FOUND",
            });
          }
        }

        // Build base where clause
        const baseWhere = {
          chapter: {
            story: {
              authorId: ctx.session.user.id,
              ...(specific
                ? {
                    id: specific,
                  }
                : {}),
            },
          },
          trafficSource: { not: undefined },
        };

        // 1. Get Traffic Sources Data
        const [currentTrafficData, previousTrafficData] = await Promise.all([
          // Current period traffic sources
          ctx.postgresDb.readEvent.groupBy({
            by: ["trafficSource"],
            where: {
              ...baseWhere,

              createdAt: {
                gte: dateRange.current.start,
                lte: dateRange.current.end,
              },
            },
            _count: { id: true },
            _sum: { readTime: true },
          }),
          // Previous period traffic sources (for comparison)
          ctx.postgresDb.readEvent.groupBy({
            by: ["trafficSource"],
            where: {
              ...baseWhere,
              createdAt: {
                gte: dateRange.previous.start,
                lte: dateRange.previous.end,
              },
            },
            _count: { id: true },
          }),
        ]);

        // Calculate total visits for percentage calculation
        const totalCurrentVisits = currentTrafficData.reduce(
          (sum, item) => sum + item._count.id,
          0
        );

        // Create a map for previous data for easy lookup
        const previousDataMap = new Map(
          previousTrafficData.map((item) => [
            item.trafficSource,
            item._count.id,
          ])
        );

        // Process traffic sources
        const trafficSources = currentTrafficData.map((item) => {
          const visits = item._count.id;
          const percentage =
            totalCurrentVisits > 0
              ? Number(((visits / totalCurrentVisits) * 100).toFixed(1))
              : 0;
          const previousVisits = previousDataMap.get(item.trafficSource) || 0;
          const percentageChange = calculatePercentageChange(
            visits,
            previousVisits
          );
          const avgReadTimeMinutes = item._sum.readTime
            ? Number((item._sum.readTime / visits / 60).toFixed(1))
            : 0;

          return {
            source: item.trafficSource,
            visits,
            percentage,
            percentageChange,
            avgReadTimeMinutes,
            isIncreasing: percentageChange >= 0,
          };
        });

        // Ensure all traffic sources are present, even with 0 visits
        const allSources = [
          TrafficSource.DIRECT,
          TrafficSource.SEARCH,
          TrafficSource.REFERRAL,
          TrafficSource.NOTIFICATION,
          TrafficSource.ADVERTISEMENT,
          TrafficSource.FEED,
        ];

        const trafficSourcesComplete = allSources.map((source) => {
          const existing = trafficSources.find((ts) => ts.source === source);
          return (
            existing || {
              source,
              visits: 0,
              percentage: 0,
              percentageChange: 0,
              avgReadTimeMinutes: 0,
              isIncreasing: false,
            }
          );
        });

        // 2. Get Top Search Queries
        const searchQueriesData = await ctx.postgresDb.readEvent.groupBy({
          by: ["searchQuery"],
          where: {
            chapter: {
              story: {
                authorId: ctx.session.user.id,
                ...(specific
                  ? {
                      id: specific,
                    }
                  : {}),
              },
            },
            OR: [
              {
                searchQuery: {
                  not: undefined,
                },
              },
              {
                searchQuery: {
                  not: "",
                },
              },
            ],
            createdAt: {
              gte: dateRange.current.start,
              lte: dateRange.current.end,
            },
          },
          _count: { id: true },
        });

        // Get previous period search data for comparison
        const previousSearchData = await ctx.postgresDb.readEvent.groupBy({
          by: ["searchQuery"],
          where: {
            chapter: {
              story: {
                authorId: ctx.session.user.id,
                ...(specific
                  ? {
                      id: specific,
                    }
                  : {}),
              },
            },
            OR: [
              {
                searchQuery: {
                  not: undefined,
                },
              },
              {
                searchQuery: {
                  not: "",
                },
              },
            ],
            createdAt: {
              gte: dateRange.previous.start,
              lte: dateRange.previous.end,
            },
          },
          _count: { id: true },
        });

        const previousSearchMap = new Map(
          previousSearchData.map((item) => [item.searchQuery, item._count.id])
        );

        const totalSearches = searchQueriesData.reduce(
          (sum, item) => sum + item._count.id,
          0
        );

        // Process and sort search queries
        const topSearchQueries = searchQueriesData
          .map((item) => {
            const searches = item._count.id;
            const percentage =
              totalSearches > 0
                ? Number(((searches / totalSearches) * 100).toFixed(1))
                : 0;
            const previousSearches =
              previousSearchMap.get(item.searchQuery!) || 0;
            const percentageChange = calculatePercentageChange(
              searches,
              previousSearches
            );

            // Extract category/tags from query (basic implementation)
            // You might want to enhance this with actual category mapping
            const categories = extractCategories(item.searchQuery!);

            return {
              query: item.searchQuery!,
              searches,
              percentage,
              percentageChange,
              isIncreasing: percentageChange >= 0,
              categories,
            };
          })
          .sort((a, b) => b.searches - a.searches)
          .slice(0, 10); // Top 10 queries

        return {
          trafficSources: trafficSourcesComplete,
          totalTraffic: totalCurrentVisits,
          searchQueries: topSearchQueries,
          totalSearches,
          storyInfo: story,
          period: {
            days,
            startDate: dateRange.current.start,
            endDate: dateRange.current.end,
          },
        };
      } catch (err) {
        console.error({ err });

        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          message: "Failed to fetch analytics data",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
