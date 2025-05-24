import { Suspense } from "react";
import { toast } from "sonner";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/server";
import StoryEditor from "./wrapper";

const ChapterPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ chapter_id: string | undefined }>;
}) => {
  const params = await searchParams;

  let chapterDetail = null;

  if (params.chapter_id) {
    try {
      chapterDetail = await api.chapter.getDataForEdit({
        chapter_id: params.chapter_id,
      });
    } catch (error) {
      toast.error("Failed to load chapter data. Please try again.");
    }
  }

  return (
    <Suspense
      fallback={
        <div className="p-4">
          <Skeleton className="h-[80vh] w-full" />
        </div>
      }
    >
      <StoryEditor chapterDetail={chapterDetail} randomNumber={Math.random()} />
    </Suspense>
  );
};

export default ChapterPage;
