"use client";

import { Bookmark02Icon, BookmarkCheck01Icon } from "hugeicons-react";
import { Loader2Icon } from "lucide-react";
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
import ReadingListDialog from "./reading-list-dialog";

const AddToList = ({ storyId }: { storyId: string }) => {
  const { user } = useUserStore();
  const [open, setOpen] = useState(false);
  const [selectedLists, setSelectedLists] = useState<string[]>([]);

  const { mutateAsync, status } = api.list.addToList.useMutation();

  const {
    data: lists,
    isLoading,
    refetch,
  } = api.list.getList.useQuery(undefined, {
    enabled: !!user,
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const { data: storyLists, isLoading: isLoadingStoryLists } =
    api.list.getStoryLists.useQuery(
      { storyId },
      {
        enabled: !!user && !!storyId,
      }
    );

  useEffect(() => {
    if (storyLists) {
      setSelectedLists(storyLists.map((list) => list.id));
    }
  }, [storyLists]);

  const handleSave = async () => {
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
        : [...prev, listId]
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
        <div className="space-y-4 mb-6">
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
              <ReadingListDialog onSuccess={() => refetch()}>
                <Button disabled={status === "pending"} variant={"outline"}>
                  Create New List
                </Button>
              </ReadingListDialog>
              <Button
                disabled={status === "pending"}
                icon={status === "pending" ? Loader2Icon : undefined}
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
