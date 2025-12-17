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
      <div className="flex flex-col sm:flex-row gap-4 items-center border border-border bg-white rounded-md p-4">
        {isLoading && data === undefined ? (
          <>
            <Skeleton className="size-13 rounded-full" />
            <div className="space-y-2 w-full sm:w-auto text-center sm:text-left">
              <Skeleton className="w-32 h-4 mx-auto sm:mx-0" />
              <div className="flex gap-2 justify-center sm:justify-start">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </>
        ) : (
          <>
            <Avatar className="size-16 sm:size-12">
              <AvatarImage src={data?.image!} />
              <AvatarFallback>
                {data?.name.slice(0, 1)} {data?.name.slice(-1)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left space-y-2 sm:space-y-0">
              <h4 className="text-lg font-bold text-slate-800">{data?.name}</h4>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2">
                <div className="text-sm font-semibold text-slate-700">
                  Stories:{" "}
                  <span className="text-slate-800">
                    {Intl.NumberFormat().format(data?.totalStories || 0)}
                  </span>
                </div>
                <Dot className="hidden sm:block" />
                <div className="text-sm font-semibold text-slate-700">
                  Following:{" "}
                  <span className="text-slate-800">
                    {Intl.NumberFormat().format(data?.followingCount! || 0)}
                  </span>
                </div>
                <Dot className="hidden sm:block" />
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

      <Metrics />
    </main>
  );
};

export default Studio;
