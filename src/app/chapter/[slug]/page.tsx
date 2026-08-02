import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import ChapterContent from "~/app/_components/layouts/chapter-page/chapter-content";
import ChapterTOC from "~/app/_components/layouts/chapter-page/chapter-toc";
import ChapterWrapper from "~/app/_components/layouts/chapter-page/wrapper";
import { api } from "~/trpc/server";
import { generateSEOMetadata, siteConfig } from "~/utils/site";

// Cached so generateMetadata and the page body share a single query.
const getChapter = cache(async (slug: string) => {
  try {
    return await api.chapter.getChapterDetailsBySlugOrId({ slugOrId: slug });
  } catch {
    return null;
  }
});

/** Strip HTML and collapse whitespace so chapter prose can seed a meta description. */
function toPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const details = await getChapter(slug);

  if (!details) {
    return generateSEOMetadata({
      title: "Chapter not found",
      noIndex: true,
      pathname: `/chapter/${slug}`,
    });
  }

  const { chapter, story, initialChunk } = details;
  const authorName = story.author?.name ?? siteConfig.creator.name;
  const excerpt = toPlainText(initialChunk?.content ?? "");

  const description = excerpt
    ? truncate(excerpt, 155)
    : `Read chapter ${chapter.chapterNumber}, "${chapter.title}", of ${story.title} by ${authorName} on ${siteConfig.name}.`;

  return generateSEOMetadata({
    title: `${chapter.title} — ${story.title} (Chapter ${chapter.chapterNumber})`,
    description,
    // Canonicalise to the id. `Chapter.slug` is only unique per story
    // (@@unique([storyId, slug])), so a bare slug URL is ambiguous across stories.
    pathname: `/chapter/${chapter.id}`,
    image: story.thumbnail ?? undefined,
    type: "article",
    author: authorName,
    publishedTime: chapter.createdAt?.toISOString(),
    keywords: [story.title, chapter.title, "read online", "free chapter"],
  });
}

const SingleChapterPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const chapter = await getChapter(slug);

  if (!chapter) {
    notFound();
  }

  const userUnlockedChapter = await api.chapter.getUserUnlockedChapter({
    chapterId: chapter.chapter.id,
  });

  const canonicalPath = `/chapter/${chapter.chapter.id}`;
  const chapterSchema = {
    "@context": "https://schema.org",
    "@type": "Chapter",
    name: chapter.chapter.title,
    position: chapter.chapter.chapterNumber,
    url: `${siteConfig.url}${canonicalPath}`,
    datePublished: chapter.chapter.createdAt?.toISOString(),
    dateModified: chapter.chapter.updatedAt?.toISOString(),
    isPartOf: {
      "@type": "Book",
      name: chapter.story.title,
      url: `${siteConfig.url}/story/${chapter.story.slug}`,
      ...(chapter.story.thumbnail && { image: chapter.story.thumbnail }),
      author: {
        "@type": "Person",
        name: chapter.story.author?.name ?? siteConfig.creator.name,
        ...(chapter.story.author?.username && {
          url: `${siteConfig.url}/profile?username=${chapter.story.author.username}`,
        }),
      },
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chapterSchema) }}
      />
      <ChapterWrapper details={chapter}>
        <ChapterTOC />
        <ChapterContent
          userUnlockedChapter={userUnlockedChapter}
          details={chapter}
        />
      </ChapterWrapper>
    </>
  );
};

export default SingleChapterPage;
