import { type Metadata } from "next";

export const siteConfig = {
  name: "Readora",
  title: "Readora - Where Stories Come Alive",
  description:
    "Readora connects a global community of millions of readers and writers through the power of story. Discover romance, fanfiction, teen fiction, and more.",
  url: "https://thereadora.vercel.app",
  ogImage: "https://thereadora.vercel.app/og-image.jpg",
  keywords: [
    "online reading",
    "free stories",
    "writing platform",
    "story sharing",
    "reading community",
    "online books",
    "free novels",
    "writing community",
    "story platform",
    "read online",
    "romance stories",
    "fanfiction",
    "teen fiction",
    "social reading",
    "story community",
  ],
  links: {
    twitter: "https://twitter.com/readora",
    github: "https://github.com/readora",
    discord: "https://discord.gg/readora",
    pinterest: "https://www.pinterest.com/readora",
    instagram: "https://www.instagram.com/readora",
  },
  creator: {
    name: "Ujen Basi",
  },
} as const;

export const storyCategories = {
  popular: [
    {
      name: "Romance Stories",
      href: "/search?genre=Romance",
      description: "Love stories that will make your heart flutter",
    },
    {
      name: "Drama / Realistic Fiction Stories",
      href: "/search?genre=Drama+%2F+Realistic+Fiction",
      description: "Stories inspired by your favorite characters and worlds",
    },
    {
      name: "Fantasy Romance",
      href: "/search?genre=Fantasy+Romance",
      description: "Magical love stories with supernatural elements",
    },
    {
      name: "Mystery & Thriller",
      href: "/search?genre=Mystery+%2F+Thriller",
      description: "Suspenseful stories that keep you on edge",
    },
    {
      name: "Fantasy",
      href: "/search?genre=Fantasy",
      description: "Magical worlds and supernatural adventures",
    },
    {
      name: "Horror",
      href: "/search?genre=Horror",
      description: "Dark tales that will send chills down your spine",
    },
  ],
  all: [
    "Romance",
    "Fanfiction",
    "Teen Fiction",
    "Mystery",
    "Thriller",
    "Fantasy",
    "Werewolf",
    "Vampire",
    "Historical Fiction",
    "Science Fiction",
    "Horror",
    "Adventure",
    "Contemporary",
    "Paranormal",
    "New Adult",
    "LGBTQ+",
    "Poetry",
    "Short Story",
    "Humor",
    "Action",
    "Drama",
  ],
} as const;

export const navigationLinks = {
  main: [
    { name: "Home", href: "/" },
    { name: "Browse", href: "/browse" },
    { name: "Community", href: "/community" },
    { name: "Write", href: "/write" },
    { name: "Contests", href: "/contests" },
  ],
  browse: [
    { name: "What's Hot", href: "/browse/hot" },
    { name: "New Stories", href: "/browse/new" },
    { name: "Featured", href: "/browse/featured" },
    { name: "Completed", href: "/browse/completed" },
    { name: "By Genre", href: "/browse/genres" },
  ],
  footer: {
    company: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Safety", href: "/safety" },
      { name: "Join Affiliate Program", href: "/affiliate" },
      { name: "Terms", href: "/terms-of-use" },
      { name: "Privacy", href: "/privacy-policy" },
    ],
    community: [
      { name: "Guidelines", href: "/guidelines" },
      { name: "Writing Contests", href: "/contests" },
      { name: "Discord", href: siteConfig.links.discord },
      { name: "Twitter", href: siteConfig.links.twitter },
      { name: "Instagram", href: siteConfig.links.instagram },
    ],
  },
} as const;

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Readora",
  url: "https://thereadora.vercel.app",
  description:
    "A global community of readers and writers sharing stories across multiple genres",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://thereadora.vercel.app/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "Readora",
    url: "https://thereadora.vercel.app",
  },
  audience: {
    "@type": "Audience",
    audienceType: "readers and writers",
  },
  genre: storyCategories.all,
};

export const storyStructuredData = {
  "@context": "https://schema.org",
  "@type": "Book",
  bookFormat: "EBook",
  isAccessibleForFree: true,
  publisher: {
    "@type": "Organization",
    name: "Readora",
  },
};

interface SEOMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  pathname?: string;
  keywords?: string[];
  type?: "website" | "article" | "book";
  author?: string;
  publishedTime?: string;
  genre?: string;
}

export function generateSEOMetadata({
  title,
  description,
  image,
  noIndex = false,
  pathname = "",
  keywords = [],
  type = "website",
  author,
  publishedTime,
  genre,
}: SEOMetadataProps = {}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const metaDescription = description ?? siteConfig.description;
  const metaImage = image ?? siteConfig.ogImage;
  const url = `${siteConfig.url}${pathname}`;
  const metaKeywords = [...siteConfig.keywords, ...keywords].join(", ");

  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    authors: author ? [{ name: author }] : [{ name: siteConfig.creator.name }],
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
      type: type === "article" ? "article" : "website",
      ...(type === "article" &&
        publishedTime && {
          publishedTime,
          authors: author ? [author] : [siteConfig.creator.name],
        }),
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    verification: {
      google: "vHvO1sl7U0_LurLmzNExXkguqkkHYyz5RLuhNSg3AwE",
      yandex: "d5290b42b4bef6ad",
    },
    ...(genre && { category: genre }),
  };

  return metadata;
}

export const socialShare = {
  platforms: [
    {
      name: "Twitter",
      shareUrl: "https://twitter.com/intent/tweet?url=",
      icon: "twitter",
      color: "#1DA1F2",
    },
    {
      name: "Facebook",
      shareUrl: "https://www.facebook.com/sharer/sharer.php?u=",
      icon: "facebook",
      color: "#4267B2",
    },
    {
      name: "WhatsApp",
      shareUrl: "https://wa.me/?text=",
      icon: "whatsapp",
      color: "#25D366",
    },
    {
      name: "Pinterest",
      shareUrl: "https://pinterest.com/pin/create/button/?url=",
      icon: "pinterest",
      color: "#E60023",
    },
    {
      name: "Reddit",
      shareUrl: "https://www.reddit.com/submit?url=",
      icon: "reddit",
      color: "#FF4500",
    },
  ],
} as const;

export const premiumFeatures = {
  benefits: [
    "Ad-free reading experience",
    "Discounts on premium chapters",
    "Get 100 monthly coins",
    "Unlimited Chapters",
    "Unlimited AI Credits",
    "Advanced Writing Tools",
  ],
  pricing: {
    monthly: 4.99,
    yearly: 49.99,
    currency: "USD",
  },
} as const;
