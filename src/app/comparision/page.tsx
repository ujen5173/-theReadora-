import {
  Cancel01Icon,
  GlobalIcon,
  Idea01Icon,
  LockIcon,
  MinusSignIcon,
  QuillWrite02Icon,
  SparklesIcon,
  Tick02Icon,
  ZapIcon,
} from "hugeicons-react";
import Link from "next/link";
import Header from "~/app/_components/layouts/header";
import {
  ClosingCta,
  DisclosureCard,
  FeatureCard,
  IconChip,
  PageHero,
  PageShell,
  Section,
} from "~/components/shared/page-kit";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { generateSEOMetadata, siteConfig } from "~/utils/site";

export const metadata = generateSEOMetadata({
  title: "Readora vs Wattpad, Webnovel and Royal Road",
  description:
    "An honest comparison of serial fiction platforms on rights, revenue share, exclusivity, discovery and audience size — including where Readora comes off worse.",
  pathname: "/comparision",
  keywords: [
    "wattpad alternative",
    "webnovel alternative",
    "royal road alternative",
    "best platform to publish serial fiction",
    "writing platform comparison",
  ],
  type: "article",
});

type Support = "yes" | "no" | "partial";

const PLATFORMS = ["Readora", "Wattpad", "Webnovel", "Royal Road"] as const;

type Row = {
  criterion: string;
  detail: string;
  values: Record<(typeof PLATFORMS)[number], Support>;
};

/**
 * Structural comparisons only. Rates and audience figures move constantly and
 * would date this page badly, so they're discussed in prose instead.
 */
const ROWS: Row[] = [
  {
    criterion: "Author keeps copyright",
    detail: "Publishing does not transfer ownership of the work.",
    values: { Readora: "yes", Wattpad: "yes", Webnovel: "partial", "Royal Road": "yes" },
  },
  {
    criterion: "Non-exclusive by default",
    detail: "You can publish the same story elsewhere at the same time.",
    values: { Readora: "yes", Wattpad: "yes", Webnovel: "no", "Royal Road": "yes" },
  },
  {
    criterion: "Direct per-chapter earnings",
    detail: "Readers can pay for a chapter and the author is paid for it.",
    values: { Readora: "yes", Wattpad: "partial", Webnovel: "yes", "Royal Road": "no" },
  },
  {
    criterion: "Earn without an invite or contract",
    detail: "Monetisation is open to any author, not a selected programme.",
    values: { Readora: "yes", Wattpad: "no", Webnovel: "no", "Royal Road": "no" },
  },
  {
    criterion: "Chapters are public web pages",
    detail: "Every chapter has a URL search engines and readers can reach.",
    values: { Readora: "yes", Wattpad: "yes", Webnovel: "partial", "Royal Road": "yes" },
  },
  {
    criterion: "Per-chapter analytics for authors",
    detail: "Where readers arrived from, and where they stopped reading.",
    values: { Readora: "yes", Wattpad: "partial", Webnovel: "partial", "Royal Road": "partial" },
  },
  {
    criterion: "Scheduled publishing",
    detail: "Queue chapters in advance and release them on a schedule.",
    values: { Readora: "yes", Wattpad: "no", Webnovel: "yes", "Royal Road": "yes" },
  },
  {
    criterion: "Large existing audience",
    detail: "A back catalogue of readers already browsing daily.",
    values: { Readora: "no", Wattpad: "yes", Webnovel: "yes", "Royal Road": "yes" },
  },
  {
    criterion: "Established community features",
    detail: "Mature forums, clubs and reader-to-reader discovery.",
    values: { Readora: "partial", Wattpad: "yes", Webnovel: "yes", "Royal Road": "yes" },
  },
  {
    criterion: "Mobile apps",
    detail: "Native iOS and Android reading applications.",
    values: { Readora: "no", Wattpad: "yes", Webnovel: "yes", "Royal Road": "no" },
  },
];

/**
 * Marks are monochrome on purpose. Using the brand crimson for "yes" meant rows
 * like "Large existing audience" rendered competitors in Readora's own colour —
 * the brand ended up celebrating rivals. Colour now marks whose column it is,
 * and the glyph carries the meaning, so nothing depends on colour alone.
 */
const SUPPORT_META: Record<
  Support,
  { icon: typeof Tick02Icon; label: string; className: string }
> = {
  yes: { icon: Tick02Icon, label: "Yes", className: "text-slate-700" },
  partial: { icon: MinusSignIcon, label: "Partial", className: "text-slate-400" },
  no: { icon: Cancel01Icon, label: "No", className: "text-slate-400" },
};

