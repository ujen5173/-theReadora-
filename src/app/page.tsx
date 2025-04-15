import { HydrateClient } from "~/trpc/server";
import { outfit } from "~/utils/font";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800 text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="font-extrabold text-5xl tracking-tight sm:text-[5rem]">
            Hello world, <br /> Welcome to{" "}
            <span className={`underline ${outfit.className} text-rose-500`}>
              [theReadora]
            </span>
          </h1>
        </div>
      </main>
    </HydrateClient>
  );
}
