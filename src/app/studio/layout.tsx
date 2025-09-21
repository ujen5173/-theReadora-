import type { Metadata } from "next";
import { SidebarProvider } from "~/components/ui/sidebar";
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

      <section className="bg-slate-50 flex-1">
        <div className="border-b border-border">
          <header className="max-w-[1440px] mx-auto flex w-full items-center justify-end h-[57px] px-4">
            <UserHeader />
          </header>
        </div>

        <div className="max-w-[1440px] mx-auto">{children}</div>
      </section>
    </SidebarProvider>
  );
};

export default StudioLayout;
