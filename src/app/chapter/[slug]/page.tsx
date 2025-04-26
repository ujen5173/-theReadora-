import { notFound } from "next/navigation";
import ChapterContent from "~/app/_components/layouts/chapter-page/chapter-content";
import ChapterFooter from "~/app/_components/layouts/chapter-page/chapter-footer";
import ChapterTOC from "~/app/_components/layouts/chapter-page/chapter-toc";
import RecommendedStories from "~/app/_components/layouts/chapter-page/similar-stories";
import ChapterWrapper from "~/app/_components/layouts/chapter-page/wrapper";
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

  if (!chapter) {
    notFound();
  }

  return (
    <ChapterWrapper details={chapter}>
      <ChapterTOC />
      <ChapterContent />
      <ChapterFooter />
      <RecommendedStories />
    </ChapterWrapper>
  );
};

export default SingleChapterPage;
