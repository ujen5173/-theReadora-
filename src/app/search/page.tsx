"use client";

import { FilterIcon } from "hugeicons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useFilterStore } from "~/store/useFilter";
import { api } from "~/trpc/react";
import Header from "../_components/layouts/header";
import FilterSection from "../_components/layouts/search/filter-section";
import SearchBooksSection from "../_components/layouts/search/search-books-section";

const Search = () => {
  // @params
  // /search?query=<QUERY>&genre=<GENRE>
  const s = useSearchParams();
  const dUrl = useCallback(
    (url: string): ("AI_GENERATED" | "ORIGINAL" | "GRAPHICS")[] => {
      try {
        const decoded = decodeURIComponent(url);
        const { search } = new URL(decoded);

        return search.split("contentType=")[1]?.split(",") as (
          | "AI_GENERATED"
          | "ORIGINAL"
          | "GRAPHICS"
        )[];
      } catch (err) {
        console.error("Invalid URL:", err);
        return [];
      }
    },
    [],
  );

  const query = s.get("query") ?? "";
  const genre = s.get("genre") ?? "";
  const contentType =
    (s.get("contentType") as "AI_GENERATED" | "ORIGINAL" | "GRAPHICS") ??
    undefined;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { applyFilters, setGenre, setQuery } = useFilterStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    ...applyFilters(),
    query,
    skip: 0,
    limit: 15,
  });

  // Handle genre synchronization
  useEffect(() => {
    if (genre) {
      const validGenre = genre;
      if (validGenre) {
        setGenre(validGenre);
        setSearchParams((prev) => ({
          ...prev,
          genre: validGenre,
        }));
      } else {
        router.push(`/search${query ? `?query=${query}` : ""}`);
      }
    }
  }, [genre, query, router, setGenre]);

  useEffect(() => {
    const validURL = dUrl(window.location.href);

    if (validURL) {
      setSearchParams((prev) => ({
        ...prev,
        contentType: validURL,
      }));
    }
  }, [contentType, query, router]);

  // Handle query synchronization
  useEffect(() => {
    setQuery(query);
    setSearchParams((prev) => ({
      ...prev,
      query,
    }));
  }, [query, setQuery]);

  // Add this effect to initialize the store's genre
  useEffect(() => {
    if (genre) {
      setGenre(genre);
    }
  }, [genre, setGenre]);

  const { data: books, isLoading } = api.story.search.useQuery(searchParams, {
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const handleRefetch = useCallback(() => {
    const currentFilters = applyFilters();
    setSearchParams({
      ...currentFilters,
      query,
      skip: (currentPage - 1) * 15,
      limit: 15,
    });
    setOpen(false);
  }, [applyFilters, query, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams((prev) => ({
      ...prev,
      skip: (page - 1) * 15,
    }));
  };

  return (
    <>
      <Header />

      <section className="w-full">
        <div className="flex lg:flex-row flex-col gap-4 xl:gap-10 mx-auto px-2 sm:px-4 py-4 lg:py-10 max-w-[1540px]">
          <div className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start gap-2 w-full"
                >
                  <FilterIcon className="w-4 h-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-full sm:max-w-md">
                <ScrollArea className="h-dvh">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Story Filters</SheetTitle>
                    <SheetDescription>
                      Customize your search results with filters
                    </SheetDescription>
                  </SheetHeader>
                  <FilterSection
                    query={query}
                    genre={genre}
                    handleRefetch={handleRefetch}
                    isMobile={true}
                  />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden lg:block w-full lg:max-w-xs">
            <FilterSection
              query={query}
              genre={genre}
              handleRefetch={handleRefetch}
              isMobile={false}
            />
          </div>

          <div className="flex-1">
            <SearchBooksSection
              query={query}
              genre={genre}
              books={books}
              isLoading={isLoading}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;
