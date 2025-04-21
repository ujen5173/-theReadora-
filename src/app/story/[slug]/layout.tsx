import type { Metadata } from "next";
import React from "react";
import { generateSEOMetadata } from "~/utils/site";

export const metadata: Metadata = generateSEOMetadata({});

const SingleStoryLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default SingleStoryLayout;
