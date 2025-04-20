import BookSection from "~/app/_components/shared/books-section";

const TrendingSection = () => {
  return (
    <BookSection
      title="Discover Trending Reads"
      scrollable={true}
      novels={[]}
    />
  );
};

export default TrendingSection;
