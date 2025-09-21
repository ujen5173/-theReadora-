"use client";

import {
  Analytics01Icon,
  ArrowLeft01Icon,
  LibraryIcon,
  Mail02Icon,
} from "hugeicons-react";
import { Home, Plus } from "lucide-react";
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
      slug: "/studio",
    },
    {
      title: "Analytics",
      icon: Analytics01Icon,
      slug: "/studio/analytics",
    },
    {
      title: "Works",
      icon: LibraryIcon,
      slug: "/studio/works",
    },
    // {
    //   title: "Reviews",
    //   icon: Comment01Icon,
    //   slug: "/studio/reviews",
    // },
  ],
  // tools: [
  //   {
  //     title: "Inspiration",
  //     icon: Idea01Icon,
  //     slug: "/studio/inspiration",
  //   },
  // ],
  others: [
    {
      title: "Feedback",
      icon: Mail02Icon,
      slug: "/studio/feedback",
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
      <SidebarHeader>
        <div className="p-2">
          <Logo />
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <div className="p-4">
          <Link href="/write">
            <Button icon={Plus} effect="shineHover" className="w-full">
              Upload
            </Button>
          </Link>
        </div>
        <div className="px-3">
          <Separator />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.manage.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      currentPath === item.slug &&
                        "border border-slate-300 bg-slate-200",
                      "hover:bg-slate-200"
                    )}
                  >
                    <Link href={item.slug}>
                      <item.icon />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <div className="px-3">
          <Separator />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.tools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      currentPath === item.slug &&
                        "border border-slate-300 bg-slate-200",
                      "hover:bg-slate-200"
                    )}
                  >
                    <a href={item.slug}>
                      <item.icon />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
        <div className="px-3">
          <Separator />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.others.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      currentPath === item.slug &&
                        "border border-slate-300 bg-slate-200",
                      "hover:bg-slate-200"
                    )}
                  >
                    <a href={item.slug}>
                      <item.icon />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
