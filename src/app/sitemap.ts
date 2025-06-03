import { type MetadataRoute } from "next";
import { postgresDb } from "~/server/postgresql";
import { siteConfig } from "~/utils/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Base routes
  const routes = [
    "/about",
    "/premium",
    "/auth/signin",
    "/search",
    "/reading-list",
    "/write",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  const genres = await postgresDb.genres.findMany({
    select: { slug: true },
  });

  // Genre routes
  const genreRoutes = genres.map((genre) => ({
    url: `${baseUrl}/genres/${genre.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...routes, ...genreRoutes];
}
