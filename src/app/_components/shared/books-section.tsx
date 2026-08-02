import { ArrowRight01Icon } from "hugeicons-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import NovelCard, { type TCard } from "./novel-card";

const BookSection = ({
  title,
  titleIcon: TitleIcon,
  iconStyle = "",
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
  analyticsRef = undefined,
  headerAddon = undefined,
  fillRows = false,
  seeAllHref = undefined,
}: {
  title: string;
  titleIcon?: React.ElementType;
  iconStyle?: string;
  removeHeader?: boolean;
  novels: TCard[];
  multiple?: boolean;
  isAuthorViewer?: boolean;
  customEmptyContainer?: React.ReactNode;
  analyticsRef?: string | undefined;
  headerAddon?: React.ReactNode;
  /**
   * Clamp the grid to complete rows at every breakpoint.
   *
   * The homepage shelves fetch a fixed 8 stories into a grid that is 7 columns
   * wide at xl, which left a single orphaned cover stranded on a second row.
   * Opt-in because lists like a profile's works or a reading list must show
   * every item, orphan row or not.
   */
  fillRows?: boolean;
  /** Where the shelf's full listing lives. Omit to render no link. */
  seeAllHref?: string;
}) => {
  return (
    <section className="w-full">
      <div className={cn(!multiple ? "max-w-[1540px] mx-auto px-4 py-8" : "")}>
        {!removeHeader && (
          <div className="flex mb-4 items-center gap-2 relative">
            {TitleIcon && <TitleIcon className={iconStyle} />}
            <h2 className="text-xl sm:text-2xl font-semibold text-primary">
              {title}
            </h2>
            {headerAddon}

            {/* A shelf shows one row of many. `seeAllHref` gives that row an
                exit; without one we render nothing, because the old downward
                chevron implied expand-collapse and did nothing when clicked. */}
            {seeAllHref && (
              <Link
                href={seeAllHref}
                className="group flex items-center gap-1 ml-auto rounded-md font-medium text-primary text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Browse all
                <ArrowRight01Icon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        )}

        {novels.length === 0 ? (
          customEmptyContainer
        ) : (
          <div
            className={cn(
              "grid grid-cols-2 xxs:grid-cols-3 xs:grid-cols-3 sm:grid-cols-4 gap-2",
              multiple
                ? "md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-4"
                : "md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8",
              // `.shelf-row` lives in globals.css — see the note there on why
              // this can't be expressed as Tailwind arbitrary variants.
              fillRows && !multiple && "shelf-row",
            )}
          >
            {novels.map((novel) => (
              <NovelCard
                isAuthorViewer={isAuthorViewer}
                key={novel.slug}
                details={novel}
                referrer={analyticsRef}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookSection;
