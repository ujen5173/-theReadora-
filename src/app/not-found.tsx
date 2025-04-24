import { Button } from "~/components/ui/button";
import { merriweatherFont, outfit } from "~/utils/font";
import { BookOpen, Home } from "lucide-react";
import Link from "next/link";
import Header from "./_components/layouts/header";

const NotFoundPage = () => {
  return (
    <>
      <Header background={false} />

      <main className="flex min-h-screen flex-col items-center justify-center  text-slate-700">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 text-center">
          <h1
            className={`font-extrabold text-9xl tracking-tight text-primary/90 ${merriweatherFont.className}`}
          >
            [404]
          </h1>

          <h2 className={`text-4xl font-bold ${outfit.className}`}>
            Plot Twist!
          </h2>

          <p className="text-xl text-slate-500 max-w-md">
            This chapter seems to be missing from our library. Let&apos;s get
            you back to where the stories are.
          </p>

          <div className="flex gap-4 mt-4">
            <Link href="/">
              <Button variant="default" size="lg" className="gap-2">
                <Home className="size-5" />
                Back Home
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="secondary" size="lg" className="gap-2">
                <BookOpen className="size-5" />
                Explore Stories
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-9xl font-bold opacity-5 select-none">
            ¯\_(ツ)_/¯
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFoundPage;
