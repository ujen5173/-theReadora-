"use client";
import type { Story } from "@prisma/client";
import { Analytics01Icon, BookOpen01Icon, Edit01Icon } from "hugeicons-react";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { env } from "~/env";
import { useChapterStore } from "~/store/useChapter";
import { useUserStore } from "~/store/userStore";
import AddToList from "../../shared/add-to-list";
import PremiumBanner from "../../shared/premium-banner";
import ShareDialog from "../../shared/share-dialog";

interface ThumbnailSectionProps {
  story: Story;
}

const ThumbnailSection = ({ story }: ThumbnailSectionProps) => {
  const user = useUserStore();
  const { chapter } = useChapterStore();
  const router = useRouter();

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
        {user?.user?.id === story.authorId ? (
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
