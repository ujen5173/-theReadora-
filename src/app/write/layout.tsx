import type { Metadata } from "next";
import React from "react";
import { generateSEOMetadata } from "~/utils/site";

export const metadata: Metadata = generateSEOMetadata({
  title: "Write Your Story | Readora",
  description:
    "Start writing your story on Readora. Share your creativity with our community of readers and writers. Get feedback, build your audience, and grow as a writer.",
  pathname: "/write",
  keywords: [
    "write stories",
    "story writing",
    "publish stories",
    "writing platform",
    "author tools",
    "story creation",
  ],
});

const WritingLayout = async ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default WritingLayout;
