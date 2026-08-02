"use client";

import { RecordIcon } from "hugeicons-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import Metrics from "../_components/layouts/studio/shared/Metrics";
import useProfileAnalytics from "./hooks/useProfileAnalytics";

const Studio = () => {
  const { isLoading, data } = useProfileAnalytics();

  return (
    <main className="p-4 sm:p-6">
      <div className="flex sm:flex-row flex-col items-center gap-4 bg-white p-4 border border-border rounded-md">
        {isLoading && data === undefined ? (
          <>
            <Skeleton className="rounded-full size-13" />
            <div className="space-y-2 w-full sm:w-auto sm:text-left text-center">
              <Skeleton className="mx-auto sm:mx-0 w-32 h-4" />
              <div className="flex justify-center sm:justify-start gap-2">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-24 h-4" />
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

            <div className="flex-1 space-y-2 sm:space-y-0 sm:text-left text-center">
              <h4 className="font-bold text-slate-800 text-lg">{data?.name}</h4>
              <div className="flex flex-wrap justify-center sm:justify-start items-center">
                <div className="font-semibold text-slate-700 text-sm">
                  Stories:{" "}
                  <span className="text-slate-800">
                    {Intl.NumberFormat().format(data?.totalStories || 0)}
                  </span>
                </div>
                <RecordIcon className="hidden sm:block" />
                <div className="font-semibold text-slate-700 text-sm">
                  Following:{" "}
                  <span className="text-slate-800">
                    {Intl.NumberFormat().format(data?.followingCount! || 0)}
                  </span>
                </div>
                <RecordIcon className="hidden sm:block" />
                <div className="font-semibold text-slate-700 text-sm">
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
