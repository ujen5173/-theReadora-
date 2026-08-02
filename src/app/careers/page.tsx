import {
  Analytics01Icon,
  ArrowRight01Icon,
  BrushIcon,
  ChartIncreaseIcon,
  CodeIcon,
  GlobalIcon,
  Idea01Icon,
  Mail01Icon,
  QuillWrite02Icon,
  RocketIcon,
  SparklesIcon,
  Target01Icon,
  Tick02Icon,
  UserMultipleIcon,
  ZapIcon,
} from "hugeicons-react";
import Link from "next/link";
import Header from "~/app/_components/layouts/header";
import {
  AnchorCard,
  CheckItem,
  ClosingCta,
  DisclosureCard,
  FeatureCard,
  IconChip,
  MetaPill,
  PageHero,
  PageShell,
  Section,
} from "~/components/shared/page-kit";
import { Button } from "~/components/ui/button";
import { generateSEOMetadata, siteConfig } from "~/utils/site";
import { HIRING_STEPS, PROGRAMMES, ROLES } from "./_data";

const APPLY_EMAIL = "careers@readora.com";

/** Role slug → icon. Kept here so `_data.ts` stays free of component imports. */
const ROLE_ICONS: Record<string, React.ElementType> = {
  "full-stack-engineer": CodeIcon,
  "product-designer": BrushIcon,
  "growth-marketing-lead": ChartIncreaseIcon,
  "product-manager": Target01Icon,
  "hr-intern": UserMultipleIcon,
};

const PROGRAMME_ICONS: Record<string, React.ElementType> = {
  "engineering-internship": RocketIcon,
  "writers-fellowship": QuillWrite02Icon,
  "design-fellowship": SparklesIcon,
};

const WORKING_HERE = [
  {
    icon: GlobalIcon,
    title: "Remote and genuinely async",
    body: "Written updates over standups. Two hours of overlap is plenty. Deep work is protected because the work needs it.",
  },
  {
    icon: ZapIcon,
    title: "Small team, wide surface",
    body: "There are more good ideas here than people to build them. You own whole areas rather than slices, and nothing is someone else's problem.",
  },
  {
    icon: Analytics01Icon,
    title: "Ship, then watch",
    body: "Features go out in small releases and get measured. We'd rather learn in a week than plan for a quarter.",
  },
  {
    icon: Idea01Icon,
    title: "Honest about the stage",
    body: "Readora is early. Traffic is modest, the budget is small, the roadmap moves. We say so in interviews, and we're saying it here.",
  },
];

export const metadata = generateSEOMetadata({
  title: "Careers",
  description:
    "Join the team building Readora. Open roles in engineering, design, marketing, product and people — plus paid internships and the Readora Writers' Fellowship.",
  pathname: "/careers",
  keywords: [
    "readora careers",
    "remote startup jobs",
    "full stack engineer job",
    "product designer job",
    "writing fellowship",
  ],
  type: "website",
});

/** JobPosting markup so open roles can surface in Google Jobs. */
const jobPostingSchema = {
  "@context": "https://schema.org",
  "@graph": ROLES.map((role) => ({
    "@type": "JobPosting",
    title: role.title,
    description: `${role.summary} ${role.responsibilities.join(" ")}`,
    employmentType: role.type.toLowerCase().includes("intern")
      ? "INTERN"
      : "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: siteConfig.url,
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: { "@type": "Country", name: "Worldwide" },
    directApply: true,
    url: `${siteConfig.url}/careers#${role.slug}`,
  })),
};

