"use client";

import { BookOpen01Icon, BubbleChatIcon, RecordIcon } from "hugeicons-react";
import { ArrowLeftIcon, ArrowRightIcon, EyeIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { useChapterStore } from "~/store/useChapter";
import "~/styles/editor.css";
import { api } from "~/trpc/react";
import { parseMetrics, parseReadershipAnalytics } from "~/utils/helpers";

const ChapterContent = () => {
  return (
    <section className="w-full bg-slate-100 border-b border-border">
      <div className="max-w-4xl border-x border-border bg-white px-6 mx-auto">
        <ChapterMetaData />
        <Content />
      </div>
    </section>
  );
};

export default ChapterContent;

const ChapterMetaData = () => {
  const { chapter } = useChapterStore();

  const metrics = parseMetrics(chapter?.metrics);
  const readershipAnalytics = parseReadershipAnalytics(
    chapter?.readershipAnalytics
  );

  return (
    <div className="py-20 space-y-8 border-b border-slate-200">
      <h1 className="text-4xl text-center font-black text-slate-700">
        {chapter?.title}
      </h1>

      <div className="flex items-center justify-center gap-2 text-sm">
        {metrics && (
          <>
            <div className="flex items-center gap-2">
              <BookOpen01Icon className="w-4 h-4 text-slate-600" />
              <span>{Intl.NumberFormat().format(metrics.wordCount)} words</span>
            </div>
            <RecordIcon className="size-1.5 fill-slate-600 text-slate-600" />
            <div className="flex items-center gap-2">
              <EyeIcon className="w-4 h-4 text-slate-600" />
              <span>{readershipAnalytics.total.toLocaleString()} views</span>
            </div>
            <RecordIcon className="size-1.5 fill-slate-600 text-slate-600" />
            <div className="flex items-center gap-2">
              <BubbleChatIcon className="w-4 h-4 text-slate-600" />
              <span>{metrics.commentsCount.toLocaleString()} comments</span>
            </div>
          </>
        )}
      </div>

      {/* Last Updated */}
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
    <div className="editor-container px-[0!important] space-y-8">
      {/* Initial chunk */}
      <div
        className="preview-content text-slate-500"
        dangerouslySetInnerHTML={{ __html: initialChunk.content }}
      />

      {/* Additional chunks */}
      {additionalChunks.map((chunk) => (
        <div
          key={chunk.id}
          className="preview-content text-slate-500"
          dangerouslySetInnerHTML={{ __html: chunk.content }}
        />
      ))}

      {isFetching && (
        <div className="py-4 text-center text-slate-500">
          Loading more content...
        </div>
      )}

      {/* Next Chapter or End of Story Message */}
      {!hasNextPage && data?.pages.length && data.pages.length > 0 && (
        <div className="py-12 flex flex-col items-center">
          {nextChapter ? (
            <div className="flex flex-col items-center gap-4 bg-gradient-to-b from-slate-50 to-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <span className="border border-slate-200 text-slate-500 text-sm font-medium px-4 py-1 bg-slate-100 rounded-full">
                Up Next
              </span>
              <h3 className="text-2xl font-bold text-slate-700 text-center">
                Chapter {nextChapter.chapterNumber}: {nextChapter.title}
              </h3>
              <Link href={`/chapter/${nextChapter.slug}`} className="block">
                <Button
                  icon={ArrowRightIcon}
                  effect={"expandIcon"}
                  iconPlacement="right"
                  className="w-full"
                >
                  Continue Reading
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center bg-gradient-to-b from-slate-50 to-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8 max-w-lg w-full mx-auto">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-slate-800">
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
                  <Button icon={PlusIcon}>Follow Author for Updates</Button>

                  <Link href={`/story/${story?.slug}`} className="block w-full">
                    <Button
                      variant="outline"
                      icon={ArrowLeftIcon}
                      className="w-full hover:bg-slate-50 transition-colors"
                    >
                      Back to Story Overview
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Intersection observer target */}
      <div
        ref={bottomRef}
        className="h-4"
        style={{ visibility: hasNextPage ? "visible" : "hidden" }}
      />
    </div>
  );
};
