import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

/**
 * Shared building blocks for the marketing pages (about, careers, comparison,
 * guidelines).
 *
 * These deliberately reuse the vocabulary already established in the app rather
 * than inventing a second visual language:
 *   - page shell    → bg-slate-100 wrapper + white rounded card  (premium page)
 *   - eyebrow       → outlined crimson Badge with an icon        (premium page)
 *   - headline      → bold slate-700, key phrase in primary      (hero section)
 *   - icon chip     → bg-primary/10 p-3 rounded-xl text-primary  (hello-writers)
 *   - dark section  → slate-950 with white/5 glass cards         (hello-writers)
 *
 * Everything is a server component so the copy ships in the initial HTML.
 */

/* -------------------------------------------------------------------------- */
/*  Page shell                                                                 */
/* -------------------------------------------------------------------------- */

export const PageShell = ({ children }: { children: ReactNode }) => (
  <main className="bg-slate-100 sm:p-4 w-full min-h-screen">
    {/* Full-bleed on phones: a rounded inset card just steals horizontal space
        on a 360px screen. The framing returns from sm up. */}
    <div className="bg-white sm:border border-slate-200 sm:rounded-lg overflow-hidden">
      {children}
    </div>
  </main>
);

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

export const PageHero = ({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  eyebrowIcon: React.ElementType;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}) => (
  <section className="relative overflow-hidden bg-gradient-to-b from-primary/[0.06] to-transparent">
    <div className="flex flex-col justify-center items-center mx-auto px-4 py-12 sm:py-20 lg:py-24 container text-center">
      <Badge
        variant="outline"
        className="hover:bg-primary/10 mb-5 border-primary h-7 text-primary transition-colors"
      >
        <EyebrowIcon className="mr-1 w-4 h-4" />
        {eyebrow}
      </Badge>

      <h1 className="mb-4 sm:mb-5 max-w-4xl font-bold text-slate-700 text-[1.75rem] sm:text-4xl lg:text-5xl text-balance leading-[1.15] tracking-tight">
        {title}
      </h1>

      {subtitle && (
        <p className="max-w-2xl font-medium text-slate-500 text-[0.95rem] sm:text-base md:text-lg text-pretty leading-relaxed">
          {subtitle}
        </p>
      )}

      {children && <div className="mt-7 sm:mt-9 w-full">{children}</div>}
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */

export const Section = ({
  label,
  title,
  subtitle,
  children,
  id,
  tone = "light",
  align = "left",
}: {
  label?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  id?: string;
  tone?: "light" | "muted" | "dark";
  align?: "left" | "center";
}) => (
  <section
    id={id}
    className={cn(
      "scroll-mt-24 border-t border-slate-200",
      tone === "muted" && "bg-slate-50/70",
      tone === "dark" && "bg-slate-950 border-slate-800",
    )}
  >
    <div className="mx-auto px-4 py-12 sm:py-16 lg:py-20 container">
      {(label || title || subtitle) && (
        <div
          className={cn(
            "mb-8 sm:mb-10",
            align === "center" && "flex flex-col items-center text-center",
          )}
        >
          {label && (
            <span className="block mb-2 font-semibold text-primary text-sm tracking-wide">
              {label}
            </span>
          )}
          {title && (
            <h2
              className={cn(
                "font-bold text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-balance leading-snug tracking-tight",
                tone === "dark" ? "text-slate-100" : "text-slate-700",
              )}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={cn(
                "mt-4 max-w-2xl text-pretty leading-relaxed",
                align === "center" && "mx-auto",
                tone === "dark" ? "text-slate-400" : "text-slate-500",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  Icon chip                                                                  */
/* -------------------------------------------------------------------------- */

export const IconChip = ({
  icon: Icon,
  tone = "light",
  className,
}: {
  icon: React.ElementType;
  tone?: "light" | "dark" | "solid";
  className?: string;
}) => (
  <div
    className={cn(
      // inline-grid + w-fit: as a plain block this stretched to fill any
      // non-flex parent, which read as a coloured bar across the card.
      "inline-grid place-items-center p-3 rounded-xl w-fit transition-colors shrink-0",
      tone === "light" && "bg-primary/10 text-primary",
      tone === "dark" && "bg-primary/10 text-primary",
      tone === "solid" && "bg-white/15 text-white",
      className,
    )}
  >
    <Icon className="size-6" />
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Feature card                                                               */
/* -------------------------------------------------------------------------- */

export const FeatureCard = ({
  icon,
  title,
  children,
  tone = "light",
}: {
  icon: React.ElementType;
  title: string;
  children: ReactNode;
  tone?: "light" | "dark";
}) => (
  <div
    className={cn(
      "group p-6 sm:p-7 border rounded-2xl transition-all duration-300",
      tone === "light"
        ? "bg-white border-slate-200 hover:border-primary/30 hover:shadow-primary/5 hover:shadow-xl"
        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 backdrop-blur-sm",
    )}
  >
    <div className="flex items-start gap-4">
      <IconChip
        icon={icon}
        className={
          tone === "light"
            ? "group-hover:bg-primary/20"
            : "group-hover:bg-primary/20"
        }
      />
      <div className="min-w-0">
        <h3
          className={cn(
            "mb-2 font-semibold text-lg",
            tone === "light" ? "text-slate-700" : "text-slate-100",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-pretty leading-relaxed",
            tone === "light" ? "text-slate-500" : "text-slate-400",
          )}
        >
          {children}
        </p>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Check list                                                                 */
/* -------------------------------------------------------------------------- */

export const CheckItem = ({
  icon: Icon,
  children,
  tone = "light",
}: {
  icon: React.ElementType;
  children: ReactNode;
  tone?: "light" | "dark" | "solid";
}) => (
  <li className="flex items-start gap-3">
    <span
      className={cn(
        "grid place-items-center mt-0.5 rounded-full size-5 shrink-0",
        tone === "light" && "bg-primary/10 text-primary",
        tone === "dark" && "bg-primary/15 text-primary",
        tone === "solid" && "bg-white/20 text-white",
      )}
    >
      <Icon className="size-3" />
    </span>
    <span
      className={cn(
        "text-pretty leading-relaxed",
        tone === "light" && "text-slate-600",
        tone === "dark" && "text-slate-400",
        tone === "solid" && "text-white/90",
      )}
    >
      {children}
    </span>
  </li>
);

/* -------------------------------------------------------------------------- */
/*  Stat / meta pill                                                           */
/* -------------------------------------------------------------------------- */

export const MetaPill = ({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "solid";
}) => (
  <span
    className={cn(
      "inline-flex items-center px-2.5 py-1 border rounded-md font-medium text-xs whitespace-nowrap",
      tone === "light"
        ? "bg-slate-50 border-slate-200 text-slate-500"
        : "bg-white/10 border-white/15 text-white/80",
    )}
  >
    {children}
  </span>
);

/* -------------------------------------------------------------------------- */
/*  Disclosure card                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Native <details> styled as a card. Chosen over a JS accordion so the content
 * ships in the server HTML and gets keyboard behaviour for free.
 */
export const DisclosureCard = ({
  icon: Icon,
  title,
  meta,
  children,
  id,
}: {
  icon?: React.ElementType;
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  id?: string;
}) => (
  <details
    id={id}
    className="group bg-white open:bg-slate-50/60 open:shadow-primary/5 open:shadow-lg border border-slate-200 open:border-primary/30 rounded-2xl scroll-mt-24 transition-colors [&_summary::-webkit-details-marker]:hidden"
  >
    <summary className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl min-h-[3.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer list-none">
      {Icon && (
        <IconChip
          icon={Icon}
          className="group-hover:bg-primary/20 group-open:bg-primary group-open:text-white"
        />
      )}

      <span className="flex-1 min-w-0">
        <span className="block font-semibold text-slate-700 group-hover:text-primary group-open:text-primary text-lg transition-colors">
          {title}
        </span>
        {meta && (
          <span className="flex flex-wrap items-center gap-1.5 mt-2">
            {meta}
          </span>
        )}
      </span>

      <span
        aria-hidden
        className="place-items-center grid bg-slate-50 group-hover:bg-primary group-open:bg-primary border border-slate-200 group-hover:border-primary rounded-full size-9 text-slate-500 group-hover:text-white group-open:text-white transition-colors shrink-0"
      >
        <span className="block bg-current w-3 h-px" />
        <span className="block -mt-px bg-current w-px h-3 group-open:opacity-0 transition-transform duration-200 group-open:rotate-90" />
      </span>
    </summary>

    <div className="px-4 sm:px-6 pb-6 border-slate-200 border-t pt-5 sm:pt-6 mx-0">
      {children}
    </div>
  </details>
);

/* -------------------------------------------------------------------------- */
/*  Closing call to action                                                     */
/* -------------------------------------------------------------------------- */

export const ClosingCta = ({
  title,
  subtitle,
  children,
  footnote,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  footnote?: ReactNode;
}) => (
  <section className="relative bg-slate-950 border-slate-800 border-t overflow-hidden">
    {/* Same ambient wash the writers section uses, kept faint. */}
    <div
      aria-hidden
      className="-top-24 left-1/2 absolute bg-primary/20 blur-3xl rounded-full w-[36rem] h-[36rem] -translate-x-1/2 pointer-events-none"
    />

    <div className="z-10 relative flex flex-col items-center mx-auto px-4 py-14 sm:py-20 lg:py-24 container text-center">
      <h2 className="mb-4 max-w-3xl font-bold text-slate-100 text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-balance leading-snug tracking-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="max-w-2xl text-slate-400 text-pretty leading-relaxed">
          {subtitle}
        </p>
      )}

      {children && (
        <div className="flex sm:flex-row flex-col justify-center gap-3 mt-9 w-full sm:w-auto">
          {children}
        </div>
      )}

      {footnote && (
        <div className="mt-10 pt-8 border-slate-800 border-t max-w-2xl text-slate-500 text-sm">
          {footnote}
        </div>
      )}
    </div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*  Anchor row — used for on-page navigation indexes                           */
/* -------------------------------------------------------------------------- */

export const AnchorCard = ({
  href,
  icon: Icon,
  title,
  meta,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  meta?: string;
}) => (
  <Link
    href={href}
    className="group flex items-center gap-4 bg-white hover:bg-primary/[0.03] p-4 border border-slate-200 hover:border-primary/30 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
  >
    <span className="grid place-items-center bg-primary/10 group-hover:bg-primary p-2.5 rounded-lg text-primary group-hover:text-white transition-colors shrink-0">
      <Icon className="size-5" />
    </span>

    {/* Titles wrap rather than truncate — a clipped job title is useless. */}
    <span className="flex-1 min-w-0">
      <span className="block font-semibold text-slate-700 group-hover:text-primary text-sm text-pretty leading-snug transition-colors">
        {title}
      </span>
      {meta && (
        <span className="block mt-0.5 text-slate-400 text-xs text-pretty">
          {meta}
        </span>
      )}
    </span>
  </Link>
);
