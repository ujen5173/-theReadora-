import {
  Analytics01Icon,
  BookOpen01Icon,
  ChampionIcon,
  GlobalIcon,
  Idea01Icon,
  LockIcon,
  QuillWrite02Icon,
  RocketIcon,
  Search01Icon,
  SparklesIcon,
  Tick02Icon,
  UserMultipleIcon,
} from "hugeicons-react";
import Link from "next/link";
import Header from "~/app/_components/layouts/header";
import {
  CheckItem,
  ClosingCta,
  FeatureCard,
  IconChip,
  MetaPill,
  PageHero,
  PageShell,
  Section,
} from "~/components/shared/page-kit";
import { Button } from "~/components/ui/button";
import { generateSEOMetadata, siteConfig } from "~/utils/site";

export const metadata = generateSEOMetadata({
  title: "About Readora",
  description:
    "Readora is a serial fiction platform built so writers keep their rights and the larger share of what their work earns. Why it exists and what we commit to.",
  pathname: "/about",
  keywords: [
    "about readora",
    "serial fiction platform",
    "writing platform for authors",
    "keep your rights",
  ],
  type: "article",
});

const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Readora",
  url: `${siteConfig.url}/about`,
  mainEntity: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description:
      "A serial fiction platform where writers keep the rights to their work and the larger share of what it earns.",
  },
};

/** Qualitative facts — deliberately not invented metrics. */
const STAGE = [
  {
    icon: RocketIcon,
    label: "Stage",
    value: "Early",
    note: "Small team, working product, growing catalogue.",
  },
  {
    icon: GlobalIcon,
    label: "Built on",
    value: "Open web",
    note: "Every chapter is a real URL anyone can link to.",
  },
  {
    icon: SparklesIcon,
    label: "Exclusivity",
    value: "None",
    note: "Publish here and elsewhere at the same time.",
  },
  {
    icon: LockIcon,
    label: "Rights",
    value: "Yours",
    note: "A display licence. Nothing more.",
  },
];

