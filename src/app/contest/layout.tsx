import type { Metadata } from "next";
import { type ReactNode } from "react";
import { generateSEOMetadata } from "~/utils/site";
import Header from "../_components/layouts/header";

export const metadata: Metadata = generateSEOMetadata({
  title: "Writing Contests",
  description:
    "Enter Readora's writing contests, compete with writers worldwide, and get your story in front of new readers.",
  pathname: "/contest",
  keywords: ["writing contest", "story competition", "writing challenge"],
});

const ContestLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header full removeBackground />
      {children}
    </>
  );
};

export default ContestLayout;
