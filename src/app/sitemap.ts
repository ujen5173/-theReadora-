import { type MetadataRoute } from "next";
import { api } from "~/trpc/server";
import { siteConfig } from "~/utils/site";

// Sitemaps are cached for an hour rather than rebuilt per crawl.
export const revalidate = 3600;

/** Public routes that aren't generated from the database. */
const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/search", priority: 0.8, changeFrequency: "daily" },
  { path: "/write", priority: 0.6, changeFrequency: "weekly" },
  { path: "/premium", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contest", priority: 0.5, changeFrequency: "weekly" },
  { path: "/comparision", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/careers", priority: 0.5, changeFrequency: "weekly" },
  { path: "/guidelines", priority: 0.4, changeFrequency: "monthly" },
  { path: "/terms-of-use", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const [stories, chapters] = await Promise.all([
    api.story.sitemapList().catch(() => []),
    api.story.sitemapChapters().catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const storyEntries: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `${base}/story/${s.slug}`,
    lastModified: new Date(s.updatedAt),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Chapters are the deepest and most numerous content pages, and the natural
  // landing page for long-tail "«story title» chapter N" queries.
  const chapterEntries: MetadataRoute.Sitemap = chapters.map((c) => ({
    url: `${base}/chapter/${c.id}`,
    lastModified: new Date(c.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...storyEntries, ...chapterEntries];
}
