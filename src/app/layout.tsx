import "~/styles/globals.css";

import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import HolyLoader from "holy-loader";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { BetaOnboardingModal } from "~/components/shared/beta-onboarding-modal";
import { UserActivityTracker } from "~/components/shared/user-activity-tracker";
import { TRPCReactProvider } from "~/trpc/react";
import { manrope } from "~/utils/font";
import { generateSEOMetadata, structuredData } from "~/utils/site";
import { CSPostHogProvider } from "./_components/layouts/analytics/posthog";
import RootLayoutClient from "./_components/layouts/root-layout-client";
import { RootContext } from "./_components/root";
import Footer from "./_components/shared/footer";
import ReadCounter from "./_components/shared/read-counter";
import TailwindIndicator from "./_components/shared/tailwind-size-indicator";

export const metadata: Metadata = generateSEOMetadata({
  pathname: "/",
  hreflangAlternates: {
    en: "/",
  },
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.className}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body>
        <TRPCReactProvider>
          <SessionProvider>
            <UserActivityTracker />
            <RootContext>
              <RootLayoutClient>
                <CSPostHogProvider>
                  <Analytics />
                  <SpeedInsights />
                  <ReadCounter />
                  <Suspense>
                    <TailwindIndicator />
                    <HolyLoader height={4} color="#e11d48" />
                    <Toaster />

                    {children}

                    <Footer />
                    <BetaOnboardingModal />
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
