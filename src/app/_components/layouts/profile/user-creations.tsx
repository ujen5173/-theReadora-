"use client";

import { Book01Icon } from "hugeicons-react";
import { Edit2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useUserProfileStore } from "~/store/userProfileStore";
import { api } from "~/trpc/react";
import NovelCard from "../../shared/novel-card";

const UserCreations = () => {
  const { user } = useUserProfileStore();
  const { data, isLoading } = api.story.getByAuthor.useQuery(
    {
      author: user?.id as string,
      limit: 18,
    },
    {
      enabled: !!user?.id,
    }
  );

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          <span className="text-primary">{user?.name}'s</span> Works
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
          <p className="mt-4 text-slate-600">No works published yet</p>
          <Button
            icon={Edit2}
            variant="default"
            size="sm"
            className="mt-4 gap-2"
          >
            Create Your First Story
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {data?.map((story) => (
            <NovelCard key={story.id} details={story} />
          ))}
        </div>
      )}

      {data && data.length >= 18 && (
        <div className="mt-8 flex justify-center">
          <Button
            icon={Book01Icon}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            Load More
          </Button>
        </div>
      )}
    </section>
  );
};

export default UserCreations;
