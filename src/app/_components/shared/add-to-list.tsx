"use client";

import {
  Bookmark02Icon,
  BookmarkCheck01Icon,
  Loading03Icon,
} from "hugeicons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useUserStore } from "~/store/userStore";
import { api } from "~/trpc/react";
import useGetUserReadingList from "../layouts/useGetUserReadingList";
import ReadingListDialog from "./reading-list-dialog";

const AddToList = ({
  storyId,
  storyTitle,
}: {
  storyId: string;
  storyTitle: string;
}) => {
  const { user } = useUserStore();
  const [open, setOpen] = useState(false);
  const {
    refetchAllList,
    refetch,
    checkInList,
    lists,
    storyLists,
    isLoading,
    isLoadingStoryLists,
  } = useGetUserReadingList();
  const [selectedLists, setSelectedLists] = useState<string[]>([]);

  const { mutateAsync, status } = api.list.addToList.useMutation();

  useEffect(() => {
    const res = checkInList(storyId);
    setSelectedLists((res ?? []).map((e) => e.readinglistId));
  }, [storyId, storyLists]);

  const handleSave = async () => {
    if (selectedLists.length === 0) {
      toast("Please select at least one list");
      return;
    }

    const res = await mutateAsync({
      id: storyId,
      listIds: selectedLists,
    });

    if (res) {
      toast("Reading list updated.");
    }
    setOpen(false);
  };

  const toggleList = (listId: string) => {
    setSelectedLists((prev) =>
      prev.includes(listId)
        ? prev.filter((id) => id !== listId)
        : [...prev, listId],
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          icon={Bookmark02Icon}
          className="w-full bg-white hover:bg-slate-50 transition-colors"
        >
          Save to List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-700">
            Save to Reading list
          </DialogTitle>
          <DialogDescription>
            Save to your list for easy access later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mb-6">
          {isLoading || isLoadingStoryLists ? (
            <div className="space-y-3">
              <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          ) : (
            lists?.map((list) => (
              <button
                key={list.id}
                onClick={() => toggleList(list.id)}
                className={`w-full p-3 rounded-lg border transition-all ${
                  selectedLists.includes(list.id)
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">
                    {list.title}
                  </span>
                  {selectedLists.includes(list.id) && (
                    <BookmarkCheck01Icon className="text-primary" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
        <DialogFooter>
          {!user?.id ? (
            <Button asChild variant={"default"}>
              <Link href="/auth/signin">Sign in to save list</Link>
            </Button>
          ) : (
            <>
              <ReadingListDialog
                selectedStory={{
                  id: storyId,
                  title: storyTitle,
                }}
                removeNewListCreation
                onSuccess={async () => {
                  await refetchAllList();
                  await refetch();
                }}
              >
                <Button disabled={status === "pending"} variant={"outline"}>
                  Create New List
                </Button>
              </ReadingListDialog>
              <Button
                disabled={status === "pending" || selectedLists.length === 0}
                icon={status === "pending" ? Loading03Icon : undefined}
                iconStyle={status === "pending" ? "animate-spin" : ""}
                onClick={handleSave}
              >
                Save
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToList;
