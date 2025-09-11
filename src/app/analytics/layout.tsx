import type { Metadata } from "next";
import React from "react";
import Header from "~/app/_components/layouts/header";
import { generateSEOMetadata } from "~/utils/site";

export const metadata: Metadata = generateSEOMetadata({
  noIndex: true,
  title: "Analytics",
  description: "Analytics for your website",
});

const AnalyticsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />

      {children}
    </>
  );
};

export default AnalyticsLayout;
