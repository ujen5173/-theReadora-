import React from "react";
import Header from "../_components/layouts/header";

const FeedbackLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header removeBackground headerExtraStyle="border-b border-border" />

      <main className="bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-[1440px] mx-auto">{children}</div>
      </main>
    </>
  );
};

export default FeedbackLayout;
