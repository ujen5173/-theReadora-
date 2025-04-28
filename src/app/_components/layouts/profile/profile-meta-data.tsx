"use client";

import { Book01Icon, Bookshelf01Icon, RecordIcon } from "hugeicons-react";
import {
  BellIcon,
  CalendarDays,
  Edit2,
  MapPin,
  Users,
  BookOpen,
  Heart,
  Twitter,
  Github,
} from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useUserProfileStore } from "~/store/userProfileStore";
import UserCreations from "./user-creations";
import UserReadingList from "./user-reading-list";
import { formatDate } from "~/utils/helpers";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import ShareDialog from "../../shared/share-dialog";
import { useEffect, useState } from "react";

const ProfileMetaData = () => {
  const { user: author } = useUserProfileStore();
  const [user, setUser] = useState(author);

  useEffect(() => {
    if (author) {
      setUser({
        ...author,
        isPremium: true,
        verified: true,
      });
    }
  }, [author]);

  const socialLinks = [
    { name: "Twitter", url: user?.twitter, icon: Twitter },
    { name: "GitHub", url: user?.github, icon: Github },
    // Add more social links as needed
  ];

  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-[1440px] pb-16 border-b border-border px-4">
        {/* Main Profile Section */}
        <div className="relative pt-16 pb-8">
          {/* Profile Header */}
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="flex justify-center sm:justify-start">
              <div className="relative">
                <div className="rounded-full p-1 bg-gradient-to-r from-primary to-primary/80">
                  <Image
                    src={user?.image ?? ""}
                    alt={user?.name ?? ""}
                    width={160}
                    height={160}
                    className="rounded-full border-4 border-white shadow-lg"
                    draggable={false}
                  />
                </div>
                {user?.isPremium && (
                  <Badge className="absolute -right-2 bottom-4 py-1 px-3 font-semibold bg-gradient-to-r from-amber-400 to-amber-600 text-white border-2 border-white shadow-md">
                    PRO
                  </Badge>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 mt-2 space-y-6">
              {/* Name and Username */}
              <div className="text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
                    {user?.name}
                  </h1>
                  {user?.verified && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className="bg-primary/15 text-primary hover:bg-primary/20 border-0 shadow-sm">
                            <span className="flex items-center gap-1">
                              <svg
                                className="size-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Verified
                            </span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">Verified Author</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-slate-600">
                  <span className="font-medium text-slate-700">
                    @{user?.username}
                  </span>
                  <RecordIcon className="size-1.5 fill-slate-500 text-slate-500" />
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {user?.location || "Nepal"}
                  </span>
                  <RecordIcon className="size-1.5 fill-slate-500 text-slate-500" />
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4" />
                    Joined {formatDate(new Date(user?.createdAt ?? ""))}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <div className="flex items-center gap-1">
                  <Book01Icon className="size-5 text-primary" />
                  <span className="text-base font-semibold text-slate-700">
                    {user?.story?.length || 0}
                  </span>
                  <span className="text-sm text-slate-600">works</span>
                </div>
                <RecordIcon className="size-1.5 fill-slate-500 text-slate-500" />
                <div className="flex items-center gap-1">
                  <Users className="size-5 text-primary" />
                  <span className="text-base font-semibold text-slate-700">
                    {user?.followersCount || 0}
                  </span>
                  <span className="text-sm text-slate-600">followers</span>
                </div>
                <RecordIcon className="size-1.5 fill-slate-500 text-slate-500" />
                <div className="flex items-center gap-1">
                  <Users className="size-5 text-primary" />
                  <span className="text-base font-semibold text-slate-700">
                    {user?.followingCount || 0}
                  </span>
                  <span className="text-sm text-slate-600">following</span>
                </div>

                {user?.readCount && (
                  <div className="flex items-center gap-1">
                    <BookOpen className="size-5 text-primary" />
                    <span className="text-base font-semibold text-slate-700">
                      {user?.readCount}
                    </span>
                    <span className="text-sm text-slate-600">reads</span>
                  </div>
                )}

                {user?.likesCount && (
                  <div className="flex items-center gap-1">
                    <Heart className="size-5 text-primary" />
                    <span className="text-base font-semibold text-slate-700">
                      {user?.likesCount}
                    </span>
                    <span className="text-sm text-slate-600">likes</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons - Desktop */}
            <div className="hidden md:flex md:flex-col md:gap-3">
              <Button
                variant="default"
                size="sm"
                icon={Users}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                Follow
              </Button>
              <Button
                icon={BellIcon}
                variant="outline"
                size="sm"
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                Subscribe
              </Button>
            </div>
          </div>

          {/* Action Buttons - Mobile */}
          <div className="flex mt-8 gap-3 md:hidden justify-center">
            <Button
              icon={Users}
              variant="default"
              size="sm"
              className="gap-2 shadow-md hover:shadow-lg transition-shadow"
            >
              Follow
            </Button>
            <Button
              icon={BellIcon}
              variant="outline"
              size="sm"
              className="gap-2 shadow-sm hover:shadow-md transition-shadow"
            >
              Subscribe
            </Button>
          </div>

          {/* Secondary Action Bar */}
          <div className="mt-8 flex flex-wrap gap-3 justify-center sm:justify-start">
            {socialLinks.map(
              (social) =>
                social.url && (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    icon={social.icon}
                    className="rounded-full gap-2 bg-slate-50 hover:bg-slate-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {social.name}
                  </Button>
                )
            )}
            <div className="">
              <ShareDialog title="" />
            </div>
            {user?.isCurrentUser && (
              <Button
                variant="outline"
                size="sm"
                icon={Edit2}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="works" className="mt-8 w-full">
          <div className="w-full border-b border-border">
            <TabsList className="w-full sm:w-min h-12 overflow-hidden justify-start bg-transparent p-0 shadow-none rounded-none overflow-x-auto">
              <TabsTrigger
                value="works"
                className="shadow-none px-6 h-12 rounded-none data-[state=active]:text-primary data-[state=active]:font-medium before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:scale-x-0 before:bg-primary before:transition-transform data-[state=active]:before:scale-x-100 relative hover:text-primary/80"
              >
                <div className="flex items-center gap-2">
                  <Book01Icon className="size-4" />
                  <span>Works</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="reading-list"
                className="shadow-none px-6 h-12 rounded-none data-[state=active]:text-primary data-[state=active]:font-medium before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:scale-x-0 before:bg-primary before:transition-transform data-[state=active]:before:scale-x-100 relative hover:text-primary/80"
              >
                <div className="flex items-center gap-2">
                  <Bookshelf01Icon className="size-4" />
                  <span>Reading List</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="shadow-none px-6 h-12 rounded-none data-[state=active]:text-primary data-[state=active]:font-medium before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-full before:scale-x-0 before:bg-primary before:transition-transform data-[state=active]:before:scale-x-100 relative hover:text-primary/80"
              >
                <div className="flex items-center gap-2">
                  <Users className="size-4" />
                  <span>About</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="works" className="mt-8">
            <UserCreations />
          </TabsContent>
          <TabsContent value="reading-list" className="mt-8">
            <UserReadingList />
          </TabsContent>
          <TabsContent value="about" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-8 rounded-xl shadow-sm border border-border">
                <h3 className="text-xl font-extrabold mb-6 text-slate-800">
                  Author Information
                </h3>
                {/* Author info content */}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileMetaData;
