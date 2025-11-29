"use client";
import { motion } from "framer-motion";
import { ArrowDown01Icon, ArrowUp01Icon } from "hugeicons-react";
import {
  BookOpen,
  Check,
  DollarSign,
  Feather,
  Layout,
  Minus,
  Pen,
  PenTool,
  Scroll,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { manrope } from "~/utils/font";

export default function ComparisonPage() {
  const [showDetailedComparison, setShowDetailedComparison] = useState(false);

  const importantComparison = [
    {
      feature: "Search & Discovery",
      readora: { text: "Advanced Filters + Tag System", icon: "check" },
      wattpad: { text: "Basic Search (Often Broken)", icon: "x" },
      royalroad: { text: "Good Filters, Limited Tags", icon: "partial" },
    },
    {
      feature: "Algorithm Fairness",
      readora: { text: "New & Rising Boost", icon: "check" },
      wattpad: { text: "Popularity-Driven", icon: "partial" },
      royalroad: { text: "Update Frequency Matters", icon: "partial" },
    },
    {
      feature: "Platform Philosophy",
      readora: { text: "Community First, Revenue Second", icon: "check" },
      wattpad: { text: "Ad Revenue Focused", icon: "partial" },
      royalroad: { text: "Community-Driven", icon: "check" },
    },
    {
      feature: "Monetization",
      readora: { text: "Direct Support + Revenue Share", icon: "check" },
      wattpad: { text: "Paid Stories Program", icon: "check" },
      royalroad: { text: "External Links Only", icon: "partial" },
    },
    {
      feature: "Reading Experience",
      readora: { text: "Ad-Free, Premium UI", icon: "check" },
      wattpad: { text: "Ad-Supported", icon: "x" },
      royalroad: { text: "Ad-Free, Simple", icon: "check" },
    },
  ];

  const detailedComparison = [
    ...importantComparison,
    {
      feature: "The Legends Shelf",
      readora: { text: "Hall of Fame for Top Stories", icon: "check" },
      wattpad: { text: "Wattys Awards", icon: "check" },
      royalroad: { text: "Trending & Best Rated Lists", icon: "partial" },
    },
    {
      feature: "Writing Tools",
      readora: { text: "Rich Text + AI Assistance", icon: "check" },
      wattpad: { text: "Mobile-First Basic Editor", icon: "partial" },
      royalroad: { text: "HTML/BBCode Editor", icon: "partial" },
    },
    {
      feature: "Content Focus",
      readora: { text: "All Genres", icon: "check" },
      wattpad: { text: "Romance, YA, Fanfiction", icon: "check" },
      royalroad: { text: "Fantasy, LitRPG", icon: "check" },
    },
    {
      feature: "Community Size",
      readora: { text: "Growing (Curated)", icon: "partial" },
      wattpad: { text: "90M+ Users", icon: "check" },
      royalroad: { text: "3M+ Active Readers", icon: "check" },
    },
    {
      feature: "Feature Requests",
      readora: { text: "Community-Driven Development", icon: "check" },
      wattpad: { text: "Corporate Decision Making", icon: "x" },
      royalroad: { text: "Limited Community Input", icon: "partial" },
    },
    {
      feature: "Reader Analytics",
      readora: { text: "Detailed Insights Dashboard", icon: "check" },
      wattpad: { text: "Basic Stats", icon: "partial" },
      royalroad: { text: "View Counts & Follows", icon: "partial" },
    },
    {
      feature: "Mobile Experience",
      readora: { text: "Currently No App", icon: "x" },
      wattpad: { text: "Dedicated Mobile App", icon: "check" },
      royalroad: { text: "Mobile Web", icon: "partial" },
    },
  ];

  const comparisonData = showDetailedComparison
    ? detailedComparison
    : importantComparison;

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "check":
        return <Check className="h-5 w-5 text-green-500" />;
      case "x":
        return <X className="h-5 w-5 text-red-500" />;
      case "partial":
        return <Minus className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("min-h-screen bg-background", manrope.className)}>
      <section className="relative overflow-hidden py-12 flex flex-col items-center justify-center min-h-[700px] lg:py-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-background" />

        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[10%]"
          >
            <BookOpen className="w-12 h-12 text-primary/40" />
          </motion.div>

          <motion.div
            initial={{ y: 20 }}
            animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-[40%] right-[12%]"
          >
            <Feather className="w-16 h-16 text-primary/30" />
          </motion.div>

          <motion.div
            initial={{ y: 20 }}
            animate={{ y: [0, -25, 0], rotate: [0, 10, 0] }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-[20%] left-[15%]"
          >
            <Scroll className="w-10 h-10 text-primary/40" />
          </motion.div>

          <motion.div
            initial={{ y: 20 }}
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute top-[25%] right-[25%]"
          >
            <Pen className="w-8 h-8 text-primary/30" />
          </motion.div>

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              borderRadius: [
                "30% 70% 70% 30% / 30% 30% 70% 70%",
                "50% 50% 33% 67% / 55% 27% 73% 45%",
                "30% 70% 70% 30% / 30% 30% 70% 70%",
              ],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -60, 0],
              borderRadius: [
                "50% 50% 33% 67% / 55% 27% 73% 45%",
                "30% 70% 70% 30% / 30% 30% 70% 70%",
                "50% 50% 33% 67% / 55% 27% 73% 45%",
              ],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <Badge variant="secondary" className="px-3 py-1">
              Platform Comparison
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-slate-700 sm:text-4xl md:text-5xl max-w-4xl text-slate-700">
              Find the Right Platform for{" "}
              <span className="text-primary">Your Writing Journey</span>
            </h1>
            <p className="max-w-2xl text-base text-slate-700/80">
              Each platform has unique strengths. Compare features honestly to
              make an informed choice for your stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 text-sm lg:text-base"
              >
                <Link href="/write">Start Writing Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-8 text-sm lg:text-base"
              >
                <Link href="/search?content-type=original">
                  Explore Originals
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-700 sm:text-3xl mb-2">
                Side-by-Side Comparison
              </h2>
              <p className="text-muted-foreground">
                Transparent comparison highlighting what each platform does best
              </p>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b-2">
                  <TableHead className="w-[280px] text-base font-semibold pl-6 py-5">
                    Feature
                  </TableHead>
                  <TableHead className="text-base font-semibold text-center py-5 bg-primary/5">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-primary">Readora</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        (Us - Est. 2026)
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="text-base font-semibold text-center py-5">
                    <div className="flex flex-col items-center gap-1">
                      <span>Wattpad</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        (Est. 2006)
                      </span>
                    </div>
                  </TableHead>
                  <TableHead className="text-base font-semibold text-center py-5">
                    <div className="flex flex-col items-center gap-1">
                      <span>Royal Road and Others</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        (Est. 2013)
                      </span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, i) => (
                  <TableRow
                    key={i}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium pl-6 py-4 text-sm">
                      {row.feature}
                    </TableCell>
                    <TableCell className="text-center bg-primary/5 py-4">
                      <div className="flex flex-col items-center gap-2">
                        {getIcon(row.readora.icon)}
                        <span className="text-sm font-medium">
                          {row.readora.text}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <div className="flex flex-col items-center gap-2">
                        {getIcon(row.wattpad.icon)}
                        <span className="text-sm">{row.wattpad.text}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <div className="flex flex-col items-center gap-2">
                        {getIcon(row.royalroad.icon)}
                        <span className="text-sm">{row.royalroad.text}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <Button
              variant={showDetailedComparison ? "outline" : "default"}
              onClick={() => setShowDetailedComparison(!showDetailedComparison)}
              className="w-full md:w-auto"
              icon={showDetailedComparison ? ArrowUp01Icon : ArrowDown01Icon}
            >
              {showDetailedComparison
                ? "Show Key Features"
                : "Show All Features"}
            </Button>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {comparisonData.map((row, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{row.feature}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 p-2.5 rounded-lg bg-primary/5">
                    {getIcon(row.readora.icon)}
                    <div>
                      <div className="font-semibold text-xs text-primary">
                        Readora
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {row.readora.text}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/50">
                    {getIcon(row.wattpad.icon)}
                    <div>
                      <div className="font-semibold text-xs">Wattpad</div>
                      <div className="text-xs text-muted-foreground">
                        {row.wattpad.text}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/50">
                    {getIcon(row.royalroad.icon)}
                    <div>
                      <div className="font-semibold text-xs">Royal Road</div>
                      <div className="text-xs text-muted-foreground">
                        {row.royalroad.text}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-muted-foreground">Strong feature</span>
            </div>
            <div className="flex items-center gap-2">
              <Minus className="h-5 w-5 text-yellow-500" />
              <span className="text-muted-foreground">Moderate/Limited</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              <span className="text-muted-foreground">Not available</span>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-slate-700 sm:text-3xl mb-2">
              What Each Platform Does Best
            </h2>
            <p className="text-muted-foreground">
              Every platform has its unique strengths and ideal audience
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-colors bg-background/60 backdrop-blur-sm">
              <div className="absolute top-0 right-1/4 w-20 h-20 bg-primary/5 rounded-b-full -z-10" />
              <div className="absolute bottom-0 right-0 w-28 h-28 bg-primary/5 rounded-tl-full -z-10" />

              <CardHeader>
                <Badge className="w-fit mb-3 bg-primary">Readora</Badge>
                <CardTitle className="text-lg">
                  Reader & Writer Focused
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm text-muted-foreground">
                <p>✓ Non broken algorithm, best for early author visibility </p>
                <p>✓ Rich text editor with AI features</p>
                <p>✓ Community-driven feature development</p>
                <p>✓ Revenue second, no ads</p>
                <p>✓ Scheduling Chapters and Stories</p>
                <p>
                  ✓ Give a limited set of followers access for validation and
                  early use.
                </p>
                <p>✗ Limited user base as it's new</p>
                <p className="text-xs pt-2 text-muted-foreground/80">
                  Tell us what you need—we'll build it
                </p>
              </CardContent>
            </Card>

            <Card className="border">
              <CardHeader>
                <Badge className="w-fit mb-3" variant="secondary">
                  Wattpad
                </Badge>
                <CardTitle className="text-lg">
                  Massive Reach & Publishing Deals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm text-muted-foreground">
                <p>✓ 90M+ users for maximum exposure</p>
                <p>✓ Have mobile app and large community</p>
                <p>✓ Paid Stories program for monetization</p>
                <p>✓ Publishing partnerships and Wattys</p>
                <p>✗ Search often broken, limited filters</p>
                <p>✗ Ad-heavy experience for readers</p>
              </CardContent>
            </Card>

            <Card className="border">
              <CardHeader>
                <Badge className="w-fit mb-3" variant="secondary">
                  Royal Road and Others
                </Badge>
                <CardTitle className="text-lg">
                  Genre Excellence & Dedicated Fans
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-sm text-muted-foreground">
                <p>✓ Best for fantasy, LitRPG, progression</p>
                <p>✓ Highly engaged 3M+ reader base</p>
                <p>✓ Detailed rating system and forums</p>
                <p>✓ Strong community culture</p>
                <p>✗ Limited monetization options</p>
                <p>✗ Niche genre focus</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-12 lg:py-16 relative overflow-hidden">
        {/* Background Shapes */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] opacity-50" />

          {/* Clipped Shapes */}
          <div
            className="absolute top-[10%] left-[5%] w-32 h-32 bg-primary/5"
            style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
          />
          <div
            className="absolute bottom-[15%] right-[8%] w-40 h-40 bg-primary/5"
            style={{ clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)" }}
          />
          <div
            className="absolute top-[40%] right-[2%] w-24 h-24 bg-primary/5"
            style={{ clipPath: "circle(50% at 50% 50%)" }}
          />
          <div
            className="absolute bottom-[30%] left-[2%] w-36 h-36 bg-primary/5"
            style={{
              clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
            }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-slate-700 sm:text-3xl mb-2 text-slate-700">
              The Readora Difference
            </h2>
            <p className="text-muted-foreground">
              Features that truly enhance your writing and reading experience
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-colors bg-background/60 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10" />
              <CardHeader>
                <Search className="h-9 w-9 text-primary mb-2" />
                <CardTitle className="text-base text-slate-700">
                  Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Advanced filters, tag system, and a search that actually
                works—unlike Wattpad's frequently broken one. Find exactly what
                you want to read.
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-colors bg-background/60 backdrop-blur-sm">
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary/5 rounded-tr-full -z-10" />
              <CardHeader>
                <Trophy className="h-9 w-9 text-primary mb-2" />
                <CardTitle className="text-base text-slate-700">
                  Curated Story Lists
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                A prestigious hall of fame showcasing the best stories on
                Readora. Recognition that matters and drives genuine readership.
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-colors bg-background/60 backdrop-blur-sm">
              <div className="absolute top-1/2 right-0 w-16 h-16 bg-primary/5 rounded-l-full -translate-y-1/2 -z-10" />
              <CardHeader>
                <Sparkles className="h-9 w-9 text-primary mb-2" />
                <CardTitle className="text-base text-slate-700">
                  Writing Assistance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Optional grammar checks, plot summaries, and idea generation.
                Tools that help when you need them, invisible when you don't.
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-colors bg-background/60 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-br-full -z-10" />
              <CardHeader>
                <Users className="h-9 w-9 text-primary mb-2" />
                <CardTitle className="text-base text-slate-700">
                  User Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Your feedback shapes the platform. Request features, vote on
                priorities, and see them implemented—not lost in corporate
                bureaucracy.
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-colors bg-background/60 backdrop-blur-sm">
              <div className="absolute bottom-0 right-0 w-28 h-28 bg-primary/5 rounded-tl-full -z-10" />
              <CardHeader>
                <TrendingUp className="h-9 w-9 text-primary mb-2" />
                <CardTitle className="text-base text-slate-700">
                  Story Visibility
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                New stories get real visibility through our "New & Rising"
                system. Your first chapters won't be buried under established
                hits.
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-colors bg-background/60 backdrop-blur-sm">
              <div className="absolute top-0 right-1/4 w-20 h-20 bg-primary/5 rounded-b-full -z-10" />
              <CardHeader>
                <Layout className="h-9 w-9 text-primary mb-2" />
                <CardTitle className="text-base text-slate-700">
                  Clean Interface
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Dark mode first, ad-free reading experience. Modern UI that puts
                stories front and center, built for readers and writers.
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-colors bg-background/60 backdrop-blur-sm">
              <div className="absolute bottom-1/4 left-0 w-16 h-32 bg-primary/5 rounded-r-full -z-10" />
              <CardHeader>
                <PenTool className="h-9 w-9 text-primary mb-2" />
                <CardTitle className="text-base text-slate-700">
                  Writing Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Rich text editor, draft management, scheduling, and analytics.
                Everything you need without juggling multiple tools.
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-colors bg-background/60 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10" />
              <CardHeader>
                <DollarSign className="h-9 w-9 text-primary mb-2" />
                <CardTitle className="text-base text-slate-700">
                  Monetization
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Direct reader support and fair revenue sharing. Keep more of
                what you earn with clear, transparent terms.
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-colors bg-background/60 backdrop-blur-sm">
              <div className="absolute bottom-0 left-0 w-full h-16 bg-primary/5 rounded-t-[50%] -z-10" />
              <CardHeader>
                <Star className="h-9 w-9 text-primary mb-2" />
                <CardTitle className="text-base text-slate-700">
                  Reader Focused
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Built community-first, revenue-second. We prioritize your
                experience and listen to what you need to succeed.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
