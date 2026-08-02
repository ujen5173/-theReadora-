/**
 * Open roles and programmes.
 *
 * Kept as data rather than markup so the page, the contents index, the sitemap
 * and the JobPosting structured data all read from one source.
 */

export type Role = {
  slug: string;
  folio: string;
  title: string;
  team: string;
  type: string;
  location: string;
  summary: string;
  /** What the person actually does, week to week. */
  responsibilities: string[];
  /** Hard requirements. Kept short on purpose — long lists deter good applicants. */
  requirements: string[];
  /** Genuinely optional. */
  bonus?: string[];
  /** The honest version of what makes this role hard. */
  reality: string;
};

export const ROLES: Role[] = [
  {
    slug: "full-stack-engineer",
    folio: "Ch. 01",
    title: "Full-Stack Engineer",
    team: "Engineering",
    type: "Full-time",
    location: "Remote",
    summary:
      "Own features end to end on the stack Readora actually runs on: Next.js App Router, TypeScript, tRPC, Prisma and Postgres, with MongoDB behind chapter content.",
    responsibilities: [
      "Ship reader- and writer-facing features from schema to interface — the editor, the chapter reader, the studio dashboard.",
      "Design tRPC procedures and Prisma queries that stay fast as the catalogue grows, and keep an eye on the ones that don't.",
      "Work on the parts readers feel: server-rendered chapter pages, time to first paint, and the reliability of publishing.",
      "Extend the coin, subscription and payout flows without breaking anyone's earnings.",
      "Review pull requests properly. On a team this size, review is the main defence.",
    ],
    requirements: [
      "Two or more years building production React, with real App Router experience — server and client components, streaming, caching.",
      "Comfortable in TypeScript at strict settings, including the parts that are genuinely awkward.",
      "SQL and an ORM in production. You can read a query plan and explain why something is slow.",
      "You have shipped, operated and debugged something real that other people depended on.",
    ],
    bonus: [
      "Worked with tRPC, Tailwind, or a rich-text editor built on ProseMirror or Tiptap.",
      "Experience with Stripe billing or a payouts system.",
      "You read serial fiction. It shows in the product decisions.",
    ],
    reality:
      "Readora is small. You will not have a platform team, a dedicated QA pass, or an on-call rotation to hide behind. You will occasionally fix something you did not build, on a Sunday, because a writer cannot publish. In exchange you get an unusual amount of say in what gets built.",
  },
  {
    slug: "product-designer",
    folio: "Ch. 02",
    title: "Product Designer (UI/UX)",
    team: "Design",
    type: "Full-time",
    location: "Remote",
    summary:
      "Shape how it feels to read a chapter at midnight and to publish one at 6am. Reading is the product; the interface should get out of its way.",
    responsibilities: [
      "Own the reading experience end to end — typography, pacing, controls, and the long tail of states nobody screenshots.",
      "Design the writing side: the editor, chapter scheduling, and the studio where authors watch their work land.",
      "Build and maintain the design system alongside engineering, in the components that actually ship.",
      "Run small, cheap research — five writers on a call beats a survey of five hundred.",
      "Design the empty, error and first-run states with the same care as the happy path.",
    ],
    requirements: [
      "A portfolio with at least one product you took from problem to shipped interface, with your reasoning visible.",
      "Strong typographic judgement. This is a reading product; type is not decoration here.",
      "You design in real constraints — components, breakpoints, states — not just artboards.",
      "You can defend a decision and abandon it when the evidence says so.",
    ],
    bonus: [
      "You can prototype in code, even roughly.",
      "You have designed for long-form reading or publishing tools before.",
    ],
    reality:
      "There is no design team yet. You are it, which means you set the bar and also do the unglamorous parts — auditing spacing, naming tokens, redrawing the same card six times.",
  },
  {
    slug: "growth-marketing-lead",
    folio: "Ch. 03",
    title: "Growth Marketing Lead",
    team: "Marketing",
    type: "Full-time",
    location: "Remote",
    summary:
      "Readora has a discovery problem, not a quality problem. Your job is to get the right readers to stories that already deserve them.",
    responsibilities: [
      "Own organic growth: search, the content surface, and the long tail of story and chapter queries that bring readers in.",
      "Build the writer acquisition loop — writers bring readers, readers become writers. Find where it leaks.",
      "Run the channels where fiction readers actually are, and stop running the ones that don't work.",
      "Turn the analytics already in the product into decisions, not dashboards.",
      "Write. Launch notes, author spotlights, and contest copy all need a voice.",
    ],
    requirements: [
      "You have grown a consumer product's audience and can show what you did and what it moved.",
      "Working knowledge of technical SEO — enough to argue with an engineer productively.",
      "Comfortable with analytics and cohort thinking; you know the difference between a spike and a habit.",
      "You write well enough that it does not need rewriting.",
    ],
    bonus: [
      "You understand fiction communities from the inside — fanfic, serials, writing forums.",
      "You have run a creator or community programme.",
    ],
    reality:
      "Traffic today is modest and the budget is small. This is an early-stage growth job: mostly finding what works, not scaling what already does.",
  },
  {
    slug: "product-manager",
    folio: "Ch. 04",
    title: "Product Manager",
    team: "Product",
    type: "Full-time",
    location: "Remote",
    summary:
      "Decide what gets built and, harder, what does not. Readora's surface area already outruns its team; the job is to aim it.",
    responsibilities: [
      "Own the roadmap for reading and writing, and keep it honest about what a small team can finish.",
      "Talk to writers and readers every week, and bring back specifics rather than themes.",
      "Define what a feature must do before it ships and how you will know if it worked.",
      "Work with engineering and design daily — this is a hands-on role, not a ticket queue.",
      "Kill things. Cheerfully.",
    ],
    requirements: [
      "You have shipped consumer product with a small team and can describe a decision you got wrong.",
      "You reason with data without hiding behind it.",
      "You write clearly — specs, updates, and the argument for saying no.",
      "You are comfortable working without much process.",
    ],
    bonus: [
      "Background in marketplaces, creator tools, or subscription products.",
      "You have run monetisation for a creator platform.",
    ],
    reality:
      "You will not have a research team or a data scientist. Expect to pull your own numbers and run your own calls.",
  },
  {
    slug: "hr-intern",
    folio: "Ch. 05",
    title: "People & Talent Intern",
    team: "People",
    type: "Internship · 3–6 months",
    location: "Remote",
    summary:
      "Help build the hiring process that everyone after you goes through. A real internship with real ownership, not shadowing.",
    responsibilities: [
      "Run scheduling and candidate communication, and keep it warm and fast — how we treat applicants is part of the product.",
      "Source candidates for open roles and learn to spot signal in a portfolio or repository.",
      "Help write and maintain job descriptions, including this page.",
      "Own onboarding checklists so a new joiner's first week is not improvised.",
      "Keep the applicant tracker honest.",
    ],
    requirements: [
      "Organised enough that nothing goes unanswered for a week.",
      "You write friendly, clear English — most of the job is written communication.",
      "Curious about how teams are built, and discreet with confidential information.",
      "Available at least 20 hours a week.",
    ],
    bonus: [
      "You have coordinated something with many moving parts — a club, an event, a student society.",
    ],
    reality:
      "This is a paid internship at a small company. You will be the only person doing this, with support but not supervision. It suits someone who would rather own a small thing completely than assist on a large one.",
  },
];

