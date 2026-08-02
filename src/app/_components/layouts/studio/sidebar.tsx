"use client";

import {
  Agreement02Icon,
  AiImageIcon,
  AiVideoIcon,
  Analytics01Icon,
  ArrowLeft01Icon,
  Home01Icon,
  Idea01Icon,
  LibraryIcon,
  QuillWrite02Icon,
  StarIcon,
} from "hugeicons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
import FeedbackDialog from "../../shared/feedback";
import Logo from "../../shared/logo";

const items = {
  manage: [
    {
      title: "Home",
      icon: Home01Icon,
      slug: "/studio",
      external: false,
      new: false,
    },
    {
      title: "Analytics",
      icon: Analytics01Icon,
      slug: "/studio/analytics",
      external: false,
      new: false,
    },
    {
      title: "Works",
      icon: LibraryIcon,
      slug: "/studio/works",
      external: false,
      new: false,
    },
    {
      title: "Reviews",
      icon: StarIcon,
      slug: "/studio/reviews",
      external: false,
      new: false,
    },
  ],
  tools: [
    // {
    //   title: "Start Advertising",
    //   icon: Target01Icon,
    //   slug: "/studio/run-ad-campaign",
    //   external: false,
    // },
    {
      title: "Referral Program",
      icon: Agreement02Icon,
      slug: "/settings?tab=affiliate",
      external: false,
      new: false,
    },
  ],
  "Work with AI": [
    {
      title: "Cover Image",
      icon: AiImageIcon,
      slug: "/studio/run-ad-campaign",
      external: false,
      new: true,
    },
    {
      title: "Short Video",
      icon: AiVideoIcon,
      slug: "/settings?tab=affiliate",
      external: false,
      new: true,
    },
  ],
} as const;

const validPaths = Object.values(items)
  .flat()
  .map((e) => e.slug);

const StudioSidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const currentPath = validPaths.includes(pathname as any)
    ? pathname
    : "/studio";

  return (
    <Sidebar className="bg-slate-50 border-r border-border h-dvh">
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
                          "hover:bg-slate-200",
                        )}
                      >
                        <Link
                          href={item.slug}
                          target={item.external ? "_blank" : undefined}
                          className="relative"
                        >
                          <item.icon />

                          <span className="font-medium">{item.title}</span>
                          {/* {
                            item.new && (
                              <Badge variant="destructive" className="float-right px-1 rounded-xs py-0">New</Badge>
                            )
                          } */}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <div className="px-3">
              <Separator />
            </div>
          </div>
        ))}
        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <FeedbackDialog>
                  <SidebarMenuButton
                    className={cn("cursor-pointer hover:bg-slate-200")}
                  >
                    <Idea01Icon />
                    <span className="font-medium">Feedback</span>
                  </SidebarMenuButton>
                </FeedbackDialog>
              </SidebarMenuItem>
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
