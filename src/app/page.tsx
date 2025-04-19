import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";
import { outfit } from "~/utils/font";
import { LogOut, MoveRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Header from "./_components/layouts/header";
import { Fragment } from "react";
import HeroSection from "./_components/layouts/(/)/hero-section";
import TrendingSection from "./_components/layouts/(/)/trending";
import { Separator } from "~/components/ui/separator";

export default async function Home() {
  const session = await auth();

  return (
    <Fragment>
      <Header />
      <HeroSection />
      <Separator className="max-w-[1440px] mx-auto" />
      <TrendingSection />

      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-center font-extrabold text-5xl tracking-tight sm:text-[5rem]">
            Hello Readers, <br /> Welcome to{" "}
            <span className={`underline ${outfit.className} text-primary/90`}>
              [theReadora]
            </span>
          </h1>

          {session?.user ? (
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
          )}
        </div>
      </main>
    </Fragment>
  );
}
