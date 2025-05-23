import React from "react";
import { generateSEOMetadata } from "~/utils/site";

export const metadata = generateSEOMetadata({
  title: "Readora Premium - Enhanced Reading Experience",
  description:
    "Upgrade to Readora Premium for an ad-free experience, exclusive content, offline reading, and more. Start your premium journey today!",
  pathname: "/premium",
  keywords: [
    "premium",
    "subscription",
    "premium features",
    "ad-free reading",
    "exclusive content",
  ],
});

const PremiumLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default PremiumLayout;
