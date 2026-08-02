import BookSection from "~/app/_components/shared/books-section";
import { api } from "~/trpc/server";

const Recommendations = async () => {
  const recommendations = await api.story.recommendations({
    limit: 8,
  });

  return (
    <BookSection
      fillRows
      seeAllHref="/search"
      title="Recommendations"
      novels={recommendations}
      analyticsRef="feed:recommendation"
      multiple={false}
    />
  );
};

export default Recommendations;

export const revalidate = 60;
