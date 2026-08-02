"use client";

import { QuillWrite02Icon } from "hugeicons-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import BlurImage from "~/app/_components/shared/blur-image";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { merriweatherFont } from "~/utils/font";

const FEATURED_NOVELS = [
  {
    id: 1,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002940/10_b7hb92.jpg",
  },
  {
    id: 2,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002940/11_zysxvf.jpg",
  },
  {
    id: 3,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002940/12_sgeasy.jpg",
  },
  {
    id: 4,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002940/13_zboina.jpg",
  },
  {
    id: 5,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002940/14_elhz9e.jpg",
  },
  {
    id: 6,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002943/19_b4iqta.jpg",
  },
  {
    id: 7,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002943/9_o8hfiu.jpg",
  },
  {
    id: 8,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002941/15_wus6xg.jpg",
  },
  {
    id: 9,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002941/16_ypnbkn.jpg",
  },
  {
    id: 10,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002941/17_clhujy.jpg",
  },
  {
    id: 11,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002941/18_wfmfzf.jpg",
  },
  {
    id: 12,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002942/6_g7bjxl.jpg",
  },
  {
    id: 13,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002943/7_zyotzc.jpg",
  },
  {
    id: 14,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002943/8_jig8yn.jpg",
  },
  {
    id: 15,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002941/2_djbaef.jpg",
  },
  {
    id: 16,
    cover:
      "https://res.cloudinary.com/duig8qiu4/image/upload/v1760002942/20_hbprjo.jpg",
  },
];

const NovelCard = ({ novel }: { novel: (typeof FEATURED_NOVELS)[number] }) => (
  <div className="group flex items-center gap-4 hover:bg-white/5 py-1 rounded-lg transition-colors">
    <BlurImage
      src={novel.cover}
      alt={"COVER NOT FOUND"}
      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 15vw"
    />
  </div>
);

const VerticalSlider = () => {
  // Generate random durations between 20-40 seconds for variety
  const getRandomDuration = () => Math.floor(Math.random() * 20) + 20;
  const getRandomDirections = () => [
    Math.floor(Math.random() * 2) + 1,
    Math.floor(Math.random() * 2) + 1,
    Math.floor(Math.random() * 2) + 1,
    Math.floor(Math.random() * 2) + 1,
  ];

  return (
    <div className="hidden relative lg:flex gap-2 w-1/2 h-full max-h-[35rem] overflow-hidden">
      <div className="flex-1">
        <div
          className="animate-slide-up"
          style={{ animationDuration: `${getRandomDuration()}s` }}
        >
          {FEATURED_NOVELS.slice(0, 4).map((novel) => (
            <NovelCard key={`original-${novel.id}`} novel={novel} />
          ))}
          {FEATURED_NOVELS.slice(0, 4).map((novel) => (
            <NovelCard key={`duplicate-${novel.id}`} novel={novel} />
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div
          className="animate-slide-1"
          style={{ animationDuration: `${getRandomDuration()}s` }}
        >
          {FEATURED_NOVELS.slice(4, 8).map((novel) => (
            <NovelCard key={`original-${novel.id}`} novel={novel} />
          ))}
          {FEATURED_NOVELS.slice(4, 8).map((novel) => (
            <NovelCard key={`duplicate-${novel.id}`} novel={novel} />
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div
          className="animate-slide-2"
          style={{ animationDuration: `${getRandomDuration()}s` }}
        >
          {FEATURED_NOVELS.slice(8, 12).map((novel) => (
            <NovelCard key={`original-${novel.id}`} novel={novel} />
          ))}
          {FEATURED_NOVELS.slice(8, 12).map((novel) => (
            <NovelCard key={`duplicate-${novel.id}`} novel={novel} />
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div
          className="animate-slide-3"
          style={{ animationDuration: `${getRandomDuration()}s` }}
        >
          {FEATURED_NOVELS.slice(12, 16).map((novel) => (
            <NovelCard key={`original-${novel.id}`} novel={novel} />
          ))}
          {FEATURED_NOVELS.slice(12, 16).map((novel) => (
            <NovelCard key={`duplicate-${novel.id}`} novel={novel} />
          ))}
        </div>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const { mutateAsync, status } = api.story.AIContentGeneration.useMutation({
    onSuccess: () => {
      toast.success("Content generated successfully");
    },
    onError: () => {
      toast.error("Failed to generate content");
    },
  });

  return (
    <section className="w-full">
      <div className="relative flex gap-10 mx-auto px-4 pt-4 pb-6 max-w-[1240px] min-h-[30rem]">
        <div className="lg:hidden block z-10 absolute inset-0">
          <Image
            src="/background-pattern.png"
            alt="Background Pattern"
            width={800}
            height={400}
            className="z-0 opacity-10 w-full h-full object-cover select-none"
          />
        </div>

        <div className="z-10 flex-1 py-20">
          <h1
            className={cn(
              "mb-4 font-black text-slate-600 text-4xl md:text-5xl leading-tight tracking-tight",
              merriweatherFont.className,
            )}
          >
            Write stories that actually get noticed!
          </h1>
          <p className="font-medium text-slate-500 text-base md:text-lg">
            A clean,{" "}
            <span className="font-semibold text-primary/70 underline">
              creator-first
            </span>{" "}
            platform for{" "}
            <span className="font-semibold text-primary underline">
              readers
            </span>{" "}
            and{" "}
            <span className="font-semibold text-primary underline">
              writers
            </span>
            . Share stories, grow your audience, and enjoy storytelling without
            the hassles with Readora.
          </p>

          <div className="flex items-center gap-2 mt-10">
            <Link href="/search">
              <Button variant={"default"}>Start Reading</Button>
            </Link>
            <Link href="/auth/signin?redirect=/write">
              <Button variant={"secondary"} icon={QuillWrite02Icon}>
                Start Publishing
              </Button>
            </Link>
          </div>
        </div>

        <VerticalSlider />
      </div>
    </section>
  );
};

export default HeroSection;
