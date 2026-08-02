"use client";

import { motion, type Variants } from "framer-motion";
import {
  Analytics01Icon,
  Calendar03Icon,
  PencilEdit01Icon,
  QuillWrite02Icon,
  Search01Icon,
  SparklesIcon,
  Tick02Icon,
} from "hugeicons-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

/**
 * The logged-out writer pitch at the foot of the homepage.
 *
 * Laid out around a single anchor — the revenue share — because that is the
 * strongest claim on the site and previously sat as one of four equally
 * weighted cards. Supporting features orbit it rather than compete with it.
 */
export default function HelloWriters() {
  const features = [
    {
      icon: SparklesIcon,
      title: "AI writing assistant",
      description:
        "Suggestions for plot, characters and style, built into the editor.",
    },
    {
      icon: PencilEdit01Icon,
      title: "Write without limits",
      description:
        "Any genre, theme or format. Mature and cross-genre work is welcome.",
    },
    {
      icon: Calendar03Icon,
      title: "Publish on your schedule",
      description:
        "Queue chapters in advance and release them when your readers expect them.",
    },
    {
      icon: Analytics01Icon,
      title: "Know what's working",
      description:
        "Per-chapter readership, where readers arrived from, and where they stopped.",
    },
  ];

  const earningPoints = [
    "Chapter unlocks, subscriptions and reader tips",
    "No minimum follower count to start earning",
    "You keep the rights to everything you publish",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    // <section>, not <main> — the homepage already has a main landmark.
    <section
      aria-labelledby="hello-writers-heading"
      className="relative flex flex-col justify-center items-center bg-slate-950 overflow-hidden text-white"
    >
      {/* Arc that carries the light page down into the dark section. */}
      <div className="top-0 right-0 left-0 absolute bg-slate-50 rounded-b-[50%] h-24 scale-x-150 -translate-y-12" />

      <div className="absolute inset-0 bg-slate-950 w-full h-full">
        <div className="top-[-10%] left-[-10%] absolute bg-primary/10 blur-[120px] rounded-full w-[40%] h-[40%]" />
        <div className="right-[-10%] bottom-[-10%] absolute bg-primary/10 blur-[120px] rounded-full w-[40%] h-[40%]" />
        <div className="top-[20%] right-[20%] absolute bg-primary/5 blur-[100px] rounded-full w-[30%] h-[30%]" />
      </div>

      <motion.div
        className="z-10 relative flex flex-col items-center gap-0 mx-auto px-4 pt-24 pb-20 sm:pb-28 max-w-[1540px] w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="text-center">
          <Badge
            variant="default"
            className="bg-white/5 backdrop-blur-sm mb-6 px-4 py-1.5 border-white/10 font-medium text-slate-200 text-sm"
          >
            For creators
          </Badge>

          <h2
            id="hello-writers-heading"
            className="font-extrabold text-slate-100 text-4xl sm:text-5xl md:text-6xl text-balance tracking-tight"
          >
            Hello writers,
            <br className="sm:hidden" /> welcome to{" "}
            <span className="text-primary">Readora</span>
          </h2>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-6 max-w-xl text-slate-400 text-lg text-center text-pretty leading-relaxed"
        >
          Write boldly, grow an audience, and earn from your first chapter —
          without signing your work away.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex sm:flex-row flex-col items-center gap-3 mt-8 w-full sm:w-auto"
        >
          <Link
            href="/auth/signin?redirect=/write"
            aria-label="Start writing on Readora"
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              effect="shineHover"
              icon={QuillWrite02Icon}
              className="shadow-lg shadow-primary/20 px-8 w-full font-semibold text-base"
            >
              Start writing today
            </Button>
          </Link>

          <Link
            href="/search"
            aria-label="Browse stories on Readora"
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              variant="ghost"
              icon={Search01Icon}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-sm px-8 border border-white/10 w-full text-base text-slate-200"
            >
              Browse stories
            </Button>
          </Link>
        </motion.div>

        {/* Anchor + supporting features. The earnings card leads because it is
            the claim writers are actually weighing. */}
        <div className="gap-4 grid lg:grid-cols-3 mt-16 sm:mt-20 w-full">
          {/* Glass, not a solid crimson fill — the accent carries the emphasis
              so the card reads as premium rather than shouting. */}
          <motion.div
            variants={itemVariants}
            className="relative flex flex-col bg-white/[0.07] backdrop-blur-sm p-6 sm:p-8 border border-primary/30 rounded-2xl lg:row-span-2 overflow-hidden"
          >
            <div
              aria-hidden
              className="-top-24 -right-16 absolute bg-primary/20 blur-3xl rounded-full size-56"
            />

            <div className="z-10 relative flex flex-col h-full">
              <span className="font-extrabold text-primary text-6xl sm:text-7xl leading-none tracking-tight">
                70%
              </span>
              <span className="mt-3 font-semibold text-slate-100 text-lg sm:text-xl">
                revenue share, from day one
              </span>
              <p className="mt-3 text-slate-400 text-sm sm:text-base text-pretty leading-relaxed">
                You keep the larger share of everything your writing earns.
                There is no invite, no threshold and no contract to sign.
              </p>

              <ul className="space-y-3 mt-8 lg:mt-auto pt-0 lg:pt-8">
                {earningPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="place-items-center grid bg-primary/15 mt-0.5 rounded-full size-5 text-primary shrink-0">
                      <Tick02Icon className="size-3" />
                    </span>
                    <span className="text-slate-300 text-sm text-pretty leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group bg-white/5 hover:bg-white/10 backdrop-blur-sm p-6 border border-white/10 hover:border-primary/40 rounded-2xl transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/15 group-hover:bg-primary p-2.5 rounded-xl text-primary group-hover:text-white transition-colors shrink-0">
                  <feature.icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="mb-1.5 font-semibold text-slate-100">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm text-pretty leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
