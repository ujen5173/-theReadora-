import { ArrowDown } from "lucide-react";
import { cn } from "~/lib/utils";
import NovelCard, { type TCard } from "./novel-card";

const BookSection = ({
  title,
  scrollable = false,
  removeHeader = false,
  novels = [],
  multiple = false,
  isAuthorViewer = false,
  customEmptyContainer = (
    <div className="flex items-center min-h-40 justify-center w-full h-full">
      <p className="text-gray-600 text-lg font-semibold">
        Not Enough Data to show
      </p>
    </div>
  ),
}: {
  title: string;
  scrollable?: boolean;
  removeHeader?: boolean;
  novels: TCard[];
  multiple?: boolean;
  isAuthorViewer?: boolean;
  customEmptyContainer?: React.ReactNode;
}) => {
  return (
    <section className="w-full">
      <div className={cn(!multiple ? "max-w-[1540px] mx-auto px-4 py-8" : "")}>
        {!removeHeader && (
          <div className="flex mb-4 items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-primary">
              {title}
            </h1>
            <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
        )}

        {novels.length === 0 ? (
          customEmptyContainer
        ) : (
          <div className="grid grid-cols-2 xxs:grid-cols-3 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2">
            {novels.map((novel) => (
              <NovelCard
                isAuthorViewer={isAuthorViewer}
                key={novel.slug}
                details={novel}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookSection;
