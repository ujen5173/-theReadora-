"use client";

import { BookOpenText, Loader2, PenLineIcon, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import Header from "../_components/layouts/header";
import NovelCard from "../_components/shared/novel-card";

const MyCreations = () => {
  const { data: novels, isLoading } = api.story.getNovels.useQuery();

  return (
    <>
      <Header />
      <div className="w-full">
        <div className="border-b border-border max-w-[1440px] mx-auto px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">
              My Creations
            </h1>
            <Button
              asChild
              className="bg-gradient-to-r from-primary/80 to-primary text-white hover:from-primary hover:to-primary/90"
            >
              <Link href="/write/story/new">
                <PenLineIcon className="size-4 mr-2" />
                Start a new story
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-10 text-primary animate-spin" />
            </div>
          ) : novels && novels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {novels.map((novel) => (
                <NovelCard key={novel.id} details={novel} />
              ))}
            </div>
          ) : (
            <NoNovelsWritten />
          )}
        </div>
      </div>
    </>
  );
};

export default MyCreations;

const NoNovelsWritten = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 size-20 rounded-full flex items-center justify-center mb-6">
        <BookOpenText className="size-10 text-primary/70" />
      </div>

      <div className="text-center max-w-[420px] mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          Start Your Writing Journey
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Your creative journey begins here. Write your first story and share
          your unique voice with readers around the world.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button icon={Plus} asChild>
          <Link href="/write/story/new">Create Your First Novel</Link>
        </Button>

        <Button variant="outline" asChild className="w-full">
          <Link href="/guide/writing">Readora Writing Guide</Link>
        </Button>
      </div>
    </div>
  );
};
