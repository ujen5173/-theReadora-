import { Fragment } from "react";
import { Separator } from "~/components/ui/separator";
import { auth } from "~/server/auth";
import { generateSEOMetadata } from "~/utils/site";
import HelloWriters from "./_components/layouts/(/)/hello-writers";
import HeroSection from "./_components/layouts/(/)/hero-section";
import LatestAndRising from "./_components/layouts/(/)/latest-rising";
import PopularCompleted from "./_components/layouts/(/)/popular-completed";
import SimilarReadsNReadingList from "./_components/layouts/(/)/recent-reads-legends-shelf";
import Recommendations from "./_components/layouts/(/)/recommendations";
import TrendingSection from "./_components/layouts/(/)/trending";
import Header from "./_components/layouts/header";

export const metadata = generateSEOMetadata({
  title: "Where Stories Come Alive",
  description:
    "Discover, write, and share stories across every genre. Join Readora’s community of readers and writers.",
  pathname: "/",
  keywords: [
    "read stories",
    "write stories",
    "online novels",
    "writing community",
  ],
  type: "website",
});

export default async function Home() {
  const user = await auth();

  return (
    <Fragment>
      <Header />
      {!user?.user.id ? (
        <>
          <HeroSection />
          <Separator className="max-w-[1540px] mx-auto" />
        </>
      ) : (
        <SimilarReadsNReadingList />
      )}
      <Recommendations />
      <Separator className="max-w-[1540px] mx-auto" />
      <TrendingSection />
      <Separator className="max-w-[1540px] mx-auto" />
      <LatestAndRising />
      <Separator className="max-w-[1540px] mx-auto" />
      <PopularCompleted />

      {!user?.user.id && <HelloWriters />}
    </Fragment>
  );
}