export type Programme = {
  slug: string;
  folio: string;
  title: string;
  duration: string;
  summary: string;
  detail: string;
  points: string[];
};

export const PROGRAMMES: Programme[] = [
  {
    slug: "engineering-internship",
    folio: "Prog. A",
    title: "Engineering Internship",
    duration: "3–6 months · Paid · Remote",
    summary:
      "For students and self-taught engineers who want to ship to production instead of building another to-do app.",
    detail:
      "You join as a working member of the team with your own features, your own pull requests and your own review responsibilities. Interns pair with an engineer weekly and present what they shipped at the end.",
    points: [
      "Work on the real codebase — Next.js, TypeScript, tRPC, Prisma — not a sandbox.",
      "Ship to production in your first two weeks.",
      "Weekly pairing and code review from an engineer.",
      "A written reference and a portfolio of merged work at the end.",
    ],
  },
  {
    slug: "writers-fellowship",
    folio: "Prog. B",
    title: "Readora Writers' Fellowship",
    duration: "6 months · Stipend · Open worldwide",
    summary:
      "A cohort programme for serial fiction writers who are serious about finishing something long.",
    detail:
      "Fellows commit to publishing on a regular schedule for six months. In return they get a stipend, editorial support, and deliberate promotion across Readora. We do not take rights to the work — the story stays yours, during the fellowship and after it.",
    points: [
      "A monthly stipend for the duration, independent of what the story earns.",
      "Editorial feedback on structure and pacing from a working editor.",
      "Featured placement and a dedicated launch for each fellow's serial.",
      "You keep every right to your work. No exclusivity, no first refusal.",
    ],
  },
  {
    slug: "design-fellowship",
    folio: "Prog. C",
    title: "Design Fellowship",
    duration: "4 months · Paid · Remote",
    summary:
      "For designers early in their career who want a real product surface and a real user to answer to.",
    detail:
      "Fellows take a genuine problem — onboarding, the reader's controls, the studio dashboard — and own it from research through shipped interface, with weekly critique.",
    points: [
      "One meaningful problem, owned end to end.",
      "Weekly critique with the product designer and engineering.",
      "Your work ships and is credited.",
      "Portfolio-ready case study support at the end.",
    ],
  },
];

/** The hiring process. Ordered because the order is real. */
export const HIRING_STEPS = [
  {
    step: "01",
    title: "You apply",
    body: "One email. A CV or portfolio, and a few lines on why this role and not another. No cover letter theatre, no form with twenty fields.",
    time: "10 minutes",
  },
  {
    step: "02",
    title: "First conversation",
    body: "Forty-five minutes with the person you would work with most closely. Mostly about what you have built and what you want to build next.",
    time: "45 minutes",
  },
  {
    step: "03",
    title: "A practical exercise",
    body: "A small, scoped piece of real work — a feature sketch, a design critique, a growth teardown. Timeboxed and paid, and never speculative work we would actually ship.",
    time: "3–4 hours, paid",
  },
  {
    step: "04",
    title: "Team conversation",
    body: "You meet the rest of the team and ask us the uncomfortable questions. Runway, ownership, what has gone wrong. We will answer them.",
    time: "1 hour",
  },
  {
    step: "05",
    title: "Offer",
    body: "A decision within three working days of the last conversation, either way, with feedback if you want it.",
    time: "3 days",
  },
] as const;
