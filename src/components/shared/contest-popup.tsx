"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Award01Icon,
  Cancel01Icon,
  ChampionIcon,
  SparklesIcon,
  StarIcon,
} from "hugeicons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

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
  <div className="flex items-center gap-4 py-2 rounded-lg hover:scale-[1.02] transition-transform duration-300">
    <div className="relative shadow-md rounded-md w-full aspect-[2/3] overflow-hidden">
      <img
        src={novel.cover}
        alt="Novel Cover"
        className="w-full h-full object-cover"
      />
    </div>
  </div>
);

const VerticalSlider = () => {
  // Generate random durations for variety
  const getRandomDuration = () => Math.floor(Math.random() * 10) + 30;

  return (
    <div className="relative flex gap-3 opacity-80 hover:opacity-100 grayscale-[30%] hover:grayscale-0 w-full h-full overflow-hidden transition-all duration-500">
      <div className="flex-1">
        <div
          className="animate-slide-up"
          style={{ animationDuration: `${getRandomDuration()}s` }}
        >
          {FEATURED_NOVELS.slice(0, 4).map((novel) => (
            <NovelCard key={`col1-orig-${novel.id}`} novel={novel} />
          ))}
          {FEATURED_NOVELS.slice(0, 4).map((novel) => (
            <NovelCard key={`col1-dup-${novel.id}`} novel={novel} />
          ))}
        </div>
      </div>

      <div className="flex-1 pt-8">
        <div
          className="animate-slide-up"
          style={{ animationDuration: `${getRandomDuration()}s` }}
        >
          {FEATURED_NOVELS.slice(4, 8).map((novel) => (
            <NovelCard key={`col2-orig-${novel.id}`} novel={novel} />
          ))}
          {FEATURED_NOVELS.slice(4, 8).map((novel) => (
            <NovelCard key={`col2-dup-${novel.id}`} novel={novel} />
          ))}
        </div>
      </div>

      <div className="flex-1 pt-16">
        <div
          className="animate-slide-up"
          style={{ animationDuration: `${getRandomDuration()}s` }}
        >
          {FEATURED_NOVELS.slice(8, 12).map((novel) => (
            <NovelCard key={`col3-orig-${novel.id}`} novel={novel} />
          ))}
          {FEATURED_NOVELS.slice(8, 12).map((novel) => (
            <NovelCard key={`col3-dup-${novel.id}`} novel={novel} />
          ))}
        </div>
      </div>

      <div className="flex-1 pt-24">
        <div
          className="animate-slide-up"
          style={{ animationDuration: `${getRandomDuration()}s` }}
        >
          {FEATURED_NOVELS.slice(12, 16).map((novel) => (
            <NovelCard key={`col4-orig-${novel.id}`} novel={novel} />
          ))}
          {FEATURED_NOVELS.slice(12, 16).map((novel) => (
            <NovelCard key={`col4-dup-${novel.id}`} novel={novel} />
          ))}
        </div>
      </div>

      <div className="-top-1 z-10 absolute inset-x-0 bg-gradient-to-b from-white to-transparent h-24" />
      <div className="-bottom-1 z-10 absolute inset-x-0 bg-gradient-to-t from-white to-transparent h-24" />
    </div>
  );
};

const ContestPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isClosed = localStorage.getItem("contest-popup-closed");
    if (!isClosed) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    const body = document.querySelector("body");
    if (isOpen && body) body.style.overflow = "hidden";
    else if (body) body.style.overflow = "auto";

    return () => {
      if (body) body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleClose = () => {
    const body = document.querySelector("body");
    if (body) body.style.overflow = "auto";
    setIsOpen(false);
    localStorage.setItem("contest-popup-closed", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-[100] fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="top-1/2 left-1/2 z-[101] fixed p-4 outline-none w-full max-w-5xl -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative flex bg-white shadow-2xl rounded-3xl h-[600px] overflow-hidden">
              <button
                onClick={handleClose}
                className="top-4 right-4 z-50 absolute bg-white/80 hover:bg-slate-100 backdrop-blur-sm p-2 rounded-full text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Cancel01Icon className="w-5 h-5" />
              </button>

              <div className="relative flex flex-col p-8 md:p-8 w-full md:w-1/2 overflow-y-auto custom-scroll">
                <div className="top-0 left-0 absolute w-full h-full overflow-hidden text-slate-50 pointer-events-none">
                  <div className="-top-[20%] -right-[10%] absolute bg-rose-500/5 opacity-50 blur-3xl rounded-full w-[50%] h-[50%]" />
                  <div className="top-[30%] -left-[10%] absolute bg-orange-500/5 opacity-50 blur-3xl rounded-full w-[40%] h-[40%]" />
                </div>

                <div className="z-10 relative flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="bg-slate-50 border border-slate-300 px-3 py-1 rounded-full font-bold text-slate-800 text-xs uppercase tracking-wider">
                      Opening Event
                    </span>
                    <span className="font-bold text-primary text-xs uppercase tracking-wider">
                      March 1st - March 28th
                    </span>
                  </div>

                  <h2 className="mb-2 font-merriweather font-extrabold text-slate-900 text-3xl md:text-4xl">
                    Spring Writing{" "}
                    <span className="bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 text-transparent">
                      Contest
                    </span>
                  </h2>
                  <p className="mb-8 max-w-md text-slate-500 text-sm">
                    Unleash your creativity. Compete for major exposure, badges,
                    and recognition on Readora.
                  </p>

                  <div className="flex-1 space-y-2 mb-3">
                    <div className="group relative flex items-start gap-4 bg-gradient-to-br from-rose-50/80 to-orange-50/80 hover:shadow-lg p-4 border border-rose-100/60 rounded-xl overflow-hidden transition-all duration-300">
                      <div className="top-0 right-0 absolute opacity-5 group-hover:opacity-15 p-3 transition-opacity duration-500">
                        <ChampionIcon className="w-24 h-24 text-rose-500 rotate-12" />
                      </div>

                      <div className="bg-white shadow-sm p-2.5 rounded-lg ring-4 ring-rose-50 text-rose-500">
                        <ChampionIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">
                          Grand Prize Winner
                        </h3>
                        <ul className="space-y-1.5 mt-2 text-slate-600 text-sm">
                          <li className="flex items-center gap-2">
                            <span className="flex-shrink-0 bg-rose-400 rounded-full w-1.5 h-1.5" />
                            <span>
                              Featured Story in{" "}
                              <span className="text-primary underline underline-offset-2">
                                Legends Shelf
                              </span>
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="flex-shrink-0 bg-rose-400 rounded-full w-1.5 h-1.5" />
                            Exclusive &quot;Contest Winner&quot; Badge
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="flex-shrink-0 bg-rose-400 rounded-full w-1.5 h-1.5" />
                            1 Year Free Premium
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="group flex items-start gap-4 bg-white hover:shadow-md p-3.5 border border-slate-100 hover:border-slate-200 rounded-xl transition-all duration-300">
                      <div className="bg-slate-50 group-hover:bg-amber-50 p-2.5 rounded-lg text-slate-500 group-hover:text-amber-500 transition-colors">
                        <Award01Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">
                          2nd & 3rd Place
                        </h3>
                        <p className="mt-1 text-slate-500 text-sm leading-relaxed">
                          14-30 days featured, &quot;Finalist&quot; badge, and 6
                          months of Premium.
                        </p>
                      </div>
                    </div>

                    <div className="group flex items-center gap-4 bg-white hover:shadow-md p-3.5 border border-slate-100 hover:border-slate-200 rounded-xl transition-all duration-300">
                      <div className="bg-slate-50 group-hover:bg-blue-50 p-2.5 rounded-lg text-slate-500 group-hover:text-blue-500 transition-colors">
                        <StarIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">
                          Top 10 Shortlist
                        </h3>
                        <p className="mt-0.5 text-slate-500 text-xs">
                          Shortlisted badge and up to 3 months of Premium.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto pt-2 border-slate-50 border-t w-full">
                    <Button
                      variant="ghost"
                      className="flex-1 hover:bg-slate-50 border border-transparent hover:border-slate-200 text-slate-500 hover:text-slate-900"
                      onClick={handleClose}
                    >
                      Maybe Later
                    </Button>
                    <Button
                      variant="default"
                      className="group flex-[1.5] shadow-lg hover:shadow-xl transition-all"
                      asChild
                    >
                      <Link href="/contest" onClick={handleClose}>
                        <span className="flex items-center gap-2">
                          View Full Details{" "}
                          <SparklesIcon className="w-4 h-4 text-primary-foreground/80" />
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="hidden md:block relative bg-slate-50 border-slate-100 border-l w-1/2 overflow-hidden">
                <div className="z-0 absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-40" />
                <div className="z-10 relative p-4 h-full">
                  <VerticalSlider />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContestPopup;
