import { ArrowDown } from "lucide-react";
import NovelCard, { type TCard } from "./novel-card";
import { cn } from "~/lib/utils";

const BookSection = ({
  title,
  scrollable = false,
  novels = [],
  multiple = false,
}: {
  title: string;
  scrollable?: boolean;
  novels: TCard[];
  multiple?: boolean;
}) => {
  return (
    <section className="w-full">
      <div className={cn(!multiple ? "max-w-[1440px] mx-auto px-4 py-8" : "")}>
        <div className="flex mb-4 items-center gap-2">
          <h1 className="text-2xl font-semibold text-primary">{title}</h1>
          <ArrowDown className="h-5 w-5 text-primary" />
        </div>

        <div className="flex items-center gap-4">
          <NovelCard
            details={{
              id: "b3c4d5e6-f789-4a1b-9c2d-3e4f5a6b7c8d",
              title: "Quantum Singularity",
              slug: "quantum-singularity",
              summary:
                "A physics experiment creates parallel reality fractures",
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
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default BookSection;
