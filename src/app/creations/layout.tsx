import type { Metadata } from "next";
import type { ReactNode } from "react";
import { generateSEOMetadata } from "~/utils/site";

// Auth-gated (see proxy.ts matcher) — never useful in search results.
export const metadata: Metadata = generateSEOMetadata({
  title: "My Creations",
  description: "Manage the stories you have written on Readora.",
  noIndex: true,
});

const CreationsLayout = ({ children }: { children: ReactNode }) => <>{children}</>;

export default CreationsLayout;
