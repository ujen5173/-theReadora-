import BookSection from "~/app/_components/shared/books-section";

const Recommendations = () => {
  return (
    <>
      <BookSection
        title="Recommendations"
        scrollable={true}
        novels={[]}
        multiple={false}
      />
    </>
  );
};

export default Recommendations;