const PRINCIPLES = [
  {
    icon: LockIcon,
    title: "The work stays yours",
    body: "Publishing here grants Readora a licence to display your story. It does not transfer copyright and it never becomes exclusive. Adapt it, sell it elsewhere, or take it down.",
  },
  {
    icon: ChampionIcon,
    title: "The larger share goes to the author",
    body: "Writers keep the majority of what their work earns. We'd rather run a thinner margin on a platform writers stay on than a fat one they leave.",
  },
  {
    icon: Search01Icon,
    title: "Placement is not for sale",
    body: "A story surfaces because readers finish it and come back — not because someone paid to sit at the top of a shelf. The day discovery becomes an ad product is the day it stops being useful.",
  },
  {
    icon: BookOpen01Icon,
    title: "Reading comes before engagement",
    body: "No infinite feed, no interruptions mid-chapter. The measure that matters is whether someone finished the chapter and wanted the next one.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: QuillWrite02Icon,
    title: "Publish on your schedule",
    body: "A story is a sequence of chapters released when you choose. Readers follow the story and get told when the next one lands — which is how serial fiction has always worked, and what a lot of platforms replaced with a recommendation engine.",
  },
  {
    icon: GlobalIcon,
    title: "Every chapter is a real page",
    body: "Linkable, shareable, and findable in a search engine. Work that can't be linked to can't be discovered, and a writer whose audience is trapped in someone else's app doesn't really have an audience.",
  },
  {
    icon: Analytics01Icon,
    title: "Numbers you can act on",
    body: "Drafts, scheduled chapters, per-chapter readership, where readers arrived from and where they stopped reading. Not a vanity dashboard — the numbers you need to decide what to write next.",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <Header removeBackground headerExtraStyle="border-b border-border" />

      <PageShell>
        <PageHero
          eyebrow="About Readora"
          eyebrowIcon={BookOpen01Icon}
          title={
            <>
              A platform that takes{" "}
              <span className="text-primary">the writer's side</span>
            </>
          }
          subtitle="Serial fiction built the internet's reading habit and got very little back for it. Readora is an attempt to fix the economics without ruining the reading."
        >
          <div className="gap-4 grid grid-cols-2 lg:grid-cols-4 mx-auto max-w-5xl text-left">
            {STAGE.map((item) => (
              <div
                key={item.label}
                className="bg-white p-5 border border-slate-200 rounded-2xl"
              >
                <IconChip icon={item.icon} className="mb-4 !p-2.5" />
                <span className="block font-semibold text-primary text-xs">
                  {item.label}
                </span>
                <span className="block mt-1 font-bold text-slate-700 text-xl">
                  {item.value}
                </span>
                <span className="block mt-1.5 text-slate-500 text-xs leading-relaxed">
                  {item.note}
                </span>
              </div>
            ))}
          </div>
        </PageHero>

        {/* ---------------------------------------------------------------- */}
        <Section
          label="Why this exists"
          title="Serial fiction is widely read and badly paid"
        >
          <div className="gap-10 grid lg:grid-cols-[1.2fr_1fr] items-start">
            <div className="space-y-5 max-w-2xl">
              <p className="font-medium text-slate-600 text-base sm:text-lg text-pretty leading-relaxed">
                Millions of chapters are published every year by writers who see
                almost none of the value they create — because the platforms
                they publish on were built to accumulate an audience, not to pay
                the people who brought it.
              </p>
              <p className="text-slate-500 text-pretty leading-relaxed">
                The pattern is familiar. A platform grows on writers who publish
                for free. Once the audience is large enough to matter, the terms
                change: exclusivity clauses, rights grabs, opaque payouts, and
                placement that quietly becomes an advertising product. The
                writing that built the place is the first thing monetised and the
                last thing paid.
              </p>
              <p className="text-slate-500 text-pretty leading-relaxed">
                Readora starts from the opposite assumption — that a fiction
                platform is a marketplace, and a marketplace that squeezes its
                suppliers eventually runs out of supply.
              </p>
            </div>

            <div className="bg-slate-900 p-7 sm:p-8 rounded-2xl text-white">
              <IconChip icon={Idea01Icon} tone="solid" className="mb-5" />
              <p className="font-semibold text-lg text-pretty leading-relaxed">
                A platform is only as good as the work writers are willing to put
                on it. Treat that as the scarce resource and most product
                decisions answer themselves.
              </p>
              <p className="mt-4 text-slate-400 text-sm">
                The premise everything else follows from
              </p>
            </div>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section
          label="What we commit to"
          title="Four constraints, written down on purpose"
          subtitle="These rule out business models we could otherwise run. That's the point of putting them in writing."
          tone="muted"
        >
          <div className="gap-5 grid grid-cols-1 md:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <FeatureCard
                key={principle.title}
                icon={principle.icon}
                title={principle.title}
              >
                {principle.body}
              </FeatureCard>
            ))}
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section label="How it works" title="What you actually get">
          <div className="gap-5 grid grid-cols-1 lg:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <FeatureCard key={item.title} icon={item.icon} title={item.title}>
                {item.body}
              </FeatureCard>
            ))}
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section
          label="Where we are"
          title="Honestly? Early."
          subtitle="You should know the shape of that before you spend six months publishing here."
          tone="muted"
        >
          <div className="gap-6 grid lg:grid-cols-2 items-start">
            <div className="bg-white p-6 sm:p-7 border border-slate-200 rounded-2xl">
              <h3 className="mb-4 font-semibold text-slate-700 text-lg">
                What works today
              </h3>
              <ul className="space-y-3">
                <CheckItem icon={Tick02Icon}>
                  Writers publish, readers read, and the payment and payout
                  mechanics run.
                </CheckItem>
                <CheckItem icon={Tick02Icon}>
                  Terms that don't get worse as we grow — they're constraints,
                  not launch promotions.
                </CheckItem>
                <CheckItem icon={Tick02Icon}>
                  A team you can actually reach, and real influence over what
                  gets built. Several features writers use daily exist because
                  one author asked.
                </CheckItem>
              </ul>
            </div>

            <div className="bg-white p-6 sm:p-7 border border-slate-200 rounded-2xl">
              <h3 className="mb-4 font-semibold text-slate-700 text-lg">
                What doesn't, yet
              </h3>
              <p className="mb-4 text-slate-500 text-pretty leading-relaxed">
                The audience is still small. A story published here today will
                find fewer readers than the same story on a platform with a
                decade's head start. We're not going to pretend otherwise to win
                a signup.
              </p>
              <p className="text-slate-500 text-pretty leading-relaxed">
                Because publishing here is non-exclusive, trying Readora costs
                you nothing but the upload. That asymmetry is deliberate.
              </p>
              <div className="mt-5">
                <Button asChild variant="secondary" size="sm">
                  <Link href="/comparision">See the full comparison</Link>
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <ClosingCta
          title="Start where it suits you"
          subtitle="Publish a chapter and keep every right to it, find a serial worth following, or come build the thing with us."
          footnote={
            <>
              Want the direct comparison with other platforms?{" "}
              <Link
                href="/comparision"
                className="text-slate-300 hover:text-primary underline underline-offset-4"
              >
                We put it in a table
              </Link>
              , including where we come off worse.
            </>
          }
        >
          <Button asChild size="lg" icon={QuillWrite02Icon}>
            <Link href="/write">Start writing</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" icon={BookOpen01Icon}>
            <Link href="/search">Browse stories</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" icon={UserMultipleIcon}>
            <Link href="/careers">See open roles</Link>
          </Button>
        </ClosingCta>
      </PageShell>
    </>
  );
}
