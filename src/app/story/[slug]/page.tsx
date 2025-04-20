import Header from "~/app/_components/layouts/header";
import StoryDetailsSection from "~/app/_components/layouts/single-story/story-details-section";
import ThumbnailSection from "~/app/_components/layouts/single-story/thumbnail-section";

const SingleStory = () => {
  return (
    <>
      <Header />

      <section className="w-full">
        <div className="flex border-b border-border max-w-[1240px] mx-auto px-4 py-10 gap-10">
          {/* Thumnail and actions */}
          <div className="flex-1 min-w-72 max-w-96">
            <ThumbnailSection />
          </div>

          {/* Story details */}
          <div className="flex-[5]">
            <StoryDetailsSection />
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleStory;
