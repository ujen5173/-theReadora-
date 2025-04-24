import StoryDetailsSection from "~/app/_components/layouts/single-story/story-details-section";
import ThumbnailSection from "~/app/_components/layouts/single-story/thumbnail-section";
import StoryNotFound from "~/app/_components/shared/StoryNotFound";
import { api } from "~/trpc/server";
import { generateSEOMetadata } from "~/utils/site";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const generateMetadata = async ({ params }: PageProps) => {
  const slug = await params;
  const story = await api.story.byID_or_slug({
    query: slug.slug,
  });

  return generateSEOMetadata({
    title: `${story.title} by ${story.author.name}`,
    description: story.synopsis,
    image: story.thumbnail as string,
    pathname: `/story/${story.slug}`,
  });
};

const SingleStory = async ({ params }: PageProps) => {
  const slug = await params;

  const story = await api.story.byID_or_slug({
    query: slug.slug,
  });

  if (!story) {
    return <StoryNotFound />;
  }

  return (
    <section className="w-full">
      <div className="flex border-b border-border max-w-[1240px] mx-auto px-4 py-10 gap-10">
        {/* Thumbnail and actions */}
        <div className="flex-1 min-w-72 max-w-96">
          <ThumbnailSection story={story} />
        </div>

        {/* Story details */}
        <div className="flex-[5]">
          <StoryDetailsSection story={story} />
        </div>
      </div>
    </section>
  );
};

export default SingleStory;
