"use client";

import { motion } from "framer-motion";
import {
  Award01Icon,
  Calendar03Icon,
  ChampionIcon,
  CheckListIcon,
  Clock01Icon,
  CrownIcon,
  PencilEdit02Icon,
  StarIcon,
} from "hugeicons-react";
import { ArrowRight, Sparkles, TrophyIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SlotCounter from "react-slot-counter";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { merriweatherFont } from "~/utils/font";

// Animations
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Countdown Component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date to March 1st, 2026
    const targetDate = new Date("2026-03-01T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-4 md:gap-8 mt-12 pb-8">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
      ].map((time, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="font-black tabular-nums text-rose-500 text-3xl md:text-5xl">
            <SlotCounter
              value={String(time.value).padStart(2, "0")}
              sequentialAnimationMode
            />
          </div>
          <div className="mt-1 font-bold text-slate-400 text-xs md:text-sm uppercase tracking-widest">
            {time.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ContestPage() {
  return (
    <main className="bg-slate-50 min-h-screen text-slate-900">
      <section className="relative bg-slate-900 pt-24 pb-32 overflow-hidden text-white text-center">
        <div className="absolute inset-0 bg-[url(/subtle-grid.png)] opacity-10" />
        <div className="-top-24 -left-24 absolute bg-rose-500/20 blur-[100px] rounded-full w-96 h-96" />
        <div className="top-1/2 -right-24 absolute bg-orange-500/20 blur-[100px] rounded-full w-96 h-96 -translate-y-1/2" />

        <div className="z-10 relative mx-auto px-4 container">
          <div className="flex flex-col items-center mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-rose-500/10 backdrop-blur-sm mb-8 px-4 py-1.5 border border-rose-500/30 rounded-full font-medium text-rose-300 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Official Writing Competition</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className={cn(
                "mb-6 font-black text-white text-5xl sm:text-7xl lg:text-8xl leading-[1.1] tracking-tight",
                merriweatherFont.className,
              )}
            >
              <span className="bg-clip-text bg-gradient-to-br from-white to-slate-400 text-transparent">
                Spring
              </span>{" "}
              Writing <br />
              <span className="relative text-rose-500">
                Contest
                <svg
                  className="-bottom-2 left-0 absolute opacity-60 w-full text-rose-500"
                  height="10"
                  viewBox="0 0 200 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.00025 6.99997C25.8033 4.54232 52.4849 2.05978 99.4216 2.05978C123.639 2.05978 181.711 3.51834 198.001 7.00003"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="my-8 max-w-2xl text-slate-300 text-xl leading-relaxed"
            >
              Unleash your imagination. Compete against the best. <br /> Win{" "}
              <span className="border-rose-500/50 border-b font-semibold text-white">
                glory
              </span>{" "}
              and{" "}
              <span className="border-rose-500/50 border-b font-semibold text-white">
                exclusive rewards
              </span>
              .
            </motion.p>

            <CountdownTimer />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-8 mb-4 text-center"
            >
              <div className="font-black tabular-nums text-white text-3xl md:text-4xl">
                -
              </div>
              <div className="mt-1 font-bold text-slate-400 text-xs md:text-sm uppercase tracking-widest">
                {/* Writers Joined So Far */}
                No submission yet, Be the first one
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex sm:flex-row flex-col items-center gap-4 mt-8"
            >
              <Button
                size="lg"
                variant="outline"
                className="bg-rose-600 hover:bg-rose-700 shadow-[0_10px_30px_-10px_rgba(225,29,72,0.5)] px-10 border-2 border-transparent rounded-full h-14 font-bold text-white hover:scale-105 transition-all"
                asChild
              >
                <Link href="#rules">Read The Rules</Link>
              </Button>
              <Button
                size="lg"
                className="bg-slate-800/50 hover:bg-slate-800 backdrop-blur-md px-10 border-slate-700 rounded-full h-14 text-white hover:text-white"
                asChild
              >
                <Link href="/write">
                  Submit Your Entry <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="right-0 bottom-0 left-0 absolute bg-slate-50 rounded-t-[50%] h-24 scale-x-150 translate-y-12" />
      </section>

      <section className="z-10 relative py-12 overflow-hidden">
        <div className="mx-auto px-4 container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-bold text-rose-500 text-sm uppercase tracking-widest">
              The Roadmap
            </h2>
            <h3 className="font-merriweather font-black text-slate-900 text-3xl md:text-4xl">
              Journey to Victory
            </h3>
          </div>

          <div className="mx-auto max-w-6xl">
            <div className="relative">
              <div className="hidden md:block top-0 bottom-0 left-1/2 absolute bg-slate-200 rounded-full w-1 -translate-x-1/2" />

              <div className="relative flex md:flex-row flex-col justify-between items-center">
                <div className="group relative bg-white hover:bg-rose-50/30 shadow-sm hover:shadow-rose-500/10 hover:shadow-xl p-8 border border-slate-100 hover:border-rose-200/60 rounded-2xl md:w-[45%] transition-all hover:-translate-y-1 duration-300">
                  <div className="hidden md:block top-1/2 -right-3 absolute bg-white border-slate-100 border-t border-r w-6 h-6 rotate-45 -translate-y-1/2 transform" />
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-rose-50 p-3 rounded-xl text-rose-500">
                      <PencilEdit02Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-400 text-xs uppercase">
                        Phase 1
                      </div>
                      <h4 className="font-bold text-slate-900 text-xl">
                        Submission Period
                      </h4>
                    </div>
                  </div>
                  <p className="mb-4 text-slate-600 leading-relaxed">
                    The portal opens for entries. Submit your original story
                    anytime during this window. Early submissions allow for more
                    community feedback!
                  </p>
                  <div className="inline-flex items-center bg-rose-50 px-3 py-1 rounded-full font-bold text-rose-600 text-sm">
                    <Clock01Icon className="mr-2 w-4 h-4" /> March 1st - March
                    28th
                  </div>
                </div>
                <div className="hidden left-1/2 z-10 absolute md:flex justify-center items-center bg-rose-500 shadow-lg border-4 border-slate-50 rounded-full w-10 h-10 font-bold text-white -translate-x-1/2">
                  1
                </div>
                <div className="hidden md:block md:pr-12 md:w-[45%] text-right">
                  <span className="font-black text-slate-200 text-6xl select-none">
                    START
                  </span>
                </div>
              </div>

              <div className="relative flex md:flex-row-reverse flex-col justify-between items-center">
                <div className="group relative bg-white hover:bg-rose-50/30 shadow-sm hover:shadow-rose-500/10 hover:shadow-xl p-8 border border-slate-100 hover:border-rose-200/60 rounded-2xl md:w-[45%] transition-all hover:-translate-y-1 duration-300">
                  <div className="hidden md:block top-1/2 -left-3 absolute bg-white border-slate-100 border-t border-l w-6 h-6 -rotate-45 -translate-y-1/2 transform" />
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-orange-50 p-3 rounded-xl text-orange-500">
                      <CheckListIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-400 text-xs uppercase">
                        Phase 2
                      </div>
                      <h4 className="font-bold text-slate-900 text-xl">
                        Community Voting
                      </h4>
                    </div>
                  </div>
                  <p className="mb-4 text-slate-600 leading-relaxed">
                    Submissions close. The community votes on their favorites,
                    and our panel of judges begins the review process.
                  </p>
                  <div className="inline-flex items-center bg-orange-50 px-3 py-1 rounded-full font-bold text-orange-600 text-sm">
                    <Calendar03Icon className="mr-2 w-4 h-4" /> March 29th -
                    April 4th
                  </div>
                </div>
                <div className="hidden left-1/2 z-10 absolute md:flex justify-center items-center bg-slate-900 shadow-lg border-4 border-slate-50 rounded-full w-10 h-10 font-bold text-white -translate-x-1/2">
                  2
                </div>
                <div className="hidden md:block md:pl-12 md:w-[45%] text-left">
                  <span className="font-black text-slate-200 text-6xl select-none">
                    VOTE
                  </span>
                </div>
              </div>

              <div className="relative flex md:flex-row flex-col justify-between items-center">
                <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 shadow-slate-900/10 shadow-xl hover:shadow-rose-500/20 p-8 border border-slate-700/50 hover:border-rose-500/30 rounded-2xl md:w-[45%] text-white transition-all hover:-translate-y-1 duration-300">
                  <div className="hidden md:block top-1/2 -right-3 absolute bg-slate-800 w-6 h-6 rotate-45 -translate-y-1/2 transform" />
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-rose-500 p-3 rounded-xl text-white">
                      <CrownIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-400 text-xs uppercase">
                        Grand Finale
                      </div>
                      <h4 className="font-bold text-white text-xl">
                        Winners Announced
                      </h4>
                    </div>
                  </div>
                  <p className="mb-4 text-slate-300 leading-relaxed">
                    The results are in! Winners are celebrated on the homepage,
                    badges are awarded, and premium prizes are distributed.
                  </p>
                  <div className="inline-flex items-center bg-white/10 px-3 py-1 rounded-full font-bold text-white text-sm">
                    <TrophyIcon className="mr-2 w-4 h-4" /> April 5th
                  </div>
                </div>
                <div className="hidden left-1/2 z-10 absolute md:flex justify-center items-center bg-rose-500 shadow-lg border-4 border-slate-50 rounded-full w-10 h-10 font-bold text-white -translate-x-1/2">
                  3
                </div>
                <div className="hidden md:block md:pr-12 md:w-[45%] text-right">
                  <span className="font-black text-slate-200 text-6xl select-none">
                    WIN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right-0 bottom-0 left-0 absolute bg-white rounded-t-[50%] h-24 scale-x-150 translate-y-12" />
      </section>

      <section className="relative bg-white py-24 overflow-hidden" id="prizes">
        <div className="top-0 right-0 absolute opacity-5 p-24 pointer-events-none">
          <TrophyIcon className="w-96 h-96 text-rose-500 rotate-12" />
        </div>
        <div className="z-10 relative mx-auto px-4 container">
          <div className="mb-28 text-center">
            <h2 className="mb-3 font-bold text-rose-500 text-sm uppercase tracking-widest">
              Rewards
            </h2>
            <h3 className="font-merriweather font-black text-slate-900 text-4xl md:text-5xl">
              Treasure Awaits
            </h3>
          </div>

          <div className="items-end gap-4 grid grid-cols-1 md:grid-cols-3 mx-auto max-w-6xl">
            <div className="group relative bg-slate-50 hover:shadow-2xl hover:shadow-slate-200/50 p-8 border border-slate-100 hover:border-rose-500/30 rounded-[2rem] transition-all duration-300">
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                <div className="top-0 -right-20 absolute bg-rose-500/20 opacity-0 group-hover:opacity-100 blur-3xl rounded-full w-72 h-72 transition-all -translate-y-12 group-hover:translate-y-0 duration-500" />
                <div className="-bottom-20 -left-20 absolute bg-orange-500/20 opacity-0 group-hover:opacity-100 blur-3xl rounded-full w-64 h-64 transition-all translate-y-12 group-hover:translate-y-0 duration-500" />
              </div>

              <div className="top-0 left-1/2 absolute flex justify-center items-center bg-white shadow-lg border border-slate-100 rounded-2xl w-16 h-16 text-slate-400 group-hover:text-rose-500 transition-colors -translate-x-1/2 -translate-y-1/2">
                <span className="font-black text-2xl">2</span>
              </div>
              <div className="z-10 relative mt-8 mb-6 text-center">
                <h4 className="font-bold text-slate-800 text-2xl">Runner Up</h4>
                <p className="text-slate-500 text-sm">Silver Tier</p>
              </div>
              <ul className="z-10 relative space-y-4">
                <li className="flex items-center gap-3 bg-white shadow-sm p-3 border border-slate-100 rounded-xl">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <StarIcon className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">
                    30 Days Featured
                  </span>
                </li>
                <li className="flex items-center gap-3 bg-white shadow-sm p-3 border border-slate-100 rounded-xl">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <Award01Icon className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">
                    "Finalist" Badge
                  </span>
                </li>
                <li className="flex items-center gap-3 bg-white shadow-sm p-3 border border-slate-100 rounded-xl">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <CheckListIcon className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">
                    6 Months Premium
                  </span>
                </li>
              </ul>
            </div>

            <div className="group relative bg-slate-900 shadow-2xl shadow-rose-900/20 p-8 md:p-10 border border-slate-800 rounded-[2.5rem] transition-all duration-300 transform">
              <div className="absolute inset-0 bg-gradient-to-b from-rose-500/10 to-transparent rounded-[2.5rem]" />
              <div className="top-0 left-1/2 absolute flex justify-center items-center bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg shadow-rose-500/40 rounded-2xl ring-4 ring-white w-24 h-24 text-white -translate-x-1/2 -translate-y-1/2">
                <CrownIcon className="w-12 h-12" />
              </div>
              <div className="z-10 relative mt-12 mb-8 text-center">
                <h4 className="font-merriweather font-black text-white text-3xl">
                  Champion
                </h4>
                <p className="mt-1 font-bold text-rose-400 text-sm uppercase tracking-wide">
                  Grand Prize
                </p>
              </div>
              <ul className="z-10 relative space-y-4">
                <li className="flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 border border-white/5 rounded-xl transition-colors">
                  <div className="bg-rose-500 shadow-lg shadow-rose-500/30 p-2 rounded-lg text-white">
                    <StarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-white">
                      Featured Story on
                    </span>
                    <span className="text-slate-300 text-xs">Legends Shelf</span>
                  </div>
                </li>
                <li className="flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 border border-white/5 rounded-xl transition-colors">
                  <div className="bg-rose-500 shadow-lg shadow-rose-500/30 p-2 rounded-lg text-white">
                    <ChampionIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-white">
                      Exclusive Badge
                    </span>
                    <span className="text-slate-300 text-xs">
                      Permanent "Contest Winner" flair
                    </span>
                  </div>
                </li>
                <li className="flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-4 border border-white/5 rounded-xl transition-colors">
                  <div className="bg-rose-500 shadow-lg shadow-rose-500/30 p-2 rounded-lg text-white">
                    <TrophyIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-bold text-white">
                      1 Year Premium
                    </span>
                    <span className="text-slate-300 text-xs">
                      Unlock all platform features
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="group relative bg-slate-50 hover:shadow-2xl hover:shadow-slate-200/50 p-8 border border-slate-100 hover:border-primary rounded-[2rem] transition-all duration-300">
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
                <div className="top-0 -right-20 absolute bg-amber-500/20 opacity-0 group-hover:opacity-100 blur-3xl rounded-full w-72 h-72 transition-all -translate-y-12 group-hover:translate-y-0 duration-500" />
                <div className="-bottom-20 -left-20 absolute bg-rose-500/20 opacity-0 group-hover:opacity-100 blur-3xl rounded-full w-64 h-64 transition-all translate-y-12 group-hover:translate-y-0 duration-500" />
              </div>

              <div className="top-0 left-1/2 absolute flex justify-center items-center bg-white shadow-lg border border-slate-100 rounded-2xl w-16 h-16 text-slate-400 group-hover:text-amber-500 transition-colors -translate-x-1/2 -translate-y-1/2">
                <span className="font-black text-2xl">3</span>
              </div>
              <div className="z-10 relative mt-8 mb-6 text-center">
                <h4 className="font-bold text-slate-800 text-2xl">Runner Up</h4>
                <p className="text-slate-500 text-sm">Bronze Tier</p>
              </div>
              <ul className="z-10 relative space-y-4">
                <li className="flex items-center gap-3 bg-white shadow-sm p-3 border border-slate-100 rounded-xl">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <StarIcon className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">
                    14 Days Featured
                  </span>
                </li>
                <li className="flex items-center gap-3 bg-white shadow-sm p-3 border border-slate-100 rounded-xl">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <Award01Icon className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">
                    "Finalist" Badge
                  </span>
                </li>
                <li className="flex items-center gap-3 bg-white shadow-sm p-3 border border-slate-100 rounded-xl">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <CheckListIcon className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">
                    3 Months Premium
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-slate-900 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url(/subtle-grid.png)] opacity-10" />
        <div className="top-0 left-1/2 absolute bg-rose-500/20 blur-[120px] rounded-full w-full max-w-4xl h-[500px] -translate-x-1/2 pointer-events-none" />

        <div className="z-10 relative mx-auto px-4 text-center container">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 mb-6 px-4 py-2 border border-yellow-500/30 rounded-full font-bold text-yellow-400 text-xs uppercase tracking-wider">
              <CrownIcon className="w-4 h-4" /> Legends Shelf
            </div>
            <h2 className="bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-6 font-merriweather font-black text-transparent text-4xl md:text-6xl">
              Legends are Born Here
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400 text-lg">
              Every year, thousands compete, but only the extraordinary remain.
              Will you be the next addition to our history?
            </p>
          </div>

          <div className="group relative bg-slate-800/50 backdrop-blur-sm mx-auto p-12 border border-slate-700/50 rounded-3xl max-w-5xl overflow-hidden">
            <div className="absolute inset-0 flex justify-center items-center opacity-30 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
              <TrophyIcon className="w-[400px] h-[400px] text-yellow-500/10" />
            </div>

            <div className="z-10 relative flex flex-col justify-center items-center min-h-[300px]">
              <div className="flex justify-center items-center bg-slate-700/30 mb-6 rounded-full ring-4 ring-rose-500/20 w-32 h-32 animate-pulse">
                <CrownIcon className="w-16 h-16 text-rose-500/50" />
              </div>
              <h3 className="mb-2 font-bold text-white text-2xl">
                2026 Champion
              </h3>
              <p className="font-medium text-slate-400">
                To Be Announced April 10th
              </p>

              <div className="gap-2 grid grid-cols-3 opacity-50 mt-8 w-full max-w-xs">
                <div className="bg-gradient-to-t from-slate-700 to-transparent mx-2 rounded-t-lg h-20" />
                <div className="relative bg-gradient-to-t from-yellow-500/20 to-transparent mx-2 border-yellow-500/30 border-t rounded-t-lg h-32">
                  <div className="-top-4 left-1/2 absolute bg-yellow-500/10 blur-xl rounded-full w-20 h-20 -translate-x-1/2" />
                </div>
                <div className="bg-gradient-to-t from-slate-700 to-transparent mx-2 rounded-t-lg h-16" />
              </div>
            </div>
          </div>
        </div>
        <div className="right-0 bottom-0 left-0 absolute bg-white rounded-t-[50%] h-24 scale-x-150 translate-y-12" />
      </section>

      <section className="relative bg-white py-20 overflow-hidden" id="rules">
        <div className="top-1/2 -left-24 absolute bg-blue-500/5 blur-[100px] rounded-full w-96 h-96 -translate-y-1/2" />
        <div className="right-0 bottom-0 absolute bg-rose-500/5 blur-[100px] rounded-full w-96 h-96 translate-x-1/3 translate-y-1/3" />
        <div className="mx-auto px-4 max-w-5xl container">
          <div className="items-center gap-12 grid grid-cols-1 md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-merriweather font-black text-slate-900 text-3xl">
                Rules of Engagement
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-shrink-0 justify-center items-center bg-rose-50 rounded-full ring-4 ring-rose-500/10 w-10 h-10 font-bold text-rose-500">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">
                      Original Works Only
                    </h4>
                    <p className="mt-1 text-slate-500 text-sm leading-relaxed">
                      Plagiarism will lead to immediate disqualification. We
                      celebrate your unique voice.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-shrink-0 justify-center items-center bg-rose-50 rounded-full ring-4 ring-rose-500/10 w-10 h-10 font-bold text-rose-500">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Word Count</h4>
                    <p className="mt-1 text-slate-500 text-sm leading-relaxed">
                      Minimum 10,000 words. Maximum 50,000 words. Quality over
                      quantity, always.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-shrink-0 justify-center items-center bg-rose-50 rounded-full ring-4 ring-rose-500/10 w-10 h-10 font-bold text-rose-500">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Fresh Stories</h4>
                    <p className="mt-1 text-slate-500 text-sm leading-relaxed">
                      Stories must be started after March 1st. Pre-written works
                      are not eligible.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <a href="/contest-rulebook.pdf" download>
                  <Button
                    variant="link"
                    className="p-0 h-auto font-bold text-rose-500 hover:text-rose-700"
                  >
                    Download Full Rulebook PDF
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative bg-slate-50 p-8 md:p-12 border border-border rounded-3xl overflow-hidden">
              <div className="top-0 right-0 absolute bg-rose-500/10 rounded-bl-full w-32 h-32" />
              <h3 className="mb-4 font-bold text-slate-900 text-xl">
                Judging Criteria
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white shadow-sm p-4 rounded-xl">
                  <span className="font-medium text-slate-700">
                    Creativity & Originality
                  </span>
                  <span className="font-bold text-rose-500">40%</span>
                </div>
                <div className="flex justify-between items-center bg-white shadow-sm p-4 rounded-xl">
                  <span className="font-medium text-slate-700">
                    Plot & Pacing
                  </span>
                  <span className="font-bold text-rose-500">30%</span>
                </div>
                <div className="flex justify-between items-center bg-white shadow-sm p-4 rounded-xl">
                  <span className="font-medium text-slate-700">
                    Character Development
                  </span>
                  <span className="font-bold text-rose-500">20%</span>
                </div>
                <div className="flex justify-between items-center bg-white shadow-sm p-4 rounded-xl">
                  <span className="font-medium text-slate-700">
                    Grammar & Mechanics
                  </span>
                  <span className="font-bold text-rose-500">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right-0 bottom-0 left-0 absolute bg-slate-900 rounded-t-[50%] h-24 scale-x-150 translate-y-12" />
      </section>

      <section className="relative bg-slate-900 py-24 overflow-hidden text-center">
        <div className="z-0 absolute inset-0 bg-[url(/grid-pattern.svg)] opacity-10" />
        <div className="bottom-0 left-1/2 absolute bg-rose-600/20 blur-[100px] rounded-full w-full max-w-3xl h-64 -translate-x-1/2 pointer-events-none" />

        <div className="z-10 relative mx-auto px-4 container">
          <h2 className="mb-6 font-merriweather font-black text-white text-3xl md:text-5xl tracking-tight">
            Your journey begins <span className="text-rose-500">now</span>.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-slate-400 text-lg">
            Join 5,000+ writers and take the first step towards becoming a
            legend.
          </p>
          <Button
            size="lg"
            className="bg-white hover:bg-slate-100 shadow-white/10 shadow-xl px-12 rounded-full h-16 font-bold text-slate-900 text-lg hover:scale-105 transition-all"
            asChild
          >
            <Link href="/write" className="flex items-center gap-2">
              Enter Contest <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
