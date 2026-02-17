"use client";

import { motion } from "framer-motion";
import { QuillWrite02Icon, WebDesign01Icon } from "hugeicons-react";
import { Coins, PenLine, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { manrope } from "~/utils/font";

export default function HelloWriters() {
  const features = [
    {
      icon: Coins,
      title: "70% Revenue Share",
      description:
        "Earn from day one through ads, subscriptions, chapter unlocks, and reader tips. Get paid for your work, no minimum follower requirements.",
    },
    {
      icon: Sparkles,
      title: "AI Writing Assistant",
      description:
        "Get smart suggestions for your plot, characters, and writing style. Let AI help you create better stories, faster.",
    },
    {
      icon: PenLine,
      title: "Write Without Limits",
      description:
        "No content restrictions. Write any genre, theme, or format. Perfect for mature themes and cross-genre stories.",
    },
    {
      icon: WebDesign01Icon,
      title: "Premium Reading Experience",
      description:
        "Experience matters a lot for both readers and writers. Readora focuses on keeping the design clean, modern, and easy to use.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className="relative flex flex-col justify-center items-center bg-slate-950 min-h-screen overflow-hidden text-white">
      <div className="top-0 right-0 left-0 absolute bg-slate-50 rounded-b-[50%] h-24 scale-x-150 -translate-y-12" />

      <div className="absolute inset-0 bg-slate-950 w-full h-full">
        <div className="top-[-10%] left-[-10%] absolute bg-primary/10 blur-[120px] rounded-full w-[40%] h-[40%]" />
        <div className="right-[-10%] bottom-[-10%] absolute bg-primary/10 blur-[120px] rounded-full w-[40%] h-[40%]" />
        <div className="top-[20%] right-[20%] absolute bg-primary/5 blur-[100px] rounded-full w-[30%] h-[30%]" />
      </div>

      <motion.div
        className="z-10 relative flex flex-col justify-center items-center gap-8 px-4 py-24 container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="mt-10 text-center">
          <Badge
            variant="default"
            className="bg-white/5 backdrop-blur-sm mb-6 px-4 py-1.5 border-white/10 font-medium text-slate-200 text-sm"
          >
            For Creators
          </Badge>
          <h1 className="font-extrabold text-slate-100 text-4xl sm:text-6xl md:text-7xl text-center tracking-tight">
            Hello Writers, <br /> Welcome to{" "}
            <span
              className={`bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent ${manrope.className}`}
            >
              Readora
            </span>
          </h1>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-2 max-w-2xl text-slate-400 text-lg sm:text-xl text-center text-pretty leading-relaxed"
        >
          Write boldly. Grow your audience. Earn from day one with a modern,
          distraction‑free experience designed for your success.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex sm:flex-row flex-col sm:justify-center items-center gap-4 mb-12"
        >
          <Link href="/auth/signin" aria-label="Start writing on Readora">
            <Button
              size="lg"
              variant="default"
              effect="shineHover"
              icon={QuillWrite02Icon}
              className="group bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10 px-8 py-6 font-semibold text-primary-foreground text-lg transition-all"
            >
              Start Writing Today
            </Button>
          </Link>

          <Link href="/search" aria-label="Browse trending stories on Readora">
            <Button
              size="lg"
              variant="ghost"
              iconPlacement="left"
              icon={Search}
              className="bg-white/5 backdrop-blur-sm px-8 py-6 border border-white/10 text-slate-200 text-lg transition-colors"
            >
              Browse Stories
            </Button>
          </Link>
        </motion.div>

        <section className="pt-8 w-full">
          <div className="mx-auto max-w-[1540px]">
            <motion.div variants={itemVariants} className="mb-16 text-center">
              <h2 className="mb-4 font-bold text-slate-100 text-3xl sm:text-4xl">
                Built for Writers Like You
              </h2>
              <p className="mx-auto max-w-2xl text-slate-400 text-lg">
                A modern platform that gives you the tools to write, earn, and
                grow your audience without the hassle.
              </p>
            </motion.div>

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group bg-white/5 hover:bg-white/10 hover:shadow-primary/5 hover:shadow-xl backdrop-blur-sm p-8 border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 group-hover:bg-primary/20 p-3 rounded-xl text-primary transition-colors">
                      <feature.icon className="size-6" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold text-slate-100 text-xl">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </main>
  );
}
