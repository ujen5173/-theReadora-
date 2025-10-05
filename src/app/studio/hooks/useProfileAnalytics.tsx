import { api } from "~/trpc/react";

const useProfileAnalytics = (
  range?: "24h" | "7d" | "30d" | "3m" | "12m" | "24m"
) => {
  const { data, isLoading } = api.user.getProfileAnalytics.useQuery(
    range ? { range } : undefined,
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }
  );

  return { data, isLoading };
};

export default useProfileAnalytics;
