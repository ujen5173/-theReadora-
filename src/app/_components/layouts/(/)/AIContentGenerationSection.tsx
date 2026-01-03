"use client";

import { api } from "~/trpc/react";

const AIContentGenerationSection = () => {
  const { mutateAsync } = api.story.AIContentGeneration.useMutation({});
  const handleGenerate = async () => {
    const res = await mutateAsync();
    console.log({ res });
  };

  return <button onClick={handleGenerate}>AIContentGeneration</button>;
};

export default AIContentGenerationSection;
