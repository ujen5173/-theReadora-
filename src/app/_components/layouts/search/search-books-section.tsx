// TODO: Pagination does not work properly, need to fix it
// TODO: Need some UI improvements in the filter section

"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { Skeleton } from "~/components/ui/skeleton";
import type { SearchResponse } from "~/server/api/routers/story";
import { getValidGenre } from "~/utils/helpers";
import NovelCard, { type TCard } from "../../shared/novel-card";

const SearchBooksSection = ({
  query,
  genre,
  books,
  isLoading,
  currentPage,
  onPageChange,
}: {
  query: string;
  genre: string;
  books: SearchResponse | undefined;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  // Helper function to generate page numbers
  const getPageNumbers = (total: number, current: number) => {
    const pages = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (current > 3) pages.push("...");

    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(current + 1, total - 1);
      i++
    ) {
      pages.push(i);
    }

    if (current < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 lg:py-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg lg:text-xl font-semibold text-slate-800">
              {query ? (
                <>
                  Results for "
                  <span className="text-primary underline underline-offset-2">
                    {query}
                  </span>
                  "
                </>
              ) : (
                <span className="text-primary">
                  {getValidGenre(genre) ?? "All"}
                </span>
              )}{" "}
              Stories
            </h1>
          </div>
          {isLoading ? (
            <Skeleton className="h-4 w-28" />
          ) : (
            <p className="text-xs lg:text-sm text-slate-500">
              Showing{" "}
              {books?.stories.length
                ? (currentPage - 1) * (books?.metadata.pageSize ?? 0) + 1
                : 0}
              -
              {Math.min(
                currentPage * (books?.metadata.pageSize ?? 0),
                books?.metadata.total ?? 0
              )}{" "}
              of {books?.metadata.total} stories
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 py-4 lg:py-6 min-h-[400px]">
        {isLoading ? (
          [...Array(10)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))
        ) : books?.stories.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-slate-900">
              No stories found
            </p>
            <p className="text-sm text-slate-500">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          books?.stories.map((book: TCard) => (
            <div key={book.id}>
              <NovelCard details={book} />
            </div>
          ))
        )}
      </div>

      {!isLoading && books?.stories.length && books?.stories.length > 0 && (
        <div className="py-4 border-t border-border overflow-x-auto">
          <Pagination>
            <PaginationContent className="flex-wrap">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => onPageChange(currentPage - 1)}
                />
              </PaginationItem>

              {getPageNumbers(books.metadata.pageCount, currentPage).map(
                (page, i) => (
                  <PaginationItem key={i}>
                    {page === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={() => onPageChange(page as number)}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => onPageChange(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </main>
  );
};

export default SearchBooksSection;
