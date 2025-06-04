import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { merriweatherFont } from "~/utils/font";

const StoryNotFound = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-slate-700">
      <div className="container flex flex-col items-center justify-center md:gap-8 px-4 py-16 text-center">
        <h1
          className={`font-extrabold text-7xl md:text-9xl tracking-tight text-primary/90 ${merriweatherFont.className}`}
        >
          [Story Not Found]
        </h1>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          This Tale Seems Lost...
        </h2>

        <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-md">
          We couldn't find the story you're looking for. Perhaps it's been moved
          or is still being written.
        </p>

        <div className="flex gap-4 mt-4">
          <Link href="/search">
            <Button variant="default" className="gap-2">
              <ArrowLeft className="size-5" />
              Back to Stories
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="secondary" className="gap-2">
              <BookOpen className="size-5" />
              Discover More Tales
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-7xl sm:text-8xl md:text-9xl font-bold opacity-5 select-none">
          📚
        </div>
      </div>
    </div>
  );
};

export default StoryNotFound;
