import { notFound } from "next/navigation";
import ChapterContent from "~/app/_components/layouts/chapter-page/chapter-content";
import ChapterTOC from "~/app/_components/layouts/chapter-page/chapter-toc";
import ChapterWrapper from "~/app/_components/layouts/chapter-page/wrapper";
import IncreaseReadCount from "~/app/_components/shared/increase-read-count";
import { api } from "~/trpc/server";

const SingleChapterPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const chapter = await api.chapter.getChapterDetailsBySlugOrId({
    slugOrId: slug,
  });

  const userUnlockedChapter = await api.chapter.getUserUnlockedChapter({
    chapterId: chapter.chapter.id,
  });

  if (!chapter) {
    notFound();
  }

  return (
    <ChapterWrapper details={chapter}>
      <div className="min-h-screen flex flex-col">
        <IncreaseReadCount />
        <ChapterTOC />
        <ChapterContent userUnlockedChapter={userUnlockedChapter} />
        {/* <ChapterFooter />
        <RecommendedStories /> */}
      </div>
    </ChapterWrapper>
  );
};

export default SingleChapterPage;
