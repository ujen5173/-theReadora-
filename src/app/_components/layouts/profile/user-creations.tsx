"use client";

import { Book01Icon, Edit02Icon } from "hugeicons-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useUserProfileStore } from "~/store/userProfileStore";
import { useUserStore } from "~/store/userStore";
import BookSection from "../../shared/books-section";

const UserCreations = () => {
  const { user } = useUserProfileStore();
  const { user: currentUser } = useUserStore();

  return (
    <BookSection
      title={`${user?.name}'s Creations`}
      novels={user?.stories || []}
      isAuthorViewer
      analyticsRef="profile"
      customEmptyContainer={
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12">
          <Book01Icon className="size-12 text-slate-400" />
          <p className="mt-4 text-slate-600">No works published yet</p>
          {user?.id === currentUser?.id && (
            <Link href={"/write"}>
              <Button
                icon={Edit02Icon}
                variant="default"
                size="sm"
                className="mt-4 gap-2"
              >
                Create Your First Story
              </Button>
            </Link>
          )}
        </div>
      }
    />
  );
};

export default UserCreations;
