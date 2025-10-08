import type { Metadata } from "next";
import React from "react";
import { generateSEOMetadata } from "~/utils/site";

export const metadata: Metadata = generateSEOMetadata({
  title: "Search stories, novels, and authors",
  description: "Find stories by genre, tags, and authors on Readora.",
  pathname: "/search",
});

const SearchLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default SearchLayout;
