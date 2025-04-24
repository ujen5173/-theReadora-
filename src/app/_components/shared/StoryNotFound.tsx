import { Button } from "~/components/ui/button";
import { merriweatherFont, outfit } from "~/utils/font";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

const StoryNotFound = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-slate-700">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <h1
          className={`font-extrabold text-8xl tracking-tight text-primary/90 ${merriweatherFont.className}`}
        >
          [Story Not Found]
        </h1>

        <h2 className={`text-3xl font-bold ${outfit.className}`}>
          This Tale Seems Lost...
        </h2>

        <p className="text-lg text-slate-500 max-w-md">
          We couldn't find the story you're looking for. Perhaps it's been moved
          or is still being written.
        </p>

        <div className="flex gap-4 mt-4">
          <Link href="/explore">
            <Button variant="default" size="lg" className="gap-2">
              <ArrowLeft className="size-5" />
              Back to Stories
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="secondary" size="lg" className="gap-2">
              <BookOpen className="size-5" />
              Discover More Tales
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-8xl font-bold opacity-5 select-none">📚</div>
      </div>
    </div>
  );
};

export default StoryNotFound;
