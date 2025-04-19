import { BookMarked, SquarePen } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { merriweatherFont } from "~/utils/font";

const FEATURED_NOVELS = [
  {
    id: 1,
    title: "The Silent Echo",
    author: "Elena Rivers",
    cover: "/hero-stories/1.jpg",
    genre: "Mystery",
    rating: 4.5,
  },
  {
    id: 2,
    title: "Midnight's Crown",
    author: "Marcus Chen",
    cover: "/hero-stories/2.jpg",
    genre: "Fantasy",
    rating: 4.8,
  },
  {
    id: 3,
    title: "Love in Paris",
    author: "Sophie Laurent",
    cover: "/hero-stories/3.jpg",
    genre: "Romance",
    rating: 4.3,
  },
  {
    id: 4,
    title: "The Last Guardian",
    author: "James Mitchell",
    cover: "/hero-stories/4.jpg",
    genre: "Sci-Fi",
    rating: 4.6,
  },
  {
    id: 5,
    title: "Sweet Deception",
    author: "Maria Garcia",
    cover: "/hero-stories/5.jpg",
    genre: "Thriller",
    rating: 4.7,
  },
  {
    id: 6,
    title: "Dragon's Heir",
    author: "Ryan Black",
    cover: "/hero-stories/6.jpg",
    genre: "Fantasy",
    rating: 4.9,
  },
  {
    id: 7,
    title: "Urban Magic",
    author: "Zara Williams",
    cover: "/hero-stories/7.jpg",
    genre: "Urban Fantasy",
    rating: 4.4,
  },
  {
    id: 8,
    title: "The Art of Us",
    author: "David Cooper",
    cover: "/hero-stories/8.jpg",
    genre: "Contemporary",
    rating: 4.2,
  },
  {
    id: 9,
    title: "Sweet Deception",
    author: "Maria Garcia",
    cover: "/hero-stories/9.jpg",
    genre: "Thriller",
    rating: 4.7,
  },
  {
    id: 10,
    title: "Dragon's Heir",
    author: "Ryan Black",
    cover: "/hero-stories/10.jpg",
    genre: "Fantasy",
    rating: 4.9,
  },
  {
    id: 11,
    title: "Urban Magic",
    author: "Zara Williams",
    cover: "/hero-stories/11.jpg",
    genre: "Urban Fantasy",
    rating: 4.4,
  },
  {
    id: 12,
    title: "The Art of Us",
    author: "David Cooper",
    cover: "/hero-stories/12.jpg",
    genre: "Contemporary",
    rating: 4.2,
  },
  {
    id: 13,
    title: "Sweet Deception",
    author: "Maria Garcia",
    cover: "/hero-stories/13.jpg",
    genre: "Thriller",
    rating: 4.7,
  },
  {
    id: 14,
    title: "Dragon's Heir",
    author: "Ryan Black",
    cover: "/hero-stories/14.jpg",
    genre: "Fantasy",
    rating: 4.9,
  },
  {
    id: 15,
    title: "Urban Magic",
    author: "Zara Williams",
    cover: "/hero-stories/15.jpg",
    genre: "Urban Fantasy",
    rating: 4.4,
  },
  {
    id: 16,
    title: "The Art of Us",
    author: "David Cooper",
    cover: "/hero-stories/16.jpg",
    genre: "Contemporary",
    rating: 4.2,
  },
];

// Novel Card Component
const NovelCard = ({ novel }: { novel: (typeof FEATURED_NOVELS)[number] }) => (
  <div className="flex items-center gap-4 py-1 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
    <Image
      width={800}
      height={400}
      src={novel.cover}
      alt={novel.title}
      className="border/40 h-full w-full rounded-lg border object-cover transition-all duration-500 ease-in-out"
    />
  </div>
);

const VerticalSlider = () => (
  <div className="hidden relative h-full max-h-[35rem] w-1/2 gap-2 overflow-hidden lg:flex">
    {/* Column 1 */}
    <div className="flex-1">
      <div className="animate-slide-up">
        {/* Original set */}
        {FEATURED_NOVELS.slice(0, 4).map((novel) => (
          <NovelCard key={`original-${novel.id}`} novel={novel} />
        ))}
        {/* Duplicate set for seamless loop */}
        {FEATURED_NOVELS.slice(0, 4).map((novel) => (
          <NovelCard key={`duplicate-${novel.id}`} novel={novel} />
        ))}
      </div>
    </div>

    {/* Column 2 */}
    <div className="flex-1">
      <div className="animate-slide-1">
        {/* Original set */}
        {FEATURED_NOVELS.slice(4, 8).map((novel) => (
          <NovelCard key={`original-${novel.id}`} novel={novel} />
        ))}
        {/* Duplicate set for seamless loop */}
        {FEATURED_NOVELS.slice(4, 8).map((novel) => (
          <NovelCard key={`duplicate-${novel.id}`} novel={novel} />
        ))}
      </div>
    </div>

    {/* Column 3 */}
    <div className="flex-1">
      <div className="animate-slide-2">
        {/* Original set */}
        {FEATURED_NOVELS.slice(8, 12).map((novel) => (
          <NovelCard key={`original-${novel.id}`} novel={novel} />
        ))}
        {/* Duplicate set for seamless loop */}
        {FEATURED_NOVELS.slice(8, 12).map((novel) => (
          <NovelCard key={`duplicate-${novel.id}`} novel={novel} />
        ))}
      </div>
    </div>

    {/* Column 4 */}
    <div className="flex-1">
      <div className="animate-slide-3">
        {/* Original set */}
        {FEATURED_NOVELS.slice(12, 16).map((novel) => (
          <NovelCard key={`original-${novel.id}`} novel={novel} />
        ))}
        {/* Duplicate set for seamless loop */}
        {FEATURED_NOVELS.slice(12, 16).map((novel) => (
          <NovelCard key={`duplicate-${novel.id}`} novel={novel} />
        ))}
      </div>
    </div>
  </div>
);

const HeroSection = () => {
  return (
    <section className="w-full">
      <div className="relative mx-auto px-4 pt-4 pb-6 min-h-[30rem] max-w-[1240px] flex gap-10">
        <div className="absolute inset-0 z-10 block lg:hidden">
          <Image
            src="/background-pattern.png"
            alt="Background Pattern"
            width={800}
            height={400}
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        <div className="py-20 flex-1">
          <h1
            className={cn(
              "text-3xl md:text-5xl leading-tight font-black text-slate-700 mb-4 tracking-tight",
              merriweatherFont.className
            )}
          >
            Discover and share your favorite reads!
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            The ultimate alternative to{" "}
            <span className="text-primary/70 underline font-semibold">
              Wattpad
            </span>
            ,{" "}
            <span className="text-primary/70 underline font-semibold">
              Webnovels
            </span>{" "}
            and other platforms, read and write without any hassels.{" "}
            <span className="underline text-primary">
              Built for readers and writers
            </span>
            .
          </p>

          <div className="flex items-center gap-2 mt-10">
            <Button variant={"default"} icon={BookMarked} iconPlacement="left">
              Start Reading
            </Button>
            <Button variant={"secondary"} icon={SquarePen}>
              Start Writing
            </Button>
          </div>
        </div>
        <VerticalSlider />
      </div>
    </section>
  );
};

export default HeroSection;
