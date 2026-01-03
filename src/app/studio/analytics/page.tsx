import Analytics from "./AnalyticsMain";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) => {
  const p = await searchParams;

  return <Analytics p={p.story} />;
};

export default Page;
