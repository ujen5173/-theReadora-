"use client";

import { Book01Icon } from "hugeicons-react";
import NovelCard from "~/app/_components/shared/novel-card";
import { useUserProfileStore } from "~/store/userProfileStore";
import { api } from "~/trpc/react";

const UserReadingList = () => {
  const { user } = useUserProfileStore();
  const { data, isLoading } = api.story.getAuthorReadingList.useQuery(
    undefined,
    {
      enabled: !!user?.id,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          <span className="text-primary">{user?.name}'s</span> Reading List
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[320px] animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      ) : data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
          <Book01Icon className="size-12 text-slate-400" />
          <h3 className="mt-4 text-2xl font-black text-slate-700">
            Author reading list is empty
          </h3>
          <p className="text-slate-500 text-sm mt-2">
            Stay updated on their reading lists by following the author.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {data?.map((story) => (
            <NovelCard key={story} details={story} />
          ))}
        </div>
      )}
    </section>
  );
};

export default UserReadingList;
