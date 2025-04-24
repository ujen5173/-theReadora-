// TODO: Fix the search bar after the write page is done

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

const SearchBar = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const router = useRouter();
  const {
    data: stories,
    refetch,
    isRefetching,
    error,
  } = api.story.search.useQuery(
    {
      query: query || "",
      limit: 5,
    },
    {
      enabled: false,
    }
  );

  const debouncedFunction = (e: string) => {
    router.push(`/search?query=${e}`);

    // Get the data from the server
    refetch();
  };

  const debounced = useDebouncedCallback(debouncedFunction, 800);

  return (
    <div className="relative">
      <Input
        size="lg"
        placeholder="Search..."
        icon={KbdIcon}
        onChange={(e) => debounced(e.target.value)}
        className="bg-white w-80"
        iconPlacement="right"
      />
    </div>
  );
};

export default SearchBar;

const KbdIcon = () => (
  <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
    <span className="text-xs mt-1">⌘</span>K
  </kbd>
);
