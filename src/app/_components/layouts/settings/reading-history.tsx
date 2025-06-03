"use client";
import { FileSyncIcon } from "hugeicons-react";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import type { StoryWithMetadata } from "~/server/api/routers/user";
import { api } from "~/trpc/react";
import NovelCard from "../../shared/novel-card";

const ReadingHistory = () => {
  const [sortBy, setSortBy] = useState<
    "LAST_READ" | "RECENTLY_UPDATED" | "FREQUENTLY_READ" | undefined
  >("LAST_READ");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const { data, isLoading } = api.user.getHistory.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const [novels, setNovels] = useState<StoryWithMetadata[]>([]);

  useEffect(() => {
    if (!data) return;

    const sortedAndFilteredNovels = data
      .filter((novel) => {
        if (!debouncedSearchQuery) return true;
        const searchLower = debouncedSearchQuery.toLowerCase();
        return (
          novel.title.toLowerCase().includes(searchLower) ||
          novel.author.name.toLowerCase().includes(searchLower) ||
          novel.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "LAST_READ":
            return (
              new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime()
            );

          case "RECENTLY_UPDATED":
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );

          case "FREQUENTLY_READ":
            return b.frequency - a.frequency;

          default:
            return 0;
        }
      });

    setNovels(sortedAndFilteredNovels);
  }, [data, sortBy, debouncedSearchQuery]);

  return (
    <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-4 sm:p-6">
      <div className="flex items-center gap-6 justify-between">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 border border-primary/20">
            <FileSyncIcon className="size-4 sm:size-5 text-primary" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-primary">
            Reading History
          </h3>
        </div>
        <Button variant={"outline"} size="sm">
          Clear History
        </Button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2">
          <Input
            className="md:text-sm w-full bg-white"
            size="md"
            iconPlacement="left"
            iconStyle="size-4 text-slate-600"
            icon={Search}
            placeholder="Find stories by author, tag, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            value={sortBy}
            onValueChange={(e) => setSortBy(e as typeof sortBy)}
          >
            <SelectTrigger size="lg" className="h-10 bg-white w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort By</SelectLabel>
                <SelectItem value="LAST_READ">Last Read</SelectItem>
                <SelectItem value="RECENTLY_UPDATED">
                  Recently Updated
                </SelectItem>
                <SelectItem value="FREQUENTLY_READ">Frequently Read</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-10">
        {(data ?? []).length === 0 && !isLoading ? (
          <div className="flex items-center min-h-40 justify-center w-full h-full">
            <p className="text-gray-600 text-lg font-semibold">
              Your reading history will appear here once you start exploring
              stories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {isLoading
              ? Array(6)
                  .fill("")
                  .map((e, i) => (
                    <Skeleton
                      key={i}
                      className="aspect-[1/1.6] w-full h-full"
                    />
                  ))
              : novels?.map(
                  ({
                    frequency,
                    lastRead,
                    createdAt,
                    updatedAt,
                    tags,
                    ...novel
                  }) => (
                    <NovelCard isAuthorViewer key={novel.id} details={novel} />
                  )
                )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingHistory;
