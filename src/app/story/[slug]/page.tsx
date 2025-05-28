import StoryDetailsSection from "~/app/_components/layouts/single-story/story-details-section";
import ThumbnailSection from "~/app/_components/layouts/single-story/thumbnail-section";
import StoryNotFound from "~/app/_components/shared/story-not-found";
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
      <div className="flex flex-wrap max-w-[1240px] mx-auto px-4 py-10 gap-5 lg:gap-10">
        <div className="flex-1 min-w-72 mx-auto">
          <ThumbnailSection story={story} />
        </div>

        <div className="flex-[5]">
          <StoryDetailsSection story={story} />
        </div>
      </div>
    </section>
  );
};

export default SingleStory;