const SupportCell = ({ value }: { value: Support }) => {
  const meta = SUPPORT_META[value];
  const Icon = meta.icon;
  return (
    <span className="flex justify-center">
      <Icon
        className={cn("size-[1.15rem]", meta.className)}
        strokeWidth={value === "yes" ? 2.5 : 1.8}
      />
      <span className="sr-only">{meta.label}</span>
    </span>
  );
};

/** Where Readora genuinely loses today. */
const TRADEOFFS = [
  {
    title: "They have the readers. We don't, yet.",
    body: "This is the real trade-off and no feature list changes it. A story posted to Wattpad today will be seen by more people than the same story posted here. If raw reach this month is what matters, publish there — and, because we're non-exclusive, publish here too.",
  },
  {
    title: "No mobile apps",
    body: "Readora is a web product. It's built to work well in a phone browser, and every chapter is readable and linkable there, but there's no App Store download and no offline library yet.",
  },
  {
    title: "A younger community",
    body: "The forums, clubs and reader-to-reader culture that make the older platforms sticky took years to form. Ours is early. If community is the main reason you publish, that's a fair reason to wait.",
  },
  {
    title: "Fewer readers means slower feedback",
    body: "Serial writers live on comments. Early chapters here get fewer of them, which is a genuine cost when you're trying to work out whether a story is landing.",
  },
];

const QUESTIONS = [
  {
    icon: LockIcon,
    title: "Who owns it afterwards?",
    body: "Read the licence, not the marketing. The question is whether the platform can keep using, adapting or sub-licensing your story after you leave, and whether you can publish it elsewhere while it's live. On Readora the licence is display-only, non-exclusive, and ends when you delete the work.",
  },
  {
    icon: ZapIcon,
    title: "Who is allowed to earn?",
    body: "On most platforms monetisation is a programme you apply to, with thresholds and selection. That makes earnings a function of being picked. Here, per-chapter pricing is available to any author from the first chapter — the reader decides, not a committee.",
  },
  {
    icon: GlobalIcon,
    title: "Can readers find you from outside?",
    body: "If chapters only exist inside an app, your audience belongs to the app. Public chapter pages mean a reader can find your story from a search engine, link it to a friend, and come back without an install. That's the difference between having readers and borrowing them.",
  },
];

const comparisonSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Readora vs Wattpad, Webnovel and Royal Road",
  description:
    "A structural comparison of serial fiction platforms on rights, exclusivity, monetisation, discovery and audience.",
  url: `${siteConfig.url}/comparision`,
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
};

