import BookSection from "~/app/_components/shared/books-section";
import { api } from "~/trpc/server";

const LatestAndRising = async () => {
  const [latest, rising] = await Promise.all([
    api.story.latest({
      limit: 4,
    }),
    api.story.rising({
      limit: 4,
    }),
  ]);

  return (
    <section className="w-full">
      <div className="flex items-center flex-col xl:flex-row gap-2 space-y-8 lg:space-y-0 max-w-[1540px] mx-auto px-4 py-8">
        <div className="w-full xl:flex-1">
          <BookSection
            title="Latest Releases"
            novels={latest}
            multiple={true}
          />
        </div>
        <div className="w-full xl:flex-1">
          <BookSection title="Rising Stars" novels={rising} multiple={true} />
        </div>
      </div>
    </section>
  );
};

export default LatestAndRising;
