import {
  Agreement01Icon,
  AlertCircleIcon,
  BookOpen01Icon,
  Cancel01Icon,
  Idea01Icon,
  Mail01Icon,
  Message01Icon,
  Shield01Icon,
  SparklesIcon,
  Tick02Icon,
  UserMultipleIcon,
} from "hugeicons-react";
import Link from "next/link";
import Header from "~/app/_components/layouts/header";
import {
  AnchorCard,
  ClosingCta,
  IconChip,
  MetaPill,
  PageHero,
  PageShell,
  Section,
} from "~/components/shared/page-kit";
import { Button } from "~/components/ui/button";
import { generateSEOMetadata, siteConfig } from "~/utils/site";
import { ENFORCEMENT, GUIDELINE_GROUPS } from "./_data";

const LAST_UPDATED = "2 August 2026";
const CONTACT_EMAIL = "support@readora.com";

const GROUP_ICONS: Record<string, React.ElementType> = {
  "what-you-write": BookOpen01Icon,
  ratings: AlertCircleIcon,
  ownership: Agreement01Icon,
  conduct: UserMultipleIcon,
};

export const metadata = generateSEOMetadata({
  title: "Community Guidelines",
  description:
    "What you can publish on Readora, how content ratings work, what happens when a rule is broken, and how to appeal. Written to be read, not survived.",
  pathname: "/guidelines",
  keywords: [
    "readora community guidelines",
    "content policy",
    "fiction platform rules",
    "content rating",
  ],
  type: "article",
});

const guidelinesSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Readora Community Guidelines",
  description:
    "Content policy, rating rules, enforcement process and appeals for Readora.",
  url: `${siteConfig.url}/guidelines`,
  dateModified: "2026-08-02",
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
};