export default function ComparisionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
      />

      <Header removeBackground headerExtraStyle="border-b border-border" />

      <PageShell>
        <PageHero
          eyebrow="Platform comparison"
          eyebrowIcon={SparklesIcon}
          title={
            <>
              How Readora compares —{" "}
              <span className="text-primary">including where we lose</span>
            </>
          }
          subtitle="Most comparison pages are written to win. This one lists four things the older platforms genuinely do better, because you'll find out anyway and we'd rather you heard it here."
        >
          <div className="flex sm:flex-row flex-col justify-center gap-3">
            <Button asChild size="lg">
              <Link href="#table">See the table</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#tradeoffs">Where we come off worse</Link>
            </Button>
          </div>
        </PageHero>

        {/* ---------------------------------------------------------------- */}
        <Section label="The short version" title="Reach today, or terms over time">
          <div className="gap-10 grid lg:grid-cols-[1.2fr_1fr] items-start">
            <div className="space-y-5 max-w-2xl">
              <p className="font-medium text-slate-600 text-base sm:text-lg text-pretty leading-relaxed">
                Choosing where to publish a serial comes down to a single
                trade-off. The established platforms have the readers. What they
                ask for in return — some combination of exclusivity, rights, or a
                gated monetisation programme — is the part worth reading
                carefully.
              </p>
              <p className="text-slate-500 text-pretty leading-relaxed">
                Readora is on the other side of that trade. Smaller audience,
                better terms: you keep copyright, nothing is exclusive, and
                earning doesn't require an invitation or a contract. Whether
                that's the right trade depends entirely on where you are in your
                writing.
              </p>
            </div>

            <div className="bg-slate-900 p-7 sm:p-8 rounded-2xl text-white">
              <IconChip icon={Idea01Icon} tone="solid" className="mb-5" />
              <p className="font-semibold text-lg text-pretty leading-relaxed">
                If you have an audience already, publish everywhere — it costs
                you nothing here. If you're starting out, publish where you'll be
                read, and keep your rights while you do it.
              </p>
              <p className="mt-4 text-slate-400 text-sm">
                The honest recommendation
              </p>
            </div>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section
          id="table"
          label="The table"
          title="Feature by feature"
          subtitle="Structural differences only. Revenue percentages and audience numbers move constantly, so they're discussed in prose rather than frozen into a table that would be wrong within a month."
          tone="muted"
        >
          {/* Mobile: one card per criterion. A ten-column table squeezed into a
              360px scroll window is unreadable, and most readers are on a
              phone — so below md the same data is stacked instead. */}
          <div className="space-y-3 md:hidden">
            {ROWS.map((row) => (
              <div
                key={row.criterion}
                className="bg-white p-4 border border-slate-200 rounded-2xl"
              >
                <h3 className="font-semibold text-slate-700 text-sm">
                  {row.criterion}
                </h3>
                <p className="mt-1 text-slate-400 text-xs leading-relaxed">
                  {row.detail}
                </p>

                <dl className="gap-2 grid grid-cols-2 mt-4">
                  {PLATFORMS.map((platform) => (
                    <div
                      key={platform}
                      className={cn(
                        "flex justify-between items-center px-3 py-2 border rounded-lg",
                        platform === "Readora"
                          ? "bg-primary/5 border-primary/20"
                          : "bg-slate-50 border-slate-200",
                      )}
                    >
                      <dt
                        className={cn(
                          "font-medium text-xs",
                          platform === "Readora"
                            ? "text-primary"
                            : "text-slate-500",
                        )}
                      >
                        {platform}
                      </dt>
                      <dd>
                        <SupportCell value={row.values[platform]} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-white p-2 sm:p-4 border border-slate-200 rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] text-left border-collapse">
                <caption className="sr-only">
                  Comparison of Readora, Wattpad, Webnovel and Royal Road across
                  ten criteria.
                </caption>
                <thead>
                  <tr className="border-slate-200 border-b">
                    <th scope="col" className="py-4 pr-6 pl-3">
                      <span className="font-semibold text-slate-400 text-xs uppercase tracking-wider">
                        Criterion
                      </span>
                    </th>
                    {PLATFORMS.map((platform) => (
                      <th
                        key={platform}
                        scope="col"
                        className={cn(
                          "px-3 py-4 text-center",
                          platform === "Readora" && "bg-primary/5 rounded-t-xl",
                        )}
                      >
                        <span
                          className={cn(
                            "block font-bold text-base",
                            platform === "Readora"
                              ? "text-primary"
                              : "text-slate-600",
                          )}
                        >
                          {platform}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {ROWS.map((row, i) => (
                    <tr
                      key={row.criterion}
                      className={cn(
                        "align-top",
                        i !== ROWS.length - 1 && "border-slate-100 border-b",
                      )}
                    >
                      <th scope="row" className="py-5 pr-6 pl-3 font-normal">
                        <span className="block font-semibold text-slate-700 text-sm">
                          {row.criterion}
                        </span>
                        <span className="block mt-1 max-w-sm text-slate-400 text-xs leading-relaxed">
                          {row.detail}
                        </span>
                      </th>

                      {PLATFORMS.map((platform) => (
                        <td
                          key={platform}
                          className={cn(
                            "px-3 py-5",
                            platform === "Readora" && "bg-primary/5",
                            platform === "Readora" &&
                              i === ROWS.length - 1 &&
                              "rounded-b-xl",
                          )}
                        >
                          <SupportCell value={row.values[platform]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-5 text-slate-400 text-xs leading-relaxed">
            Comparisons reflect each platform's standard terms for a new author
            at the time of writing, not negotiated or invite-only arrangements.
            Platforms change their terms — check theirs before you commit.
          </p>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section
          id="tradeoffs"
          label="Trade-offs"
          title="Where the others are better"
          subtitle="Four honest ones. If any of these is the deciding factor for you, we'd rather you knew now than found out three chapters in."
        >
          <div className="space-y-4">
            {TRADEOFFS.map((tradeoff) => (
              <DisclosureCard key={tradeoff.title} title={tradeoff.title}>
                <p className="max-w-2xl text-slate-500 text-pretty leading-relaxed">
                  {tradeoff.body}
                </p>
              </DisclosureCard>
            ))}
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section
          label="What to actually ask"
          title="The three questions that matter"
          tone="muted"
        >
          <div className="gap-5 grid grid-cols-1 lg:grid-cols-3">
            {QUESTIONS.map((question) => (
              <FeatureCard
                key={question.title}
                icon={question.icon}
                title={question.title}
              >
                {question.body}
              </FeatureCard>
            ))}
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <ClosingCta
          title="Try it without giving anything up"
          subtitle="Publishing here is non-exclusive, so this isn't a choice between platforms. Post a story you already have, keep it wherever else it lives, and see how it does."
        >
          <Button asChild size="lg" icon={QuillWrite02Icon}>
            <Link href="/write">Publish a story</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/about">Why we built it this way</Link>
          </Button>
        </ClosingCta>
      </PageShell>
    </>
  );
}
