"use client";

import {
  Agreement02Icon,
  Analytics01Icon,
  ArrowLeft01Icon,
  DiscordIcon,
  LibraryIcon,
  Mail02Icon,
  QuillWrite02Icon,
  StarIcon,
  Target01Icon,
} from "hugeicons-react";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import Logo from "../../shared/logo";

const items = {
  manage: [
    {
      title: "Home",
      icon: Home,
      slug: "/studio/",
      external: false,
    },
    {
      title: "Analytics",
      icon: Analytics01Icon,
      slug: "/studio/analytics",
      external: false,
    },
    {
      title: "Works",
      icon: LibraryIcon,
      slug: "/studio/works",
      external: false,
    },
    {
      title: "Reviews",
      icon: StarIcon,
      slug: "/studio/reviews",
      external: false,
    },
  ],
  tools: [
    {
      title: "Start Advertising",
      icon: Target01Icon,
      slug: "/studio/run-ad-campaign",
      external: false,
    },
    {
      title: "Referral Program",
      icon: Agreement02Icon,
      slug: "/settings/referral",
      external: false,
    },
    {
      title: "Join Discord",
      icon: DiscordIcon,
      slug: "https://discord.gg/P2u8fKGVCj",
      external: true,
    },
  ],
  others: [
    {
      title: "Feedback",
      icon: Mail02Icon,
      slug: "/feedback",
      external: false,
    },
  ],
} as const;

const validPaths = Object.values(items)
  .flat()
  .map((e) => e.slug);

const StudioSidebar = () => {
  const pathname = usePathname();

  // Get the current active path, defaulting to home if invalid
  const currentPath = validPaths.includes(pathname as any)
    ? pathname
    : "/studio";

  return (
    <Sidebar
      collapsible="none"
      className="bg-slate-50 border-r border-border h-dvh"
    >
      <SidebarHeader className="h-[64px]">
        <div className="p-2">
          <Logo />
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <div className="p-4">
          <Link href="/write">
            <Button
              icon={QuillWrite02Icon}
              effect="shineHover"
              className="w-full"
            >
              Upload
            </Button>
          </Link>
        </div>
        <div className="px-3">
          <Separator />
        </div>
        {Object.entries(items).map(([key, value], index) => (
          <div key={index}>
            <SidebarGroup>
              <SidebarGroupLabel>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {value.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          currentPath === item.slug &&
                            "border border-slate-300 bg-slate-200",
                          "hover:bg-slate-200"
                        )}
                      >
                        <Link
                          href={item.slug}
                          target={item.external ? "_blank" : undefined}
                        >
                          <item.icon />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {index !== Object.entries(items).length - 1 && (
              <div className="px-3">
                <Separator />
              </div>
            )}
          </div>
        ))}
      </SidebarContent>
      <SidebarFooter className="mb-4">
        <Button variant={"ghost"} icon={ArrowLeft01Icon}>
          Back to Readora
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default StudioSidebar;
