import BookSection from "~/app/_components/shared/books-section";
import { api } from "~/trpc/server";

const TrendingSection = async () => {
  const stories = await api.story.rising({
    limit: 8,
  });

  return (
    <BookSection
      title="Discover Trending Reads"
      scrollable={true}
      novels={stories}
    />
  );
};

export default TrendingSection;
