import { type Metadata } from "next";

// Site Configuration
export const siteConfig = {
  name: "Readora",
  title: "Readora - Where Stories Come Alive",
  description:
    "Discover and share your stories on Readora. A modern platform for readers and writers to explore, create, and connect through storytelling.",
  url: "https://readora.com",
  ogImage: "https://readora.com/og-image.jpg",
  links: {
    twitter: "https://twitter.com/readora",
    github: "https://github.com/readora",
    discord: "https://discord.gg/readora",
    pinterest: "https://www.pinterest.com/readora",
    instagram: "https://www.instagram.com/readora",
  },
  creator: {
    name: "Ujen Basi",
    twitter: "@BasiUjen93357",
  },
} as const;

// Navigation Links
export const navigationLinks = {
  footer: {
    company: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Safety", href: "/safety" },
      { name: "Terms", href: "/terms" },
      { name: "Privacy", href: "/privacy" },
    ],
    community: [
      { name: "Guidelines", href: "/guidelines" },
      { name: "Discord", href: siteConfig.links.discord },
      { name: "Twitter", href: siteConfig.links.twitter },
    ],
  },
} as const;

// Genre Categories
export const genreCategories = [
  { name: "Romance", slug: "romance" },
  { name: "Fantasy", slug: "fantasy" },
  { name: "Science Fiction", slug: "sci-fi" },
  { name: "Mystery", slug: "mystery" },
  { name: "Horror", slug: "horror" },
  { name: "Thriller", slug: "thriller" },
  { name: "Historical Fiction", slug: "historical-fiction" },
  { name: "Contemporary", slug: "contemporary" },
  { name: "Literary Fiction", slug: "literary-fiction" },
  { name: "Young Adult", slug: "young-adult" },
  { name: "New Adult", slug: "new-adult" },
  { name: "Children's", slug: "children" },
] as const;

// SEO Metadata Generator
interface SEOMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  pathname?: string;
}

export function generateSEOMetadata({
  title,
  description,
  image,
  noIndex = false,
  pathname = "",
}: SEOMetadataProps = {}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;

  const metaDescription = description ?? siteConfig.description;
  const metaImage = image ?? siteConfig.ogImage;
  const url = `${siteConfig.url}${pathname}`;

  return {
    title: metaTitle,
    description: metaDescription,
    authors: [{ name: siteConfig.creator.name }],
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: siteConfig.creator.twitter,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
  };
}

// Social Sharing
export const socialShare = {
  platforms: [
    {
      name: "Twitter",
      shareUrl: "https://twitter.com/intent/tweet?url=",
      icon: "twitter",
    },
    {
      name: "Facebook",
      shareUrl: "https://www.facebook.com/sharer/sharer.php?u=",
      icon: "facebook",
    },
    {
      name: "WhatsApp",
      shareUrl: "https://wa.me/?text=",
      icon: "whatsapp",
    },
  ],
} as const;
