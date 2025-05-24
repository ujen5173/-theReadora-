"use client";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ChapterPricePool } from "@prisma/client";
import type { JsonValue } from "@prisma/client/runtime/library";
import { LeftToRightListNumberIcon, RecordIcon } from "hugeicons-react";
import {
  ChevronRight,
  GripVertical,
  Loader2,
  Lock,
  MoreVertical,
  Pencil,
  Plus,
  Save,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { CHAPTER_PRICE_POOL } from "~/utils/constants";
import {
  formatDate,
  getReadingTimeText,
  isChapterScheduled,
  parseMetrics,
} from "~/utils/helpers";

interface Chapter {
  id: string;
  title: string;
  createdAt: Date;
  chapterNumber: number;
  metrics: JsonValue;
  isLocked: boolean;
  scheduledFor: Date | null;
  price: ChapterPricePool | null;
}

interface TableOfContentProps {
  storyId: string;
  chapters: Chapter[];
  isAuthor?: boolean;
}

const SortableChapter = ({
  chapter,
  isAuthor,
  unlockedChapters,
  isLoadingLockedChapters,
  storyId,
}: {
  chapter: Chapter;
  isAuthor: boolean;
  unlockedChapters: string[];
  isLoadingLockedChapters: boolean;
  storyId: string;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chapter.id });

  const metrics = parseMetrics(chapter.metrics);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (chapter.scheduledFor && !isAuthor) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative bg-white border border-border rounded-lg p-3 sm:p-4 hover:bg-slate-50  transition-colors"
    >
      <div className="flex justify-between items-center gap-2">
        {isAuthor && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:block border border-transparent transition hover:border-slate-300 h-7 w-7 sm:h-8 sm:w-8"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4 sm:size-5 text-slate-400" />
          </Button>
        )}

        <div className="flex-1 min-w-0">
          <Link
            href={`/chapter/${chapter.id}`}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2"
          >
            <div className="flex flex-1 items-center gap-1 sm:gap-2 min-w-0">
              <span className="block sm:hidden font-medium truncate text-sm text-slate-700">
                0{chapter.chapterNumber}:
              </span>
              <span className="hidden sm:block font-medium text-sm sm:text-base text-slate-700 whitespace-nowrap">
                Chapter {chapter.chapterNumber}:
              </span>
              <span className="text-slate-800 font-semibold text-sm sm:text-base truncate">
                {chapter.title}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {chapter.isLocked && (
                <span
                  className={cn(
                    "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border text-xs sm:text-sm font-semibold flex items-center gap-1",
                    unlockedChapters.includes(chapter.id)
                      ? "bg-green-100 text-green-600 border-green-300"
                      : "bg-primary/20 text-primary border-primary"
                  )}
                >
                  <span className="text-primary">
                    {isLoadingLockedChapters ? (
                      <Loader2 className="animate-spin size-2.5 sm:size-3" />
                    ) : unlockedChapters.includes(chapter.id) ? (
                      <Unlock className="size-3 sm:size-4 text-green-600" />
                    ) : (
                      <Lock className="size-3 sm:size-4" />
                    )}
                  </span>
                  <span>
                    {
                      CHAPTER_PRICE_POOL[
                        chapter.price as keyof typeof CHAPTER_PRICE_POOL
                      ]
                    }{" "}
                    coins
                  </span>
                </span>
              )}
              {chapter.scheduledFor &&
              !isChapterScheduled(chapter.scheduledFor) ? (
                <span className="text-xs sm:text-sm text-primary underline font-semibold">
                  Scheduled for {formatDate(chapter.scheduledFor)}
                </span>
              ) : (
                <span className="text-xs sm:text-sm text-slate-500 font-semibold">
                  {formatDate(chapter.createdAt)}
                </span>
              )}
              <div className="flex items-center gap-1">
                <RecordIcon className="size-1 text-slate-500 fill-slate-500" />
                <span className="text-xs sm:text-sm text-slate-500 font-semibold">
                  {getReadingTimeText(metrics.readingTime)}
                </span>
              </div>
              <ChevronRight className="size-4 sm:size-5 text-slate-500" />
            </div>
          </Link>
        </div>

        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="border border-transparent transition hover:border-slate-300 h-7 w-7 sm:h-8 sm:w-8"
              >
                <MoreVertical className="size-3.5 sm:size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link
                  href={`/write/story-editor/${storyId}?chapter_id=${chapter.id}`}
                  className="flex items-center"
                >
                  <Pencil className="size-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  // Handle delete
                }}
              >
                <Trash2 className="size-4 mr-2 text-red-600" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

