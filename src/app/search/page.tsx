"use client";

import BooksSection from "../_components/layouts/search/books-section";
import FilterSection from "../_components/layouts/search/filter-section";
import Header from "../_components/layouts/header";
import { useSearchParams, useRouter } from "next/navigation";
import { getValidGenre } from "~/utils/helpers";
import { useLayoutEffect, useState, useCallback } from "react";
import { api } from "~/trpc/react";
import { useFilterStore } from "~/store/useFilter";
import type { SearchResponse } from "~/server/api/routers/story";

const Search = () => {
  // @params
  // /search?query=<QUERQUERY>&genre=<GENRE>
  const searchParams = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const genre = searchParams.get("genre") ?? "";
  const router = useRouter();
  const { applyFilters } = useFilterStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [s, setSearchParams] = useState({
    ...applyFilters(),
    query,
    skip: 0,
    limit: 10,
  });

  useLayoutEffect(() => {
    if (genre) {
      const validGenre = getValidGenre(genre);
      if (!validGenre) {
        // remove genre from url only if it's invalid
        router.push(`/search${query ? `?query=${query}` : ""}`);
      }
    }
  }, [query, genre, router]);

  const { data: books, isLoading } = api.story.search.useQuery(s, {
    enabled: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleRefetch = useCallback(() => {
    setSearchParams({
      ...applyFilters(),
      query,
      skip: (currentPage - 1) * 10,
      limit: 10,
    });
  }, [applyFilters, query, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams((prev) => ({
      ...prev,
      skip: (page - 1) * 10,
    }));
  };

  return (
    <>
      <Header />

      <section className="w-full">
        <div className="flex border-b border-border max-w-[1440px] mx-auto px-4 py-10 gap-10">
          {/* Filter actions */}
          <div className="max-w-xs">
            <FilterSection
              query={query}
              genre={genre}
              handleRefetch={handleRefetch}
            />
          </div>

          {/* Books details */}
          <div className="flex-1">
            <BooksSection
              query={query}
              genre={genre}
              books={books as SearchResponse}
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
