"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { env } from "~/env";

const local = "http://localhost:3000";

if (typeof window !== "undefined" && env.NEXT_PUBLIC_APP_URL !== local) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "always",
  });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  if (env.NEXT_PUBLIC_APP_URL === local) return null;

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
