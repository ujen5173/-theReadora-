"use client";

import {
  Delete02Icon,
  Edit02Icon,
  MoreVerticalSquare01Icon,
} from "hugeicons-react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import type { TgetUserReadingList } from "~/server/api/routers/readinglist";
import { useReadinglistStore } from "~/store/useReadinglist";
import { api } from "~/trpc/react";
import {
  bookHeight,
  bookWidth,
  cardHeight,
  cardWidth,
} from "~/utils/constants";

const ReadingListCard = ({
  showActions,
  readingList,
  onDelete,
}: {
  showActions: boolean;
  readingList: TgetUserReadingList[number];
  onDelete?: () => void;
}) => {
  const { setOpen, setEdited, deleteLoading, setDeleteLoading } =
    useReadinglistStore();
  const { mutateAsync } = api.list.delete.useMutation();

  const handleDelete = async () => {
    try {
      setDeleteLoading(readingList.id, true);
      const res = await mutateAsync({
        id: readingList.id,
      });

      if (res) {
        toast("Reading list deleted successfully");
        if (onDelete) onDelete();
      }
    } catch (err) {
      toast("Something went wrong while deleting the list");
    } finally {
      setDeleteLoading(readingList.id, false);
    }
  };

  const handleEdit = () => {
    setOpen(true);
    setEdited({
      id: readingList.id,
      stories: readingList.stories.map((e) => ({
        id: e.id,
        title: e.title,
      })),
      title: readingList.title ?? "",
      description: readingList.description ?? "",
    });
  };

  const isDeleting = deleteLoading[readingList.id] || false;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
      style={{ maxWidth: cardWidth * 2 + "px", width: "100%" }}
    >
      <div className="flex items-center justify-between gap-4 px-6 py-4 bg-gradient-to-br from-slate-50 to-white">
        <Link href={`/reading-list/${readingList.id}`} className="flex-1">
          <h2 className="line-clamp-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary">
            {readingList.title}
          </h2>
          {readingList.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {readingList.description}
            </p>
          )}
        </Link>
        {showActions && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-gray-100"
                disabled={isDeleting}
              >
                <MoreVerticalSquare01Icon size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-48 rounded-xl p-0 shadow-lg overflow-hidden"
            >
              <div
                onClick={handleEdit}
                role="button"
                className="flex items-center gap-2 text-sm px-4 cursor-pointer hover:bg-slate-100 transition duration-150 py-3"
              >
                <Edit02Icon className="text-slate-700 size-5" />
                Edit
              </div>
              <Separator />
              <div
                role="button"
                onClick={handleDelete}
                className="flex items-center gap-2 text-sm px-4 cursor-pointer hover:bg-primary/10 hover:text-primary transition duration-150 py-3"
              >
                {isDeleting ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Delete02Icon className="text-inherit size-5" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <Link href={`/reading-list/${readingList.id}`}>
        <div
          style={{
            maxHeight: cardHeight / 1.4 + 32 + 44 + "px",
            height: "20vh",
            minHeight: "260px",
            width: cardWidth * 2 + "px",
            maxWidth: "100%",
          }}
          className="relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-b-2xl border-t-2 border-slate-200 bg-slate-100 p-4"
        >
          {readingList.stories.length > 0 ? (
            readingList.stories.map((story, index) => {
              // Centering calculation for the cards
              const length = readingList.stories.length;
              const shiftX = 20 * length; // control horizontal shift
              const shiftY = 12; // control vertical shift
              const initialX = (-(length - 1) * shiftX) / 2; // Centering calculation for X
              const initialY = (-(length - 1) * shiftY) / 2; // Centering calculation for Y
              const transform = `translate(${initialX + index * shiftX}px, ${
                initialY + index * shiftY
              }px)`;

              return (
                <div
                  key={index}
                  className="absolute transition-transform hover:scale-105"
                  style={{
                    maxWidth: bookWidth + "px",
                    width: "28%",
                    maxHeight: bookHeight + "px",
                    minHeight: "180px",
                    height: "45%",
                    zIndex: length - index,
                    transform,
                  }}
                >
                  <Image
                    src={story.thumbnail}
                    className="relative inset-0 h-full w-full rounded-md border border-border object-fill shadow"
                    alt={story.title}
                    width={cardWidth}
                    height={cardHeight}
                    style={{
                      zIndex: readingList.stories.length - index,
                    }}
                  />
                  <div
                    className="absolute -bottom-[5px] -right-[5px] rounded border border-border bg-stone-100 shadow-lg"
                    style={{
                      zIndex: -index,
                      maxWidth: bookWidth + "px",
                      width: "100%",
                      maxHeight: bookHeight + "px",
                      height: "100%",
                    }}
                  ></div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-slate-600">
              <p>No stories added yet</p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ReadingListCard;
