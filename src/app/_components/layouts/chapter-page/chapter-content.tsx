"use client";
import { formatDate } from "date-fns";
import { BookOpen01Icon, BubbleChatIcon, RecordIcon } from "hugeicons-react";
import { ArrowLeftIcon, ArrowRightIcon, EyeIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import LockedChapter from "~/app/_components/shared/locked-chapter";
import { Button } from "~/components/ui/button";
import { useChapterStore } from "~/store/useChapter";
import { useUserStore } from "~/store/userStore";
import "~/styles/editor.css";
import { api } from "~/trpc/react";
import {
  isChapterScheduled,
  parseMetrics,
  parseReadershipAnalytics,
} from "~/utils/helpers";

const ChapterContent = ({
  userUnlockedChapter,
}: {
  userUnlockedChapter: boolean;
}) => {
  const { story, chapter } = useChapterStore();
  const { user } = useUserStore();

  if (!chapter) return null;

  if (
    chapter.scheduledFor &&
    !isChapterScheduled(chapter.scheduledFor) &&
    user?.id !== story?.author.id
  ) {
    return (
      <div className="w-full bg-slate-100">
        <div className="max-w-4xl border-x border-border bg-white px-6 mx-auto py-20">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-slate-800">
              Chapter Coming Soon
            </h1>
            <p className="text-slate-600">
              This chapter will be published on{" "}
              {new Date(chapter.scheduledFor).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (chapter.isLocked && !userUnlockedChapter) {
    return (
      <LockedChapter
        chapterId={chapter.id}
        price={chapter.price}
        title={chapter.title}
        chapterNumber={chapter.chapterNumber}
      />
    );
  }

  return (
    <section className="w-full bg-slate-100">
      <div className="max-w-4xl border-x border-border bg-white px-3 sm:px-6 mx-auto">
        <ChapterMetaData />
        <Content />
      </div>
    </section>
  );
};

export default ChapterContent;

const ChapterMetaData = () => {
  const { story, chapter } = useChapterStore();
  const { user } = useUserStore();

  const metrics = parseMetrics(chapter?.metrics);
  const readershipAnalytics = parseReadershipAnalytics(
    chapter?.readershipAnalytics
  );

  return (
    <div className="py-12 sm:py-20 space-y-6 sm:space-y-8 border-b border-border">
      <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-black text-slate-700 px-2">
        {chapter?.title}
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
        {metrics && (
          <>
            <div className="flex items-center gap-1 sm:gap-2">
              <BookOpen01Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
              <span>{Intl.NumberFormat().format(metrics.wordCount)} words</span>
            </div>
            <RecordIcon className="size-1 sm:size-1.5 fill-slate-600 text-slate-600" />
            <div className="flex items-center gap-1 sm:gap-2">
              <EyeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
              <span>{readershipAnalytics.total.toLocaleString()} views</span>
            </div>
            <RecordIcon className="size-1 sm:size-1.5 fill-slate-600 text-slate-600" />
            <div className="flex items-center gap-1 sm:gap-2">
              <BubbleChatIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
              <span>{metrics.commentsCount.toLocaleString()} comments</span>
            </div>
          </>
        )}
      </div>

      {story?.author.id === user?.id &&
      chapter?.scheduledFor &&
      !isChapterScheduled(chapter.scheduledFor) ? (
        <div className="text-center text-sm text-slate-500">
          Scheduled for{" "}
          <span className="underline-offset-2 text-primary font-semibold underline">
            {formatDate(chapter.scheduledFor, "PPp")}
          </span>
        </div>
      ) : (
        <div className="text-center text-sm text-slate-500">
          Last updated{" "}
          <span className="underline-offset-2 text-slate-500 font-semibold underline">
            {chapter?.updatedAt
              ? new Date(chapter.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </span>
        </div>
      )}
    </div>
  );
};

const Content = () => {
  const { initialChunk, chapter, story } = useChapterStore();
  const [queryEnabled, setQueryEnabled] = useState(false);
  const [shouldFetchMore, setShouldFetchMore] = useState(false);
  const hasEnabledQuery = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Memoize nextChapter to prevent unnecessary recalculations
  const nextChapter = useMemo(
    () =>
      story?.chapters.find(
        (ch) => ch.chapterNumber === (chapter?.chapterNumber ?? 0) + 1
      ),
    [story?.chapters, chapter?.chapterNumber]
  );

  const { data, fetchNextPage, hasNextPage, isFetching } =
    api.chapter.getChapterChunks.useInfiniteQuery(
      {
        chapterId: chapter?.mongoContentID[0] ?? "",
        limit: 1,
      },
      {
        enabled: !!chapter?.mongoContentID[0] && queryEnabled,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
      }
    );

  // Improve intersection observer cleanup
  useEffect(() => {
    const currentRef = bottomRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (!hasEnabledQuery.current) {
            setQueryEnabled(true);
            hasEnabledQuery.current = true;
          } else if (!isFetching) {
            setShouldFetchMore(true);
          }
        }
      },
      {
        root: null,
        rootMargin: "250px",
        threshold: 0.1,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [isFetching]);

  useEffect(() => {
    if (shouldFetchMore && hasNextPage && !isFetching) {
      void fetchNextPage();
      setShouldFetchMore(false);
    }
  }, [shouldFetchMore, hasNextPage, isFetching, fetchNextPage]);

  const additionalChunks = data?.pages.flatMap((page) => page.chunks) ?? [];

  if (!initialChunk) return null;

  return (
    <div className="editor-container px-[0!important] space-y-6 sm:space-y-8">
      {/* Initial chunk */}
      <div
        className="preview-content text-slate-500 text-base sm:text-lg"
        dangerouslySetInnerHTML={{ __html: initialChunk.content }}
      />

      {/* Additional chunks */}
      {additionalChunks.map((chunk) => (
        <div
          key={chunk.id}
          className="preview-content text-slate-500 text-base sm:text-lg"
          dangerouslySetInnerHTML={{ __html: chunk.content }}
        />
      ))}

      {isFetching && (
        <div className="py-4 text-center text-sm sm:text-base text-slate-500">
          Loading more content...
        </div>
      )}

      {/* Next Chapter or End of Story Message */}
      {!hasNextPage && data?.pages.length && data.pages.length > 0 && (
        <div className="py-8 sm:py-12 flex max-w-md mx-auto flex-col items-center">
          {nextChapter ? (
            <div className="flex flex-col items-center gap-3 sm:gap-4 bg-gradient-to-b from-slate-50 to-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm w-full">
              <span className="border border-slate-200 text-slate-500 text-xs sm:text-sm font-medium px-3 sm:px-4 py-0.5 sm:py-1 bg-slate-100 rounded-full">
                Up Next
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-700 text-center">
                Chapter {nextChapter.chapterNumber}: {nextChapter.title}
              </h3>
              <Link
                href={`/chapter/${nextChapter.slug}`}
                className="block w-full"
              >
                <Button
                  icon={ArrowRightIcon}
                  effect={"expandIcon"}
                  iconPlacement="right"
                  className="w-full "
                >
                  Continue Reading
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center bg-gradient-to-b from-slate-50 to-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8 max-w-lg w-full mx-auto">
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                  You're All Caught Up!
                </h3>
                <p className="text-slate-600">
                  Stay tuned for more chapters from this amazing story
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-slate-500">
                    Follow the Author
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="relative">
                    <Image
                      src={story?.author.image ?? ""}
                      alt={story?.author.name ?? ""}
                      width={56}
                      height={56}
                      className="size-14 rounded-full border-2 border-slate-200 ring-2 ring-white"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 text-lg">
                      {story?.author.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      @{story?.author.username}
                    </p>
                  </div>
                </div>

                <div className="space-x-2 flex items-center justify-center">
                  <Button className="w-full" icon={PlusIcon}>
                    Follow Author
                  </Button>

                  <Button
                    variant="outline"
                    icon={ArrowLeftIcon}
                    asChild
                    className="w-full hover:bg-slate-50 transition-colors"
                  >
                    <Link href={`/story/${story?.slug}`}>Story Overview</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div
        ref={bottomRef}
        className="h-4"
        style={{ visibility: hasNextPage ? "visible" : "hidden" }}
      />
    </div>
  );
};
