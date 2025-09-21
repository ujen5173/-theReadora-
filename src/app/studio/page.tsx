"use client";

import { Dot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import Metrics from "../_components/layouts/studio/shared/Metrics";
import useProfileAnalytics from "./hooks/useProfileAnalytics";

const Studio = () => {
  const { isLoading, data } = useProfileAnalytics();

  return (
    <main className="p-6">
      {/* Profile */}
      <div className="flex gap-4 items-center border border-border bg-white rounded-md p-4">
        {isLoading && data === undefined ? (
          <>
            <Skeleton className="size-13 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="w-32 h-4" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </>
        ) : (
          <>
            <Avatar className="size-12">
              <AvatarImage src={data?.image!} />
              <AvatarFallback>UB</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-slate-800">{data?.name}</h4>
              <div className="flex items-center">
                <div className="text-sm font-semibold text-slate-700">
                  Stories:{" "}
                  <span className="text-slate-800">
                    {Intl.NumberFormat().format(data?.stories.length || 0)}
                  </span>
                </div>
                <Dot />
                <div className="text-sm font-semibold text-slate-700">
                  Following:{" "}
                  <span className="text-slate-800">
                    {Intl.NumberFormat().format(data?.followingCount! || 0)}
                  </span>
                </div>
                <Dot />
                <div className="text-sm font-semibold text-slate-700">
                  Followers:{" "}
                  <span className="text-slate-800">
                    {Intl.NumberFormat().format(data?.followersCount! || 0)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Metrics */}
      <Metrics />
    </main>
  );
};

export default Studio;
