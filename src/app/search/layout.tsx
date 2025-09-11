import type { Metadata } from "next";
import React from "react";
import { generateSEOMetadata } from "~/utils/site";

export const metadata: Metadata = generateSEOMetadata({
  title: "Search for novels, stories, author",
  pathname: "/search",
});

const SearchLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default SearchLayout;
