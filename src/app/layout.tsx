import "~/styles/globals.css";

import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import HolyLoader from "holy-loader";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "~/trpc/react";
import { outfit } from "~/utils/font";
import { generateSEOMetadata } from "~/utils/site";
import { CSPostHogProvider } from "./_components/layouts/analytics/posthog";
import RootLayoutClient from "./_components/layouts/root-layout-client";
import { RootContext } from "./_components/root";
import Footer from "./_components/shared/footer";
import TailwindIndicator from "./_components/shared/tailwind-size-indicator";

export const metadata: Metadata = generateSEOMetadata({});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.className}`}>
      <body>
        <TRPCReactProvider>
          <SessionProvider>
            <RootContext>
              <RootLayoutClient>
                <CSPostHogProvider>
                  <Analytics />
                  <SpeedInsights />
                  <Suspense>
                    <TailwindIndicator />
                    <HolyLoader height={4} color="#e11d48" />
                    <Toaster />

                    {children}

                    <Footer />
                  </Suspense>
                </CSPostHogProvider>
              </RootLayoutClient>
            </RootContext>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
