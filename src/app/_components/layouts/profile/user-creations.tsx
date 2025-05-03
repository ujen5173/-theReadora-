"use client";
import { Book01Icon } from "hugeicons-react";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useUserProfileStore } from "~/store/userProfileStore";
import { useUserStore } from "~/store/userStore";
import NovelCard from "../../shared/novel-card";

const UserCreations = () => {
  const { user } = useUserProfileStore();
  const { user: currentUser } = useUserStore();

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          <span className="text-primary">{user?.name}'s</span> Works
        </h2>
      </div>

      {user?.stories?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
          <Book01Icon className="size-12 text-slate-400" />
          <p className="mt-4 text-slate-600">No works published yet</p>
          {user.id === currentUser?.id && (
            <Link href={"/write"}>
              <Button
                icon={Edit2}
                variant="default"
                size="sm"
                className="mt-4 gap-2"
              >
                Create Your First Story
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {user?.stories?.map((story) => (
            <NovelCard key={story.id} details={story} />
          ))}
        </div>
      )}

      {user?.stories && user?.stories.length >= 18 && (
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
