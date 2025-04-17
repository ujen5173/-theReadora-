import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { outfit } from "~/utils/font";
import { LogOut, MoveRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-center font-extrabold text-5xl tracking-tight sm:text-[5rem]">
            Hello world, <br /> Welcome to{" "}
            <span className={`underline ${outfit.className} text-primary/90`}>
              [theReadora]
            </span>
          </h1>

          {session?.user ? (
            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center gap-4 rounded-full min-w-80 bg-slate-700/50 p-4 backdrop-blur-sm">
                {session.user.image && (
                  <Avatar className="h-12 w-12 rounded-full">
                    <AvatarImage
                      src={session.user.image}
                      alt={`@${session.user.name}`}
                    />
                    <AvatarFallback>
                      {session.user.name ?? "Profile"}
                    </AvatarFallback>
                  </Avatar>
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
              <Button iconPlacement="right" icon={LogOut}>
                Sign Out
              </Button>
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
              <Button iconPlacement="right" icon={MoveRight}>
                Sign In
              </Button>
            </div>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
