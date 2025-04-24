import "~/styles/globals.css";

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { RootContext } from "./_components/root";
import NextTopLoader from "nextjs-toploader";
import Footer from "./_components/shared/footer";
import { Toaster } from "sonner";
import { generateSEOMetadata } from "~/utils/site";
import TailwindIndicator from "./_components/shared/tailwind-size-indicator";
import { SessionProvider } from "next-auth/react";
import RootLayoutClient from "./_components/layouts/root-layout-client";
import { CSPostHogProvider } from "./_components/layouts/analytics/posthog";

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
                  <TailwindIndicator />
                  <NextTopLoader height={5} color="#e11d48" />
                  <Toaster />

                  <div className="fixed -z-10 h-screen w-full bg-gradient-to-br from-primary/20 via-white to-primary/10"></div>
                  <div
                    className="fixed -z-10 h-screen w-full opacity-30"
                    style={{
                      backgroundImage: "url(/ooorganize.svg)",
                      backgroundBlendMode: "overlay",
                      backgroundAttachment: "fixed",
                      backgroundSize: "cover",
                    }}
                  ></div>

                  {children}

                  <Footer />
                </CSPostHogProvider>
              </RootLayoutClient>
            </RootContext>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
