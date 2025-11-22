"use client";

import { motion } from "framer-motion";
import { QuillWrite02Icon, WebDesign01Icon } from "hugeicons-react";
import { Coins, PenLine, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { outfit } from "~/utils/font";

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
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 text-white">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 w-full h-full bg-slate-950">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <motion.div
        className="container relative z-10 flex flex-col items-center justify-center gap-8 px-4 py-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="mt-10 text-center">
          <Badge
            variant="default"
            className="mb-6 px-4 py-1.5 text-sm font-medium border-white/10 bg-white/5 text-slate-200 backdrop-blur-sm"
          >
            For Creators
          </Badge>
          <h1 className="text-center font-extrabold text-4xl tracking-tight sm:text-6xl md:text-7xl text-slate-100">
            Hello Writers, <br /> Welcome to{" "}
            <span
              className={`bg-gradient-to-r from-primary to-red-400 bg-clip-text text-transparent ${outfit.className}`}
            >
              Readora
            </span>
          </h1>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mx-auto mt-2 text-center max-w-2xl text-pretty text-lg text-slate-400 sm:text-xl leading-relaxed"
        >
          Write boldly. Grow your audience. Earn from day one with a modern,
          distraction‑free experience designed for your success.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mb-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/auth/signin" aria-label="Start writing on Readora">
            <Button
              size="lg"
              variant="default"
              effect="shineHover"
              icon={QuillWrite02Icon}
              className="group px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/10 bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
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
              className="px-8 py-6 text-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 transition-colors backdrop-blur-sm"
            >
              Browse Stories
            </Button>
          </Link>
        </motion.div>

        <section className="w-full pt-8">
          <div className="max-w-[1540px] mx-auto">
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 sm:text-4xl text-slate-100">
                Built for Writers Like You
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                A modern platform that gives you the tools to write, earn, and
                grow your audience without the hassle.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:shadow-primary/5 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="size-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-slate-100">
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
