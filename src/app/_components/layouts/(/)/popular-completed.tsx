import BookSection from "~/app/_components/shared/books-section";
import { api } from "~/trpc/server";

const PopularCompleted = async () => {
  const completed = await api.story.completedStories({
    limit: 8,
  });

  return (
    <BookSection
      fillRows
      seeAllHref="/search"
      title="Completed Novel"
      analyticsRef="feed:popular-completed"
      novels={completed}
    />
  );
};

export default PopularCompleted;

export const revalidate = 60;
