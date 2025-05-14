"use client";

import { ArrowDownIcon, BookOpenIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useChapterStore } from "~/store/useChapter";
import { api } from "~/trpc/react";
import NovelCard, { type TCard } from "../../shared/novel-card";

const RecommendedStories = () => {
  const { chapter } = useChapterStore();
  const { data: stories, isLoading } = api.story.similar.useQuery(
    {
      storyId: chapter?.storyId as string,
    },
    {
      enabled: !!chapter?.storyId,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <section className="bg-slate-100 w-full">
      <div className="max-w-4xl py-8 border-x border-b border-border bg-white px-6 mx-auto">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-primary">Recommendations</h2>
          <ArrowDownIcon className="size-6 text-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <Loader2 className="size-6 text-primary animate-spin" />
            </div>
          ) : stories?.length && stories?.length > 0 ? (
            stories?.map((story: TCard) => (
              <div key={story.id}>
                <NovelCard details={story} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-8">
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center justify-center border border-border size-16 rounded-full bg-slate-100">
                  <BookOpenIcon className="size-8 text-slate-400" />
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-semibold text-slate-800">
                    No Similar Stories Found
                  </h3>
                  <p className="text-sm mb-4 text-slate-500">
                    Explore other stories for more great reads
                  </p>

                  <Link href="/featured">
                    <Button variant={"secondary"} size="sm">
                      Browse Featured Stories
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RecommendedStories;
