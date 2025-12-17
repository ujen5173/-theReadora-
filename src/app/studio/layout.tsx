import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { generateSEOMetadata } from "~/utils/site";
import StudioSidebar from "../_components/layouts/studio/sidebar";
import UserHeader from "../_components/user/user-header";

export const metadata: Metadata = generateSEOMetadata({
  title: "Studio",
  description:
    "The Readora Studio is a web-based comprehensive tool to support creators growing their page and follower base.",
  noIndex: true,
});

const StudioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <StudioSidebar />

      <section className="bg-slate-50 overflow-hidden flex-1">
        <div className="border-b border-border">
          <header className="max-w-[1440px] mx-auto flex w-full items-center h-[64px] px-4 gap-4">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1" />
            <UserHeader />
          </header>
        </div>
        <div className="w-full relative">
          <div className="h-[calc(100dvh-65px)] overflow-y-auto overflow-x-hidden custom-scroll scroll-vertical">
            <div className="max-w-[1440px] mx-auto relative">{children}</div>
          </div>
        </div>
      </section>
    </SidebarProvider>
  );
};

export default StudioLayout;
