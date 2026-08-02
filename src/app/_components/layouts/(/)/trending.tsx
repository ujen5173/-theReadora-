import BookSection from "~/app/_components/shared/books-section";
import { api } from "~/trpc/server";

const TrendingSection = async () => {
  const stories = await api.story.rising({
    limit: 8,
  });

  return (
    <BookSection
      fillRows
      seeAllHref="/search"
      title="Discover Trending Reads"
      analyticsRef="feed:trending"
      novels={stories}
    />
  );
};

export default TrendingSection;

export const revalidate = 60;
