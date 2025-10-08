"use client";

import { useUserStore } from "~/store/userStore";
import { api } from "~/trpc/react";

const useGetUserReadingList = () => {
  const { user } = useUserStore();
  const {
    data: lists,
    isLoading,
    refetch: refetchAllList,
  } = api.list.getList.useQuery(undefined, {
    enabled: !!user,
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const {
    data: storyLists,
    isLoading: isLoadingStoryLists,
    refetch,
  } = api.list.getUserReadingTitles.useQuery(undefined, {
    enabled: !!user,
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const checkInList = (id: string) =>
    (storyLists ?? []).filter((e) => e.storyId === id);

  return {
    checkInList,
    lists,
    storyLists,
    isLoading,
    isLoadingStoryLists,
    refetch,
    refetchAllList,
  };
};

export default useGetUserReadingList;