const TableOfContent = ({
  storyId,
  chapters: initialChapters,
  isAuthor = false,
}: TableOfContentProps) => {
  const [chapters, setChapters] = useState(initialChapters);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const { mutateAsync, status } = api.chapter.updateChapterOrder.useMutation();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setChapters((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newChapters = arrayMove(items, oldIndex, newIndex).map(
          (chapter, index) => ({
            ...chapter,
            chapterNumber: index + 1,
          })
        );

        setHasOrderChanged(true);
        return newChapters;
      });
    }
  };

  // Reset chapters when initialChapters changes
  useEffect(() => {
    setChapters(initialChapters);
  }, [initialChapters]);

  const handleCancel = () => {
    setChapters(initialChapters);
    setHasOrderChanged(false);
  };

  const updateChapterOrder = async (newChapters: Chapter[]) => {
    try {
      const extractedChapterIdsAndOrders = newChapters.map((chapter) => ({
        chapterId: chapter.id,
        order: chapter.chapterNumber,
      }));

      const { success, message } = await mutateAsync({
        storyId,
        chapterIdsAndOrders: extractedChapterIdsAndOrders,
      });

      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Failed to update chapter order");
    }
  };

  const [addingChapter, setAddingChapter] = useState(false);

  const handleAddChapter = () => {
    setAddingChapter(true);
  };

  const { data, isLoading } = api.user.hasUserUnlockedChapter.useQuery(
    {
      chapterIds: chapters.map((chapter) => chapter.id),
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="border-b my-6 sm:my-8 border-t border-border py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3 sm:gap-0 sm:justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800">
          Table of Contents
        </h2>
        {isAuthor && (
          <Link prefetch href={`/write/story-editor/${storyId}`}>
            <Button
              icon={addingChapter ? Loader2 : Plus}
              onClick={handleAddChapter}
              variant="outline"
              size="sm"
              iconStyle={addingChapter ? "animate-spin" : ""}
              disabled={addingChapter}
              className="w-full sm:w-auto"
            >
              Add Chapter
            </Button>
          </Link>
        )}
      </div>

      {chapters.sort((a, b) => a.chapterNumber - b.chapterNumber).length > 0 ? (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={chapters.map((chapter) => chapter.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {chapters.map((chapter) => (
                  <SortableChapter
                    key={chapter.id}
                    chapter={chapter}
                    isAuthor={isAuthor}
                    unlockedChapters={data ?? []}
                    isLoadingLockedChapters={isLoading}
                    storyId={storyId}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Order Update Section */}
          {hasOrderChanged && (
            <div className="mt-4 sm:mt-6 border-t border-border pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 sm:size-10 rounded-full border border-amber-200 bg-amber-100 flex items-center justify-center">
                    <LeftToRightListNumberIcon className="size-4 sm:size-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm sm:text-base text-slate-800">
                      Chapter Order Changed
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Would you like to save the new chapter order?
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                    icon={X}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      updateChapterOrder(chapters);
                      setHasOrderChanged(false);
                    }}
                    disabled={status === "pending"}
                    className="bg-gradient-to-r from-primary/80 to-primary text-white hover:from-primary hover:to-primary/90 flex-1 sm:flex-none"
                    icon={status !== "pending" ? Save : undefined}
                  >
                    {status === "pending" && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    {status === "pending" ? "Saving..." : "Save Order"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="h-30 flex items-center justify-center py-8">
          <p className="text-slate-700 font-medium text-base sm:text-lg text-center">
            Oops! Chapters are not written yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default TableOfContent;
