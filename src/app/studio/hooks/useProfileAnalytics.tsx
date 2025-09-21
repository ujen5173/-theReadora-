import { api } from "~/trpc/react";

const useProfileAnalytics = () => {
  const { data, isLoading } = api.user.getProfileAnalytics.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return { data, isLoading };
};

export default useProfileAnalytics;
