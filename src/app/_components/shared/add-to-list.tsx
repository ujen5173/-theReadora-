"use client";
import { BookmarkCheck02Icon } from "hugeicons-react";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import ReadingListDialog from "./reading-list";

const AddToList = ({ storyId }: { storyId: string }) => {
  const { data: lists, isLoading, refetch } = api.list.getList.useQuery();
  const { mutateAsync, status } = api.list.addToList.useMutation();
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    const res = await mutateAsync({
      id: storyId,
      listIds: checkedList,
    });

    if (res) {
      toast("Reading list updated.");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          icon={BookmarkCheck02Icon}
          className="w-full bg-white"
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
          {isLoading ? (
            <>
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-full h-5" />
            </>
          ) : (
            lists?.map((e) => (
              <div key={e.id} className="flex items-center gap-2">
                <Checkbox
                  variant="primary"
                  name={e.title}
                  id={e.title}
                  onCheckedChange={() =>
                    setCheckedList((prev) => [...prev, e.id])
                  }
                  size="lg"
                />
                <Label
                  htmlFor={e.title}
                  className="text-base font-semibold text-slate-600"
                >
                  {e.title}
                </Label>
              </div>
            ))
          )}
        </div>
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToList;
