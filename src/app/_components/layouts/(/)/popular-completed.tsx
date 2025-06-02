import BookSection from "~/app/_components/shared/books-section";
import { api } from "~/trpc/server";

const PopularCompleted = async () => {
  const completed = await api.story.completedStories({
    limit: 8,
  });

  return <BookSection title="Completed Novel" novels={completed} />;
};

export default PopularCompleted;
