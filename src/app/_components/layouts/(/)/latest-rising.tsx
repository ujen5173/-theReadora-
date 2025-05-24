import BookSection from "~/app/_components/shared/books-section";

const LatestAndRising = () => {
  return (
    <section className="w-full">
      <div className="flex items-center gap-2 max-w-[1540px] mx-auto px-4 py-8">
        <div className="flex-1">
          <BookSection
            title="Latest Releases"
            scrollable={true}
            novels={[]}
            multiple={true}
          />
        </div>
        <div className="flex-1">
          <BookSection
            title="Rising Stars"
            scrollable={true}
            novels={[]}
            multiple={true}
          />
        </div>
      </div>
    </section>
  );
};

export default LatestAndRising;
