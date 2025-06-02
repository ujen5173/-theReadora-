import { WebDesign01Icon } from "hugeicons-react";
import { Coins, PenLine, Sparkles } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { auth } from "~/server/auth";
import { outfit } from "~/utils/font";
import HeroSection from "./_components/layouts/(/)/hero-section";
import LatestAndRising from "./_components/layouts/(/)/latest-rising";
import PopularCompleted from "./_components/layouts/(/)/popular-completed";
import SimilarReadsNReadingList from "./_components/layouts/(/)/recent-reads-legends-shelf";
import Recommendations from "./_components/layouts/(/)/recommendations";
import TrendingSection from "./_components/layouts/(/)/trending";
import Header from "./_components/layouts/header";

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
      <TrendingSection />
      <Separator className="max-w-[1540px] mx-auto" />
      <Recommendations />
      {/* <Separator className="max-w-[1540px] mx-auto" />
      <TopTags /> */}
      <Separator className="max-w-[1540px] mx-auto" />
      <LatestAndRising />
      <Separator className="max-w-[1540px] mx-auto" />
      <PopularCompleted />

      {!user?.user.id && (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-24">
            <div className="mt-10">
              <h1 className="text-center font-extrabold text-5xl tracking-tight sm:text-[5rem]">
                Hello Writers, <br /> Welcome to{" "}
                <span
                  className={`underline ${outfit.className} text-primary/80`}
                >
                  Readora
                </span>
              </h1>
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

                <div className="text-center">
                  <Link href="/auth/signin">
                    <Button
                      size="lg"
                      variant="default"
                      effect={"shineHover"}
                      className="font-semibold px-8"
                    >
                      Start Writing Today
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* {session?.user ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center gap-4 rounded-full min-w-80 bg-slate-700/50 p-4 backdrop-blur-sm">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={`@${session.user.name}`}
                    width={600}
                    height={600}
                    className="size-14 rounded-full object-cover"
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-xl font-medium text-rose-400">
                    {session.user.name}
                  </span>
                  <span className="text-sm text-slate-300">
                    {session.user.email}
                  </span>
                </div>
              </div>
              <Link href="/api/auth/signout">
                <Button iconPlacement="right" icon={LogOut}>
                  Sign Out
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <div className="rounded-xl bg-slate-700/30 p-8 backdrop-blur-sm">
                <div className="flex flex-col items-center space-y-4">
                  <h2 className="text-2xl font-semibold text-white">
                    Welcome!
                  </h2>
                  <p className="text-center text-slate-300">
                    Sign in to access your account and start exploring
                  </p>
                </div>
              </div>
              <Link href="/api/auth/signin">
                <Button iconPlacement="right" icon={MoveRight}>
                  Sign In
                </Button>
              </Link>
            </div>
          )} */}
          </div>
        </main>
      )}
    </Fragment>
  );
}
