import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Story Editor",
  description: "Edit your story",
};

const StoryEditorLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default StoryEditorLayout;
