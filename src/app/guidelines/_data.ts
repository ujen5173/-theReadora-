/**
 * Community guidelines.
 *
 * Numbered because the numbers are referenced elsewhere: moderation notices,
 * report forms and appeals all cite a clause. Renumbering these is a breaking
 * change — add to the end of a section rather than inserting in the middle.
 */

export type Clause = {
  id: string;
  number: string;
  title: string;
  body: string;
  /** Concrete examples. Vague rules get applied unevenly. */
  examples?: { allowed?: string[]; notAllowed?: string[] };
};

export type ClauseGroup = {
  id: string;
  folio: string;
  title: string;
  intro: string;
  clauses: Clause[];
};

export const GUIDELINE_GROUPS: ClauseGroup[] = [
  {
    id: "what-you-write",
    folio: "§ 1",
    title: "What you can write",
    intro:
      "Fiction is allowed to be dark. Readora hosts horror, crime, tragedy and morally repugnant characters, because those are legitimate subjects. The limits below are about harm to real people, not about protecting readers from difficult stories.",
    clauses: [
      {
        id: "1-1",
        number: "1.1",
        title: "Difficult subject matter is permitted",
        body: "Depicting something is not endorsing it. Violence, abuse, addiction, bigotry and grief can all appear in a story. What matters is that the work is presented as fiction and rated honestly.",
        examples: {
          allowed: [
            "A villain whose views are repellent and stated plainly on the page.",
            "A story about surviving abuse, told without flinching.",
            "Graphic violence in horror, crime or war fiction.",
          ],
          notAllowed: [
            "Material written to instruct rather than depict — a working method for harming people presented as narrative.",
            "Content that presents the sexual abuse of children in any form, fictional or otherwise.",
          ],
        },
      },
      {
        id: "1-2",
        number: "1.2",
        title: "Sexual content involving minors is never permitted",
        body: "This is absolute and has no artistic exception. Any character depicted in sexual content must be an adult, and must read as one. Accounts posting this material are removed permanently and reported to the relevant authorities without warning or appeal.",
      },
      {
        id: "1-3",
        number: "1.3",
        title: "No content that targets real people",
        body: "Do not publish work that harasses, threatens, sexualises or defames an identifiable living person. Public figures may be written about critically and satirically; they may not be sexualised or threatened.",
      },
      {
        id: "1-4",
        number: "1.4",
        title: "No incitement",
        body: "Content that calls for violence against a person or group, promotes a violent organisation, or celebrates a mass-casualty attack is removed regardless of framing.",
      },
      {
        id: "1-5",
        number: "1.5",
        title: "Self-harm must be handled with care",
        body: "Stories may deal with suicide and self-harm — many readers need exactly that story. What is not allowed is material presenting it as desirable or providing method detail. Chapters covering it should carry a content warning.",
      },
    ],
  },
  {
    id: "ratings",
    folio: "§ 2",
    title: "Ratings and content warnings",
    intro:
      "Rating your work accurately is the main thing you can do for your readers. It is also the thing most likely to get your story restricted if you get it wrong.",
    clauses: [
      {
        id: "2-1",
        number: "2.1",
        title: "Mark mature work as mature",
        body: "A story needs the mature flag if it contains explicit sexual content, graphic violence, or sustained treatment of subjects like abuse or addiction. When you are unsure, mark it. Under-rating is treated as a violation; over-rating never is.",
      },
      {
        id: "2-2",
        number: "2.2",
        title: "Warn at chapter level where it matters",
        body: "If a single chapter is significantly darker than the story around it, say so at the top of that chapter. A one-line warning costs you nothing and is the difference between a reader trusting you and a reader leaving.",
      },
      {
        id: "2-3",
        number: "2.3",
        title: "Do not use warnings as advertising",
        body: "Tags and warnings exist so readers can find and avoid things accurately. Adding unrelated or sensational tags to catch traffic degrades discovery for everyone and is treated as spam under 4.2.",
      },
    ],
  },
  {
    id: "ownership",
    folio: "§ 3",
    title: "Ownership and originality",
    intro:
      "You keep the rights to what you publish here. The other side of that is that you must actually hold those rights.",
    clauses: [
      {
        id: "3-1",
        number: "3.1",
        title: "Publish only what is yours to publish",
        body: "Do not upload someone else's writing, whether from another platform, a published book, or a co-author who has not agreed. Plagiarism is the fastest route to permanent removal on this platform.",
      },
      {
        id: "3-2",
        number: "3.2",
        title: "Fan fiction is welcome, within limits",
        body: "Transformative work built on existing worlds is part of how serial fiction has always worked and is allowed here. It cannot be sold: fan fiction may not use per-chapter pricing or be placed behind a paywall.",
      },
      {
        id: "3-3",
        number: "3.3",
        title: "Disclose AI assistance",
        body: "Using a model to draft, edit or brainstorm is permitted, and Readora ships tools that do exactly that. Mark the story as AI-assisted so readers can make their own choice. Publishing bulk generated text as original work is not permitted, and undisclosed use found later is treated as a 3.1 violation.",
      },
      {
        id: "3-4",
        number: "3.4",
        title: "Respond to takedowns properly",
        body: "If a valid copyright claim is made against your work it will be removed pending resolution. Repeated substantiated claims end in account termination. Counter-notices are welcome and are read by a person.",
      },
    ],
  },
  {
    id: "conduct",
    folio: "§ 4",
    title: "How we treat each other",
    intro:
      "Comments are where serial fiction lives. They are also where it most often goes wrong.",
    clauses: [
      {
        id: "4-1",
        number: "4.1",
        title: "Criticise the work, not the writer",
        body: "Harsh reviews of a story are fine, and useful. Attacks on the person who wrote it are not. The line is whether the comment is about the writing or about the human being.",
      },
      {
        id: "4-2",
        number: "4.2",
        title: "No spam or manipulation",
        body: "This covers advertising unrelated products, mass-posting to unrelated stories, inflating reads or ratings by any means, and running multiple accounts to boost your own work. Metrics are how readers find good writing; corrupting them harms every author here.",
      },
      {
        id: "4-3",
        number: "4.3",
        title: "No harassment or pile-ons",
        body: "Repeated unwanted contact, coordinated brigading of an author or reader, and doxxing are all removable offences. Organising a pile-on is treated the same as taking part in one.",
      },
      {
        id: "4-4",
        number: "4.4",
        title: "One person, one account",
        body: "Pen names are welcome and encouraged — many writers keep separate identities for separate genres. Using multiple accounts to evade moderation or manipulate metrics is not the same thing and is treated under 4.2.",
      },
    ],
  },
];

/** The enforcement ladder. Ordered because escalation is sequential. */
export const ENFORCEMENT = [
  {
    step: "01",
    title: "A note",
    body: "For most first issues — a mis-rated story, an unmarked chapter — you get a message explaining what to change and time to change it. Nothing is removed.",
  },
  {
    step: "02",
    title: "Restriction",
    body: "The work is hidden from discovery or age-restricted while you fix it. Your readers keep their access; new readers do not find it until it's resolved.",
  },
  {
    step: "03",
    title: "Removal",
    body: "The work comes down. You keep your copy and your account, and you can appeal. We will tell you which clause was breached and why.",
  },
  {
    step: "04",
    title: "Termination",
    body: "Reserved for repeated violations after removal, plagiarism, and the categories under 1.2 and 1.4 — which skip every step above and go straight here.",
  },
] as const;
