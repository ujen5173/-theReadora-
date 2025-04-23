"use client";

import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NovelCard, { type TCard } from "../../shared/novel-card";
import { useParams } from "next/navigation";

const GenreBooksSection = () => {
  const { slug } = useParams();
  // Example books data
  const books: TCard[] = [
    {
      id: "b3c4d5e6-f789-4a1b-9c2d-3e4f5a6b7c8d",
      title: "Quantum Singularity",
      slug: "quantum-singularity",
      synopsis: "A physics experiment creates parallel reality fractures",
      author: {
        name: "Sarah Thompson",
        username: "sarah_writes",
      },
      thumbnail: "/hero-stories/4.jpg",
      tags: ["hard sci-fi", "quantum physics", "alternate realities"],
      genreSlug: "Horror",
      reads: 150000,
      votes: 30000,
      readingTime: 500000,
      isMature: false,
      isCompleted: false,
      chapters: [],
    },
    {
      id: "b3c4d5e6-f789-4a1b-9c2d-3e4f5a6b7cdf",
      title: "Collab to Love",
      slug: "quantum-singularity",
      synopsis: "A physics experiment creates parallel reality fractures",
      author: {
        name: "Keggster",
        username: "keggster",
      },
      thumbnail: "/hero-stories/1.jpg",
      tags: ["twice", "jihyo", "nayeon", "momo", "mina", "sana", "dahyun"],
      genreSlug: "Romance",
      reads: 150000,
      votes: 30000,
      readingTime: 500000,
      isMature: false,
      isCompleted: false,
      chapters: [],
    },
  ];

  return (
    <main className="w-full max-w-7xl mx-auto px-4">
      {/* Header with result count and active filters */}
      <div className="flex items-center justify-between py-4 border-b border-border">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-slate-900">
            <span className="capitalize text-primary underline underline-offset-2">
              {slug}
            </span>{" "}
            Stories
          </h1>
          <p className="text-sm text-slate-500">Showing 1-10 of 156 stories</p>
        </div>
      </div>

      {/* Enhanced Books Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 py-6">
        {books.map((book) => (
          <div key={book.id}>
            <NovelCard details={book} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4 border-t border-border">
        <p className="text-sm text-slate-600">Page 1 of 16</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="size-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {[1, 2, 3, "...", 16].map((page, i) => (
              <Button
                key={i}
                variant={page === 1 ? "default" : "outline"}
                size="sm"
                className={page === "..." ? "cursor-default" : ""}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            Next
            <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
      </div>
    </main>
  );
};

export default GenreBooksSection;
