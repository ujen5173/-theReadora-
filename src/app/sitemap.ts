import { type MetadataRoute } from "next";
import { api } from "~/trpc/server";
import { siteConfig } from "~/utils/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const stories = await api.story.sitemapList();
  const storyEntries =
    stories?.map((s) => ({
      url: `${base}/story/${s.slug}`,
      lastModified: new Date(s.updatedAt),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })) ?? [];

  return [
    {
      url: `${base}/`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/write`,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${base}/premium`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...storyEntries,
  ];
}
