import { type NextRequest } from "next/server";
import { postgresDb } from "~/server/postgresql";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log(`Processing stats for: ${yesterday.toISOString()}`);

    // Fetch all read events from yesterday
    const readEvents = await postgresDb.readEvent.findMany({
      where: {
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
      select: {
        id: true,
        userId: true,
        chapterId: true,
        readerKey: true,
        readTime: true,
        trafficSource: true,
        frequency: true,
        chapter: {
          select: {
            id: true,
            storyId: true,
            story: {
              select: {
                id: true,
                authorId: true,
              },
            },
          },
        },
      },
    });

    if (readEvents.length === 0) {
      console.log("No read events to process");
      return Response.json({ message: "No data to process", stats: null });
    }

    // Group data by story
    const storyGroups = new Map<
      string,
      {
        storyId: string;
        authorId: string;
        views: number;
        uniqueReaders: Set<string>;
        newReaders: Set<string>;
        returningReaders: Set<string>;
        totalReadTime: number;
        chaptersRead: Set<string>;
        readerChapterCount: Map<string, number>;
        trafficSources: { direct: number; search: number; referral: number };
      }
    >();

    // Get existing reader keys to determine new vs returning readers
    const allReaderKeys = [...new Set(readEvents.map((e) => e.readerKey))];
    const existingReaders = await postgresDb.readEvent.findMany({
      where: {
        readerKey: { in: allReaderKeys },
        createdAt: { lt: yesterday },
      },
      select: { readerKey: true },
      distinct: ["readerKey"],
    });
    const existingReaderKeys = new Set(existingReaders.map((r) => r.readerKey));

    // Process each read event
    for (const event of readEvents) {
      const { id: storyId, authorId } = event.chapter.story;

      if (!storyGroups.has(storyId)) {
        storyGroups.set(storyId, {
          storyId,
          authorId,
          views: 0,
          uniqueReaders: new Set(),
          newReaders: new Set(),
          returningReaders: new Set(),
          totalReadTime: 0,
          chaptersRead: new Set(),
          readerChapterCount: new Map(),
          trafficSources: { direct: 0, search: 0, referral: 0 },
        });
      }

      const group = storyGroups.get(storyId)!;
      group.views++;
      group.uniqueReaders.add(event.readerKey);
      group.totalReadTime += event.readTime;
      group.chaptersRead.add(event.chapterId);

      // Track chapters per reader
      const currentCount = group.readerChapterCount.get(event.readerKey) || 0;
      group.readerChapterCount.set(event.readerKey, currentCount + 1);

      // Determine if new or returning reader
      if (existingReaderKeys.has(event.readerKey)) {
        group.returningReaders.add(event.readerKey);
      } else {
        group.newReaders.add(event.readerKey);
      }

      // Track traffic sources
      switch (event.trafficSource) {
        case "DIRECT":
          group.trafficSources.direct++;
          break;
        case "SEARCH":
          group.trafficSources.search++;
          break;
        case "REFERRAL":
          group.trafficSources.referral++;
          break;
      }
    }

    // 1. Update StoryDailyStats
    const storyStatsPromises = Array.from(storyGroups.values()).map((group) => {
      const avgChaptersPerReader =
        group.readerChapterCount.size > 0
          ? Array.from(group.readerChapterCount.values()).reduce(
              (a, b) => a + b,
              0
            ) / group.readerChapterCount.size
          : 0;

      return postgresDb.storyDailyStats.upsert({
        where: {
          storyId_date: {
            storyId: group.storyId,
            date: yesterday,
          },
        },
        create: {
          storyId: group.storyId,
          date: yesterday,
          totalViews: group.views,
          uniqueReaders: group.uniqueReaders.size,
          newReaders: group.newReaders.size,
          returningReaders: group.returningReaders.size,
          avgReadTime:
            group.uniqueReaders.size > 0
              ? Math.round(group.totalReadTime / group.uniqueReaders.size)
              : 0,
          totalReadTime: group.totalReadTime,
          chaptersRead: group.chaptersRead.size,
          avgChaptersPerReader,
          directTraffic: group.trafficSources.direct,
          searchTraffic: group.trafficSources.search,
          referralTraffic: group.trafficSources.referral,
        },
        update: {
          totalViews: group.views,
          uniqueReaders: group.uniqueReaders.size,
          newReaders: group.newReaders.size,
          returningReaders: group.returningReaders.size,
          avgReadTime:
            group.uniqueReaders.size > 0
              ? Math.round(group.totalReadTime / group.uniqueReaders.size)
              : 0,
          totalReadTime: group.totalReadTime,
          chaptersRead: group.chaptersRead.size,
          avgChaptersPerReader,
          directTraffic: group.trafficSources.direct,
          searchTraffic: group.trafficSources.search,
          referralTraffic: group.trafficSources.referral,
        },
      });
    });

    // 2. Update ChapterStats
    const chapterGroups = new Map<
      string,
      {
        chapterId: string;
        views: number;
        uniqueReaders: Set<string>;
        totalReadTime: number;
      }
    >();

    for (const event of readEvents) {
      if (!chapterGroups.has(event.chapterId)) {
        chapterGroups.set(event.chapterId, {
          chapterId: event.chapterId,
          views: 0,
          uniqueReaders: new Set(),
          totalReadTime: 0,
        });
      }

      const group = chapterGroups.get(event.chapterId)!;
      group.views++;
      group.uniqueReaders.add(event.readerKey);
      group.totalReadTime += event.readTime;
    }

    const chapterStatsPromises = Array.from(chapterGroups.values()).map(
      (group) =>
        postgresDb.chapterStats.create({
          data: {
            chapterId: group.chapterId,
            views: group.views,
            uniqueReaders: group.uniqueReaders.size,
            avgReadTime:
              group.uniqueReaders.size > 0
                ? Math.round(group.totalReadTime / group.uniqueReaders.size)
                : 0,
          },
        })
    );

    // 3. Update AuthorDailyStats
    const authorGroups = new Map<
      string,
      {
        authorId: string;
        totalStoryViews: number;
        totalChapterViews: number;
        uniqueReaders: Set<string>;
        totalReadTime: number;
        storiesPublished: Set<string>;
        chaptersPublished: Set<string>;
      }
    >();

    for (const event of readEvents) {
      const { authorId } = event.chapter.story;
      const { storyId } = event.chapter;

      if (!authorGroups.has(authorId)) {
        authorGroups.set(authorId, {
          authorId,
          totalStoryViews: 0,
          totalChapterViews: 0,
          uniqueReaders: new Set(),
          totalReadTime: 0,
          storiesPublished: new Set(),
          chaptersPublished: new Set(),
        });
      }

      const group = authorGroups.get(authorId)!;
      group.totalChapterViews++;
      group.uniqueReaders.add(event.readerKey);
      group.totalReadTime += event.readTime;
      group.storiesPublished.add(storyId);
      group.chaptersPublished.add(event.chapterId);
    }

    // Get new followers for each author
    const authorFollowerPromises = Array.from(authorGroups.keys()).map(
      async (authorId) => {
        const newFollowers = await postgresDb.follow.count({
          where: {
            followingId: authorId,
            createdAt: {
              gte: yesterday,
              lt: today,
            },
          },
        });
        return { authorId, newFollowers };
      }
    );

    const authorFollowers = await Promise.all(authorFollowerPromises);
    const followerMap = new Map(
      authorFollowers.map((f) => [f.authorId, f.newFollowers])
    );

    const authorStatsPromises = Array.from(authorGroups.values()).map(
      (group) => {
        const uniqueStories = group.storiesPublished.size;
        const avgReadTime =
          group.uniqueReaders.size > 0
            ? Math.round(group.totalReadTime / group.uniqueReaders.size)
            : 0;

        return postgresDb.authorDailyStats.upsert({
          where: {
            authorId_date: {
              authorId: group.authorId,
              date: yesterday,
            },
          },
          create: {
            authorId: group.authorId,
            date: yesterday,
            totalStoryViews: uniqueStories,
            totalChapterViews: group.totalChapterViews,
            uniqueReaders: group.uniqueReaders.size,
            newFollowers: followerMap.get(group.authorId) || 0,
            avgReadTimeSeconds: avgReadTime,
            totalReadTimeSeconds: group.totalReadTime,
            storiesPublished: 0, // These should be counted separately from actual publishes
            chaptersPublished: 0,
          },
          update: {
            totalStoryViews: uniqueStories,
            totalChapterViews: group.totalChapterViews,
            uniqueReaders: group.uniqueReaders.size,
            newFollowers: followerMap.get(group.authorId) || 0,
            avgReadTimeSeconds: avgReadTime,
            totalReadTimeSeconds: group.totalReadTime,
          },
        });
      }
    );

    // Execute all promises
    await Promise.all([
      ...storyStatsPromises,
      ...chapterStatsPromises,
      ...authorStatsPromises,
    ]);

    console.log("Daily stats processed successfully");
    return Response.json({
      success: true,
      date: yesterday.toISOString(),
      stats: {
        storiesProcessed: storyGroups.size,
        chaptersProcessed: chapterGroups.size,
        authorsProcessed: authorGroups.size,
        totalReadEvents: readEvents.length,
      },
    });
  } catch (error) {
    console.error("Error processing daily stats:", error);
    return Response.json(
      {
        error: "Failed to process daily stats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
