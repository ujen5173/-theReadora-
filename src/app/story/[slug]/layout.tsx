import type { Metadata } from "next";
import React from "react";
import Header from "~/app/_components/layouts/header";
import { generateSEOMetadata, siteConfig } from "~/utils/site";

export const metadata: Metadata = generateSEOMetadata({});

const SingleStoryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${siteConfig.url}/`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Stories",
                item: `${siteConfig.url}/search`,
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
};

export default SingleStoryLayout;
