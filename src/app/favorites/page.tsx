"use client";

import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import Header from "../_components/layouts/header";
import NovelCard from "../_components/shared/novel-card";

const FavoritesPage = () => {
  const { data: favorites, isLoading } = api.story.getFavorites.useQuery();

  return (
    <>
      <Header />

      <div className="w-full">
        <div className="border-b border-border max-w-[1440px] mx-auto px-4 py-6">
          <div className="mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">
              My Favorites
            </h1>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-10 text-primary animate-spin" />
            </div>
          ) : favorites && favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {favorites.map((novel) => (
                <NovelCard key={novel.id} details={novel} />
              ))}
            </div>
          ) : (
            <NoFavorites />
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;

const NoFavorites = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 size-20 rounded-full flex items-center justify-center mb-6">
        <Heart className="size-10 text-primary/70" />
      </div>

      <div className="text-center max-w-[420px] mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          No Favorites Yet
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Your favorite stories will appear here. Start exploring and save the
          stories you love to read later.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" asChild className="w-full">
          <Link href="/discover">Discover Stories</Link>
        </Button>
      </div>
    </div>
  );
};
