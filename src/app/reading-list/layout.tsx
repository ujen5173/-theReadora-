import type { Metadata } from "next";
import type { ReactNode } from "react";
import { generateSEOMetadata } from "~/utils/site";

// Auth-gated (see proxy.ts matcher) — never useful in search results.
export const metadata: Metadata = generateSEOMetadata({
  title: "My Reading List",
  description: "Stories you have saved to read on Readora.",
  noIndex: true,
});

const ReadingListLayout = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

export default ReadingListLayout;
