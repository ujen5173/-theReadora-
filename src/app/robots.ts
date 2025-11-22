import { type MetadataRoute } from "next";
import { siteConfig } from "~/utils/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/studio/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
