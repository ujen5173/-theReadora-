"use client";

import type { PropsWithChildren } from "react";
import { useAuthSync } from "~/hooks/useAuthSync";

/**
 * Client component wrapper for root layout
 * This syncs auth state between NextAuth and Zustand
 */
export default function RootLayoutClient({ children }: PropsWithChildren) {
  // Sync auth state at the application root
  useAuthSync();

  return <>{children}</>;
}
