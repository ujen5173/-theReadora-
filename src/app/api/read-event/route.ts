import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { postgresDb } from "~/server/postgresql";

const PayloadSchema = z.object({
  chapterId: z.string(),
  readerKey: z.string().min(1).optional(),
  city: z.string().nullable().optional(),
  ip: z.string().nullable().optional(),
  ref: z.string().nullable().optional(),
  readTime: z.number().nullable().optional(),
  searchQuery: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  try {
    console.log("Read Event Called...")
    const text = await req.text();
    const json = text ? JSON.parse(text) : {};
    const input = PayloadSchema.parse(json);

    const readerKey = input.readerKey ?? "anonymous";
    // Attempt to infer IP if not provided
    const inferredIp =
      input.ip ??
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null;

    const [chapter, hasViewed] = await postgresDb.$transaction([
      postgresDb.chapter.findUnique({
        where: { id: input.chapterId },
        include: { story: true },
      }),
      postgresDb.readEvent.findFirst({
        where: { readerKey, chapterId: input.chapterId },
      }),
    ]);

    if (!chapter) {
      return NextResponse.json(
        { success: false, message: "Chapter not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const lastRead = hasViewed?.updatedAt
      ? new Date(hasViewed.updatedAt)
      : null;
    const elapsedMs = lastRead ? now.getTime() - lastRead.getTime() : undefined;
    const hoursSinceLastRead = elapsedMs ? elapsedMs / (1000 * 60 * 60) : 24;
    const minutesSinceLastRead = elapsedMs ? elapsedMs / (1000 * 60) : 5;

    if (!hasViewed) {
      await postgresDb.$transaction([
        postgresDb.readEvent.create({
          data: {
            readerKey,
            userId: input.isAnonymous ? null : readerKey,
            chapterId: chapter.id,
            ipAddress: inferredIp,
            readTime: input.readTime ?? 0,
            trafficSource: (() => {
              const ref = input.ref?.toLowerCase() ?? null;
              if (ref === null) return "DIRECT";
              if (ref === "" || ref === "direct") return "DIRECT";
              if (ref === "feed" || ref.startsWith("feed:")) return "FEED";
              if (ref === "search" || ref.startsWith("search")) return "SEARCH";
              return "REFERRAL";
            })(),
            searchQuery: input.searchQuery ?? "",
            referrerUrl: input.ref ?? null,
            city: input.city ?? null,
            frequency: 1,
          },
        }),
        postgresDb.story.update({
          where: { id: chapter.storyId },
          data: { readCount: { increment: 1 } },
        }),
      ]);

      return NextResponse.json({ success: true });
    }

    if (minutesSinceLastRead >= 5) {
      await postgresDb.readEvent.update({
        where: {
          readerKey_chapterId: {
            readerKey,
            chapterId: chapter.id,
          },
        },
        data: {
          updatedAt: new Date(),
          frequency: { increment: 1 },
          ipAddress: inferredIp ?? undefined,
          city: input.city ?? undefined,
        },
      });
    }

    if (hoursSinceLastRead >= 24) {
      await postgresDb.story.update({
        where: { id: chapter.storyId },
        data: { readCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
