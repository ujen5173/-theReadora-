import "~/styles/globals.css";

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import HolyLoader from "holy-loader";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { TRPCReactProvider } from "~/trpc/react";
import { generateSEOMetadata } from "~/utils/site";
import { CSPostHogProvider } from "./_components/layouts/analytics/posthog";
import RootLayoutClient from "./_components/layouts/root-layout-client";
import { RootContext } from "./_components/root";
import Footer from "./_components/shared/footer";
import TailwindIndicator from "./_components/shared/tailwind-size-indicator";

export const metadata: Metadata = generateSEOMetadata({});

const geist = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
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
                    {/* <NextTopLoader height={5} color="#e11d48" /> */}
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
