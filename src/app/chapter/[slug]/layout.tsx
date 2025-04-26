import React from "react";
import Header from "~/app/_components/layouts/header";

const ChapterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header full removeBackground />
      {children}
    </>
  );
};

export default ChapterLayout;
