import { BubbleChatQuestionIcon, LibraryIcon } from "hugeicons-react";
import { Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import BookSection from "~/app/_components/shared/books-section";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

const RecentReadsAndLegendsShelf = async () => {
  const [recentReads, legendsShelf, randomNovel] = await Promise.all([
    api.story.recentReads({ limit: 4 }),
    api.story.theLegendsSelf({ limit: 4 }),
    api.story.random(),
  ]);

  return (
    <>
      {/* <AIContentGenerationSection /> */}
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
                    <Link href={`/story/${randomNovel}`}>Suprise me</Link>
                  </Button>
                </div>
              }
              multiple={true}
            />
          </div>
          <div
            className={cn(
              "w-full xl:flex-1",
              legendsShelf.length > 0 ? "" : "hidden lg:block"
            )}
          >
            <BookSection
              title="The Legends Shelf"
              titleIcon={Crown}
              iconStyle="text-primary"
              novels={legendsShelf}
              headerAddon={
                <Tooltip>
                  <TooltipTrigger className="absolute -top-5 left-0 w-full h-14 pb-10 px-[15rem] flex justify-start">
                    <BubbleChatQuestionIcon className="size-6 text-slate-800" />
                  </TooltipTrigger>
                  <TooltipContent
                    variant="outline"
                    sideOffset={8}
                    className="max-w-[27rem] p-4 w-full"
                    side="bottom"
                  >
                    <p className="w-full font-bold underline mb-3 text-lg text-slate-800">
                      What is Legends Shelf?
                    </p>
                    <p className="w-full text-lg text-slate-700">
                      Top novels of the month, handpicked for their excellence
                      and impact. Only the best stories make it to the Legends
                      Shelf. Updates monthly
                    </p>
                  </TooltipContent>
                </Tooltip>
              }
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
    </>
  );
};

export default RecentReadsAndLegendsShelf;
