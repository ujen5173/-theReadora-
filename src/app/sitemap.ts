import { type MetadataRoute } from "next";
import { genreCategories, siteConfig } from "~/utils/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Base routes
  const routes = [
    "",
    "/about",
    "/premium",
    "/auth/login",
    "/auth/register",
    "/search",
    "/reading-list",
    "/write",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // Genre routes
  const genreRoutes = genreCategories.map((genre) => ({
    url: `${baseUrl}/genres/${genre.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...routes, ...genreRoutes];
}
