import { HydrateClient } from "~/trpc/server";

export function RootContext({ children }: { children: React.ReactNode }) {
  return <HydrateClient>{children}</HydrateClient>;
}
