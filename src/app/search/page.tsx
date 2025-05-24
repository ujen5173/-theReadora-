"use client";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useLayoutEffect, useState } from "react";
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
import { getValidGenre } from "~/utils/helpers";
import Header from "../_components/layouts/header";
import FilterSection from "../_components/layouts/search/filter-section";
import SearchBooksSection from "../_components/layouts/search/search-books-section";

const Search = () => {
  // @params
  // /search?query=<QUERY>&genre=<GENRE>
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const genre = searchParams.get("genre") ?? "";
  const router = useRouter();
  const { applyFilters, setGenre, setQuery } = useFilterStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [s, setSearchParams] = useState({
    ...applyFilters(),
    query,
    skip: 0,
    limit: 15,
  });

  // Handle genre synchronization
  useLayoutEffect(() => {
    if (genre) {
      const validGenre = getValidGenre(genre);
      if (validGenre) {
        setGenre(validGenre);
      } else {
        router.push(`/search${query ? `?query=${query}` : ""}`);
      }
    }
  }, [genre, query, router, setGenre]);

  // Handle query synchronization
  useLayoutEffect(() => {
    setQuery(query);
  }, [query]);

  const { data: books, isLoading } = api.story.search.useQuery(s, {
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const handleRefetch = useCallback(() => {
    setSearchParams({
      ...applyFilters(),
      query,
      skip: (currentPage - 1) * 15,
      limit: 15,
    });
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
        <div className="flex flex-col lg:flex-row max-w-[1540px] mx-auto px-2 sm:px-4 py-4 lg:py-10 gap-4 xl:gap-10">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md p-0">
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