const applyHref = (subject: string) =>
  `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(subject)}`;

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />

      <Header removeBackground headerExtraStyle="border-b border-border" />

      <PageShell>
        <PageHero
          eyebrow="We're hiring"
          eyebrowIcon={SparklesIcon}
          title={
            <>
              Help build the platform{" "}
              <span className="text-primary">writers actually own</span>
            </>
          }
          subtitle={
            <>
              We're building a place where serial fiction pays its{" "}
              <span className="font-semibold text-primary underline">
                writers
              </span>{" "}
              properly and{" "}
              <span className="font-semibold text-primary underline">
                readers
              </span>{" "}
              can find what's good. It's early, the team is small, and the work
              is unusually visible.
            </>
          }
        >
          <div className="flex sm:flex-row flex-col justify-center gap-3 mb-12">
            <Button asChild size="lg" icon={ArrowRight01Icon} iconPlacement="right">
              <Link href="#roles">See {ROLES.length} open roles</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" icon={QuillWrite02Icon}>
              <Link href="#programmes">Internships & fellowships</Link>
            </Button>
          </div>

          {/* Quick index — cards, matching how the app indexes things elsewhere. */}
          {/* Five columns so all five roles sit on one row — no orphan card. */}
          <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mx-auto max-w-6xl text-left">
            {ROLES.map((role) => (
              <AnchorCard
                key={role.slug}
                href={`#${role.slug}`}
                icon={ROLE_ICONS[role.slug] ?? CodeIcon}
                title={role.title}
                meta={`${role.team} · ${role.type}`}
              />
            ))}
          </div>
        </PageHero>

        {/* ---------------------------------------------------------------- */}
        <Section
          label="Why this team"
          title="A small team with an unusually clear rule"
          subtitle="If a decision is good for the platform and bad for the writer, it's not a good decision — it's a loan against the thing that makes the platform work. That constraint shapes the roadmap, and it's most of what makes the job interesting."
        >
          <div className="gap-5 grid grid-cols-1 md:grid-cols-2">
            {WORKING_HERE.map((item) => (
              <FeatureCard key={item.title} icon={item.icon} title={item.title}>
                {item.body}
              </FeatureCard>
            ))}
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section
          id="roles"
          label="Open roles"
          title={`${ROLES.length} roles, open now`}
          subtitle="Every role is remote. If you're close but not exact, apply anyway and tell us which part you'd need to grow into."
          tone="muted"
        >
          <div className="space-y-4">
            {ROLES.map((role) => (
              <DisclosureCard
                key={role.slug}
                id={role.slug}
                icon={ROLE_ICONS[role.slug] ?? CodeIcon}
                title={role.title}
                meta={
                  <>
                    <MetaPill>{role.team}</MetaPill>
                    <MetaPill>{role.type}</MetaPill>
                    <MetaPill>{role.location}</MetaPill>
                  </>
                }
              >
                <div className="gap-8 grid lg:grid-cols-[1fr_18rem]">
                  <div className="space-y-7 max-w-2xl">
                    <p className="font-medium text-slate-600 text-base text-pretty leading-relaxed">
                      {role.summary}
                    </p>

                    <div>
                      <h4 className="mb-3 font-semibold text-slate-700 text-sm">
                        What you'll do
                      </h4>
                      <ul className="space-y-2.5">
                        {role.responsibilities.map((item) => (
                          <CheckItem key={item} icon={Tick02Icon}>
                            {item}
                          </CheckItem>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="mb-3 font-semibold text-slate-700 text-sm">
                        What we need
                      </h4>
                      <ul className="space-y-2.5">
                        {role.requirements.map((item) => (
                          <CheckItem key={item} icon={Tick02Icon}>
                            {item}
                          </CheckItem>
                        ))}
                      </ul>
                    </div>

                    {role.bonus && (
                      <div>
                        <h4 className="mb-3 font-semibold text-slate-700 text-sm">
                          Nice, but not required
                        </h4>
                        <ul className="space-y-2.5">
                          {role.bonus.map((item) => (
                            <CheckItem key={item} icon={SparklesIcon}>
                              {item}
                            </CheckItem>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* The caveat gets the same weight as the pitch. */}
                  <aside className="lg:top-24 lg:sticky bg-slate-900 p-6 rounded-2xl h-fit text-white">
                    <div className="flex items-center gap-2 mb-3">
                      <Idea01Icon className="size-4" />
                      <span className="font-semibold text-sm">
                        The honest part
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm text-pretty leading-relaxed">
                      {role.reality}
                    </p>
                    <Button
                      asChild
                      variant="secondary"
                      className="mt-6 w-full"
                      icon={Mail01Icon}
                    >
                      <a href={applyHref(`${role.title} — application`)}>
                        Apply for this role
                      </a>
                    </Button>
                  </aside>
                </div>
              </DisclosureCard>
            ))}
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section
          id="programmes"
          label="Programmes"
          title="Internships and fellowships"
          subtitle="Three routes in for people earlier in their career, or writers who want six months of support to finish something long. All paid."
        >
          <div className="gap-5 grid grid-cols-1 lg:grid-cols-3">
            {PROGRAMMES.map((programme) => (
              <article
                key={programme.slug}
                id={programme.slug}
                className="group flex flex-col bg-white hover:shadow-primary/5 hover:shadow-xl p-6 sm:p-7 border border-slate-200 hover:border-primary/30 rounded-2xl scroll-mt-24 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-5">
                  <IconChip
                    icon={PROGRAMME_ICONS[programme.slug] ?? RocketIcon}
                    className="group-hover:bg-primary/20"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-700 text-lg leading-snug">
                      {programme.title}
                    </h3>
                    <span className="block mt-1.5">
                      <MetaPill>{programme.duration}</MetaPill>
                    </span>
                  </div>
                </div>

                <p className="mb-4 font-medium text-slate-600 text-pretty leading-relaxed">
                  {programme.summary}
                </p>
                <p className="mb-6 text-slate-500 text-sm text-pretty leading-relaxed">
                  {programme.detail}
                </p>

                <ul className="space-y-2.5 mt-auto pt-6 border-slate-200 border-t">
                  {programme.points.map((point) => (
                    <CheckItem key={point} icon={Tick02Icon}>
                      <span className="text-sm">{point}</span>
                    </CheckItem>
                  ))}
                </ul>

                <Button asChild variant="secondary" className="mt-6 w-full">
                  <a href={applyHref(`${programme.title} — application`)}>
                    Apply
                  </a>
                </Button>
              </article>
            ))}
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <Section
          label="Process"
          title="How hiring works"
          subtitle="Five steps, about two weeks end to end. The exercise is paid, and we never ask for speculative work we'd actually ship."
          tone="muted"
        >
          <ol className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {HIRING_STEPS.map((step) => (
              <li
                key={step.step}
                className="flex flex-col bg-white p-6 border border-slate-200 rounded-2xl"
              >
                <span className="font-bold text-primary/25 text-3xl">
                  {step.step}
                </span>
                <h3 className="mt-3 font-semibold text-slate-700">
                  {step.title}
                </h3>
                <p className="flex-1 mt-2 text-slate-500 text-sm text-pretty leading-relaxed">
                  {step.body}
                </p>
                <span className="mt-5">
                  <MetaPill>{step.time}</MetaPill>
                </span>
              </li>
            ))}
          </ol>
        </Section>

        {/* ---------------------------------------------------------------- */}
        <ClosingCta
          title="No form. Just an email."
          subtitle="Send a CV, portfolio or repository, and a few lines on which role you want and why. If none of these fit but you think we're missing something, write anyway and tell us what."
          footnote={
            <>
              Readora hires without regard to race, religion, gender identity,
              sexual orientation, disability, age or nationality. Need an
              adjustment to any part of this process? Say so in your first email
              — it has no bearing on the outcome. Curious what you'd be joining?{" "}
              <Link
                href="/about"
                className="text-slate-300 hover:text-primary underline underline-offset-4"
              >
                Read why Readora exists
              </Link>
              .
            </>
          }
        >
          <Button asChild size="lg" icon={Mail01Icon}>
            <a href={applyHref("Application — Readora")}>{APPLY_EMAIL}</a>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="#roles">Browse roles again</Link>
          </Button>
        </ClosingCta>
      </PageShell>
    </>
  );
}
