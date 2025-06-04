import { BookOpen, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { merriweatherFont } from "~/utils/font";
import Header from "./_components/layouts/header";

const NotFoundPage = () => {
  return (
    <>
      <Header background={false} />

      <main className="flex min-h-[80vh] flex-col items-center justify-center text-slate-700">
        <div className="container flex flex-col items-center justify-center gap-4 md:gap-8 px-4 py-16 text-center">
          <h1
            className={`font-extrabold text-7xl md:text-9xl tracking-tight text-primary/90 ${merriweatherFont.className}`}
          >
            [404]
          </h1>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Plot Twist!
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-md">
            This chapter seems to be missing from our library. Let&apos;s get
            you back to where the stories are.
          </p>

          <div className="flex gap-4 mt-4">
            <Link href="/">
              <Button variant="default" className="gap-2">
                <Home className="size-5" />
                Back Home
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="secondary" className="gap-2">
                <BookOpen className="size-5" />
                Explore Stories
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-7xl sm:text-8xl md:text-9xl font-bold opacity-5 select-none">
            ¯\_(ツ)_/¯
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFoundPage;
