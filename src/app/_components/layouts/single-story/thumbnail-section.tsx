import {
  Analytics01Icon,
  BookmarkCheck02Icon,
  BookOpen01Icon,
  Edit01Icon,
  Share01Icon,
} from "hugeicons-react";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import PremiumBanner from "../../shared/premium-banner";
import type { Story } from "@prisma/client";
import { auth } from "~/server/auth";

interface ThumbnailSectionProps {
  story: Story;
}

const ThumbnailSection = async ({ story }: ThumbnailSectionProps) => {
  const user = await auth();

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
        <Button variant={"default"} icon={BookOpen01Icon} className="w-full">
          Start Reading
        </Button>
        <Button variant={"outline"} className="w-full bg-white">
          <div className="flex items-center gap-1">
            <StarIcon className="size-5" />
            <StarIcon className="size-5" />
            <StarIcon className="size-5" />
            <StarIcon className="size-5" />
            <StarIcon className="size-5" />
            <span className="ml-2">...</span>
          </div>
        </Button>
        {user?.user.id === story.authorId ? (
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
            <Button
              variant={"outline"}
              icon={Share01Icon}
              className="w-full bg-white"
            >
              Share
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={"outline"}
              icon={BookmarkCheck02Icon}
              className="w-full bg-white"
            >
              Save to List
            </Button>
            <Button
              variant={"outline"}
              icon={Share01Icon}
              className="w-full bg-white"
            >
              Share
            </Button>
          </>
        )}
      </div>

      <PremiumBanner />
    </section>
  );
};

export default ThumbnailSection;
