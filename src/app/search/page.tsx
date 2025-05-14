"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useLayoutEffect, useState } from "react";
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
    limit: 10,
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
