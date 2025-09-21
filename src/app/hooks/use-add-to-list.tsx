import { useMemo } from "react";
import { useUserStore } from "~/store/userStore";
import { api } from "~/trpc/react";

interface UseAddToReadingListsOptions {
  storyId?: string;
  enabled?: boolean;
}

export function useAddToReadingLists({
  storyId,
  enabled = true,
}: UseAddToReadingListsOptions = {}) {
  const { user } = useUserStore();

  // Single query to get all user's reading lists
  const {
    data: allLists,
    isLoading: isLoadingLists,
    refetch: refetchLists,
    error: listsError,
  } = api.list.getList.useQuery(undefined, {
    enabled: enabled && !!user,
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Single query to get story lists for the specific story
  const {
    data: storyLists,
    isLoading: isLoadingStoryLists,
    refetch: refetchStoryLists,
    error: storyListsError,
  } = api.list.getStoryLists.useQuery(
    { storyId: storyId! },
    {
      enabled: enabled && !!user && !!storyId,
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Memoized computation to determine which lists contain the story
  const storyListIds = useMemo(() => {
    if (!storyLists) return [];
    return storyLists.map((list) => list.id);
  }, [storyLists]);

  // Memoized lists with selection state
  const listsWithSelection = useMemo(() => {
    if (!allLists) return [];

    return allLists.map((list) => ({
      ...list,
      isSelected: storyListIds.includes(list.id),
    }));
  }, [allLists, storyListIds]);

  const isLoading = isLoadingLists || isLoadingStoryLists;
  const hasError = !!listsError || !!storyListsError;

  // Refetch function that updates both queries
  const refetch = async () => {
    await Promise.all([
      refetchLists(),
      storyId ? refetchStoryLists() : Promise.resolve(),
    ]);
  };

  return {
    lists: listsWithSelection,
    storyListIds,
    isLoading,
    hasError,
    refetch,
    // Raw data for advanced usage
    allLists,
    storyLists,
  };
}
