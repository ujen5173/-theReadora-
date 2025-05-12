"use client";

import type { Story } from "@prisma/client";
import { Analytics01Icon, BookOpen01Icon, Edit01Icon } from "hugeicons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { env } from "~/env";
import { useChapterStore } from "~/store/useChapter";
import { useUserStore } from "~/store/userStore";
import { api } from "~/trpc/react";
import AddToList from "../../shared/add-to-list";
import PremiumBanner from "../../shared/premium-banner";
import ShareDialog from "../../shared/share-dialog";
import { StarRating } from "./star-rating";

interface ThumbnailSectionProps {
  story: Story;
}

const ThumbnailSection = ({ story }: ThumbnailSectionProps) => {
  const { data: rating } = api.user.getRating.useQuery({
    storyId: story.id,
  });
  const [mounted, setMounted] = useState(false);
  const { user } = useUserStore();
  const { chapter } = useChapterStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <section className="w-full space-y-6">
      <div className="w-full h-auto shadow-lg rounded-md">
        <Image
          src={story.thumbnail as string}
          width={600}
          height={1440}
          draggable={false}
          className="rounded-md w-full select-none object-cover aspect-[1/1.5]"
          alt={story.title}
        />
      </div>

      <div className="space-y-2">
        <Button
          onClick={() => {
            router.push(`/chapter/${chapter?.slug}`);
          }}
          variant={"default"}
          icon={BookOpen01Icon}
          className="w-full"
        >
          Start Reading
        </Button>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"outline"} className="w-full bg-white">
                <div className="flex items-center gap-2">
                  <StarRating
                    storyId={story.id}
                    isInteractive
                    rating={story.ratingAvg}
                    className="flex-shrink-0"
                  />
                  <span className="text-sm text-muted-foreground">
                    {`(${story.ratingCount})` || "..."}
                  </span>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent variant="outline" className="text-sm" side="top">
              {rating ? (
                <p>Your rating: {rating.rating}</p>
              ) : (
                <p>Rate this story</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {user?.id === story.authorId ? (
          <>
            <Button
              variant={"outline"}
              icon={Analytics01Icon}
              className="w-full bg-white"
            >
              View Analytics
            </Button>
            <Button
              variant={"outline"}
              icon={Edit01Icon}
              className="w-full bg-white"
            >
              Edit Story
            </Button>
          </>
        ) : (
          <AddToList storyId={story.id} />
        )}

        <ShareDialog
          title={story.title}
          url={`${env.NEXT_PUBLIC_APP_URL}/story/${story.slug}`}
        />
      </div>

      <PremiumBanner />
    </section>
  );
};

export default ThumbnailSection;
