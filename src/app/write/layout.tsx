import type { Metadata } from "next";
import React from "react";
import { generateSEOMetadata } from "~/utils/site";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

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

const WritingLayout = async ({
  children,
  searchParams,
  params,
}: {
  children: React.ReactNode;
  searchParams: SearchParams;
  params: { editId: string };
}) => {
  const editId = await searchParams;
  const { editId: editIdParam } = params;
  console.log({ editId, editIdParam });

  return <>{children}</>;
};

export default WritingLayout;
