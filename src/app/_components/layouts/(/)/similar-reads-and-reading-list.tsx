import BookSection from "~/app/_components/shared/books-section";
import ReadingList from "~/app/_components/shared/reading-list";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

const SimilarReadsNReadingList = async () => {
  const user = await auth();
  const readingLists = await api.list.getUserReadingList({
    userId: user?.user.id ?? "",
  });

  return (
    <section className="w-full">
      <div className="flex items-start gap-2 max-w-[1440px] mx-auto px-4 py-8">
        <div className="flex-1">
          <BookSection
            title="Similar Reads"
            scrollable={true}
            novels={[]}
            customEmptyContainer={
              <div className="flex items-center min-h-40 justify-center w-full h-full">
                <p className="text-gray-600 text-lg font-semibold">
                  Start reading to see similar reads
                </p>
              </div>
            }
            multiple={true}
          />
        </div>
        <div className="flex-1">
          <ReadingList readinglists={readingLists} />
        </div>
      </div>
    </section>
  );
};

export default SimilarReadsNReadingList;
