import { LibraryIcon } from "hugeicons-react";
import { Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import BookSection from "~/app/_components/shared/books-section";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

const RecentReadsAndLegendsShelf = async () => {
  const [recentReads, legendsShelf] = await Promise.all([
    api.story.recentReads({ limit: 4 }),
    api.story.theLegendsSelf({ limit: 4 }),
  ]);

  return (
    <section className="w-full">
      <div className="flex items-center flex-col xl:flex-row gap-2 space-y-8 lg:space-y-0 max-w-[1540px] mx-auto px-4 py-8">
        <div className="w-full xl:flex-1">
          <BookSection
            title="Recent Reads"
            titleIcon={LibraryIcon}
            iconStyle="text-primary"
            novels={recentReads}
            customEmptyContainer={
              <div className="flex items-center flex-col min-h-[22rem] space-y-4 justify-center w-full h-full">
                <p className="text-gray-600 text-lg font-semibold">
                  Silence. Too silent. Let’s break it with a read.
                </p>
                <Button
                  variant={"dark"}
                  effect="shineHover"
                  asChild
                  icon={Sparkles}
                >
                  <Link href="/story/secret-of-wyrith">Suprise me</Link>
                </Button>
              </div>
            }
            multiple={true}
          />
        </div>
        <div className="w-full xl:flex-1">
          <BookSection
            title="The Legends Shelf"
            titleIcon={Crown}
            iconStyle="text-primary"
            novels={legendsShelf}
            customEmptyContainer={
              <div className="flex items-center flex-col min-h-[22rem] space-y-4 justify-center w-full h-full">
                <p className="text-gray-600 text-lg font-semibold">
                  This shelf’s empty—wanna change that?
                </p>
                <Button
                  variant={"outline"}
                  effect="shineHover"
                  asChild
                  icon={Crown}
                >
                  <Link href="/write?source=the-legends-staff">
                    Claim the Shelf
                  </Link>
                </Button>
              </div>
            }
            multiple={true}
          />
        </div>
      </div>
    </section>
  );
};

export default RecentReadsAndLegendsShelf;
