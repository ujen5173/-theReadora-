import BookSection from "~/app/_components/shared/books-section";
import { api } from "~/trpc/server";

const Recommendations = async () => {
  const recommendations = await api.story.recommendations({
    limit: 8,
  });

  return (
    <BookSection
      title="Recommendations"
      novels={recommendations}
      multiple={false}
    />
  );
};

export default Recommendations;