export default function GuidelinesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guidelinesSchema) }}
      />

      <Header removeBackground headerExtraStyle="border-b border-border" />

      <PageShell>
        <PageHero
          eyebrow={`Updated ${LAST_UPDATED}`}
          eyebrowIcon={Shield01Icon}
          title={
            <>
              The rules, in language{" "}
              <span className="text-primary">you can actually use</span>
            </>
          }
          subtitle="Fiction is allowed to be dark here. What follows is about harm to real people — not about protecting readers from difficult stories. Every clause is numbered so a moderation notice can point at exactly the one that applies."
        >
          <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mx-auto max-w-5xl text-left">
            {GUIDELINE_GROUPS.map((group) => (
              <AnchorCard
                key={group.id}
                href={`#${group.id}`}
                icon={GROUP_ICONS[group.id] ?? BookOpen01Icon}
                title={group.title}
                meta={`${group.folio} · ${group.clauses.length} clauses`}
              />
            ))}
          </div>
        </PageHero>

        {/* ---------------------------------------------------------------- */}
        <Section label="How to read this" title="Two things worth knowing first">
          <div className="gap-10 grid lg:grid-cols-[1.2fr_1fr] items-start">
            <div className="space-y-5 max-w-2xl">
              <p className="font-medium text-slate-600 text-base sm:text-lg text-pretty leading-relaxed">
                Most platform guidelines are written by lawyers to be defensible
                rather than useful, which is why nobody reads them and everybody
                is surprised when something gets removed. These are written to be
                read once and remembered.
              </p>
              <p className="text-slate-500 text-pretty leading-relaxed">
                First, depicting something is not endorsing it — a story can
                contain terrible people doing terrible things and be entirely
                within these rules. Second, almost everything here is
                recoverable: the enforcement ladder starts with a note and time
                to fix it, not a deletion.
              </p>
              <p className="text-slate-500 text-pretty leading-relaxed">
                Two categories are exceptions to that patience, and they're
                stated plainly in clauses 1.2 and 1.4.
              </p>
            </div>

            <div className="bg-slate-900 p-7 sm:p-8 rounded-2xl text-white">
              <IconChip icon={Idea01Icon} tone="solid" className="mb-5" />
              <p className="font-semibold text-lg text-pretty leading-relaxed">
                Write what you need to write. Rate it honestly. Don't aim it at a
                real person.
              </p>
              <p className="mt-4 text-slate-400 text-sm">
                The principle underneath all of it
              </p>
            </div>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {GUIDELINE_GROUPS.map((group, groupIndex) => (
          <Section
            key={group.id}
            id={group.id}
            label={group.folio}
            title={group.title}
            subtitle={group.intro}
            tone={groupIndex % 2 === 0 ? "muted" : "light"}
          >
            <div className="space-y-4">
              {group.clauses.map((clause) => (
                <article
                  key={clause.id}
                  id={clause.id}
                  className="bg-white p-6 sm:p-7 border border-slate-200 rounded-2xl scroll-mt-24"
                >
                  <div className="flex items-start gap-4">
                    <span className="grid place-items-center bg-primary/10 rounded-lg size-9 font-bold text-primary text-xs shrink-0">
                      {clause.number}
                    </span>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-700 text-lg leading-snug">
                        {clause.title}
                      </h3>
                      <p className="mt-2 max-w-2xl text-slate-500 text-pretty leading-relaxed">
                        {clause.body}
                      </p>
                    </div>
                  </div>

                  {clause.examples && (
                    <div className="gap-4 grid sm:grid-cols-2 mt-6 sm:ml-13">
                      {clause.examples.allowed && (
                        <div className="bg-slate-50 p-5 border border-slate-200 rounded-xl">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="grid place-items-center bg-slate-200 rounded-full size-5 text-slate-600">
                              <Tick02Icon className="size-3" />
                            </span>
                            <span className="font-semibold text-slate-600 text-sm">
                              Allowed
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {clause.examples.allowed.map((item) => (
                              <li
                                key={item}
                                className="text-slate-500 text-sm text-pretty leading-relaxed"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {clause.examples.notAllowed && (
                        <div className="bg-primary/5 p-5 border border-primary/20 rounded-xl">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="grid place-items-center bg-primary/15 rounded-full size-5 text-primary">
                              <Cancel01Icon className="size-3" />
                            </span>
                            <span className="font-semibold text-primary text-sm">
                              Not allowed
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {clause.examples.notAllowed.map((item) => (
                              <li
                                key={item}
                                className="text-slate-600 text-sm text-pretty leading-relaxed"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </Section>
        ))}

        {/* ---------------------------------------------------------------- */}
        <Section
          id="enforcement"
          label="§ 5"
          title="What happens when a rule is broken"
          subtitle="Four steps. Most issues stop at the first one, and you'll always be told which clause applies and why."
        >
          <ol className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {ENFORCEMENT.map((stage) => (
              <li
                key={stage.step}
                className="flex flex-col bg-white p-6 border border-slate-200 rounded-2xl"
              >
                <span className="font-bold text-primary/25 text-3xl">
                  {stage.step}
                </span>
                <h3 className="mt-3 font-semibold text-slate-700">
                  {stage.title}
                </h3>
                <p className="mt-2 text-slate-500 text-sm text-pretty leading-relaxed">
                  {stage.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="gap-5 grid md:grid-cols-2 mt-6">
            <div className="bg-white p-6 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-4">
                <IconChip icon={Message01Icon} />
                <div>
                  <h3 className="mb-2 font-semibold text-slate-700 text-lg">
                    Reporting something
                  </h3>
                  <p className="text-slate-500 text-pretty leading-relaxed">
                    Every story and comment has a report control. Tell us which
                    clause you think applies — reports that cite one get resolved
                    considerably faster than reports that say "this is bad".
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-2xl">
              <div className="flex items-start gap-4">
                <IconChip icon={Agreement01Icon} />
                <div>
                  <h3 className="mb-2 font-semibold text-slate-700 text-lg">
                    Appealing a decision
                  </h3>
                  <p className="text-slate-500 text-pretty leading-relaxed">
                    Reply to the moderation message you received, or email{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="font-medium text-primary underline underline-offset-4"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    . A person reads every appeal. We aim to answer within three
                    working days, and we do overturn decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <ClosingCta
          title="These will change"
          subtitle="Guidelines written before a platform has many users are guesses. As real situations arrive that these clauses handle badly, we'll revise them and say what changed rather than quietly editing the page. Clause numbers stay stable — new rules go at the end of a section, so a notice citing 3.2 still means 3.2 a year from now."
          footnote={
            <>
              Last updated {LAST_UPDATED}. Questions about a specific clause go to{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-slate-300 hover:text-primary underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </>
          }
        >
          <Button asChild size="lg" variant="secondary">
            <Link href="/terms-of-use">Terms of use</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/privacy-policy">Privacy policy</Link>
          </Button>
          <Button asChild size="lg" icon={Mail01Icon}>
            <a href={`mailto:${CONTACT_EMAIL}`}>Contact support</a>
          </Button>
        </ClosingCta>
      </PageShell>
    </>
  );
}
