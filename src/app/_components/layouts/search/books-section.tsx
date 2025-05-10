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

const BooksSection = ({
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
    <main className="w-full max-w-7xl mx-auto px-4">
      {/* Header with result count and active filters */}
      <div className="flex items-center justify-between py-4 border-b border-border">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-800">
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
          {isLoading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            <p className="text-sm text-slate-500">
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

      {/* Enhanced Books Grid with Loading State */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 py-6 min-h-[400px]">
        {isLoading ? (
          // Loading skeletons
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
          // No results state
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium text-slate-900">
              No stories found
            </p>
            <p className="text-sm text-slate-500">
              Try adjusting your filters or search terms
            </p>
          </div>
        ) : (
          // Results grid with proper typing
          books?.stories.map((book: TCard) => (
            <div key={book.id}>
              <NovelCard details={book} />
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!isLoading && books?.stories.length && books?.stories.length > 0 && (
        <div className="py-4 border-t border-border">
          <Pagination>
            <PaginationContent>
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

export default BooksSection;
