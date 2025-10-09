import { QuillWrite02Icon, WebDesign01Icon } from "hugeicons-react";
import { Coins, PenLine, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { auth } from "~/server/auth";
import { outfit } from "~/utils/font";
import { generateSEOMetadata } from "~/utils/site";
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

  const features = [
    {
      icon: Coins,
      title: "7o% Revenue Share",
      description:
        "Earn from day one through ads, subscriptions, chapter unlocks, and reader tips. Get paid for your work, no minimum follower requirements.",
    },
    {
      icon: Sparkles,
      title: "AI Writing Assistant",
      description:
        "Get smart suggestions for your plot, characters, and writing style. Let AI help you create better stories, faster.",
    },
    {
      icon: PenLine,
      title: "Write Without Limits",
      description:
        "No content restrictions. Write any genre, theme, or format. Perfect for mature themes and cross-genre stories.",
    },
    {
      icon: WebDesign01Icon,
      title: "Better Experience from other platform",
      description:
        "Experience matters a lot for both readers and writers, so Readora focus on keeping the design clean, modern, and easy to use.",
    },
  ];

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

      {!user?.user.id && (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="container flex flex-col items-center justify-center gap-6 px-4 py-24">
            <div className="mt-10">
              <h1 className="text-center font-extrabold text-5xl tracking-tight sm:text-[5rem]">
                Hello Writers, <br /> Welcome to{" "}
                <span
                  className={`bg-gradient-to-r from-primary/90 to-pink-400/80 bg-clip-text text-transparent ${outfit.className}`}
                >
                  Readora
                </span>
              </h1>
            </div>
            <p className="mx-auto mt-4 text-center max-w-2xl text-pretty text-lg text-slate-300 sm:text-xl">
              Write boldly. Grow your audience. Earn from day one with a modern,
              distraction‑free experience.
            </p>
            <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/auth/signin" aria-label="Start writing on Readora">
                <Button
                  size="lg"
                  variant="default"
                  effect="shineHover"
                  icon={QuillWrite02Icon}
                  className="group px-7 font-semibold"
                >
                  Start Writing Today
                </Button>
              </Link>

              <Link
                href="/search"
                aria-label="Browse trending stories on Readora"
              >
                <Button
                  size="lg"
                  variant="secondary"
                  iconPlacement="left"
                  icon={Search}
                  className="px-7"
                >
                  Browse Stories
                </Button>
              </Link>
            </div>

            <section className="pt-4 px-4">
              <div className="max-w-[1540px] mx-auto">
                <div className="text-center mb-12">
                  <Badge variant="secondary" className="mb-4">
                    The Readora Difference
                  </Badge>
                  <h2 className="text-4xl font-bold mb-4">
                    Built for Writers Like You
                  </h2>
                  <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                    A modern platform that gives you the tools to write, earn,
                    and grow your audience.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="p-6 rounded-xl bg-slate-700/30 border border-slate-700/50 transition-all duration-300 ease-in-out hover:bg-slate-700/50"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <feature.icon className="size-6 text-primary" />
                        <h3 className="text-xl font-semibold">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-slate-300">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      )}
    </Fragment>
  );
}
