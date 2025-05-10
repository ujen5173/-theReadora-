"use client";
import { Book01Icon, Bookshelf01Icon, RecordIcon } from "hugeicons-react";
import { BellIcon, CalendarDays, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useUserProfileStore } from "~/store/userProfileStore";
import { formatDate } from "~/utils/helpers";
import FollowButton from "../../shared/follow-button";
import ShareDialog from "../../shared/share-dialog";
import UserCreations from "./user-creations";
import UserReadingList from "./user-reading-list";

const ProfileMetaData = () => {
  const { user: author } = useUserProfileStore();
  const [user, setUser] = useState(author);

  useEffect(() => {
    if (author) {
      setUser({
        ...author,
      });
    }
  }, [author]);

  const socialLinks: {
    name: string;
    url: string | null;
    icon: React.ElementType;
  }[] = [
    // { name: "Twitter", url: user?.twitter, icon: <Users className="size-4" /> },
    // { name: "GitHub", url: user?.github, icon: <Users className="size-4" /> },
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
                    className="size-36 rounded-full border-3 border-white shadow-lg"
                    draggable={false}
                  />
                </div>
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
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-slate-600">
                  <span className="font-medium text-slate-700">
                    @{user?.username}
                  </span>
                  <RecordIcon className="size-1.5 fill-slate-500 text-slate-500" />
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    Earth
                    {/* {user?.location || "Nepal"} */}
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
                    {user?.stories?.length || 0}
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
              </div>
            </div>

            {/* Action Buttons - Desktop */}
            <div className="hidden md:flex md:flex-col md:gap-3">
              <FollowButton
                followingTo={{
                  id: author?.id,
                  name: author?.name,
                }}
              />
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

          <div className="mt-6">
            <p className="border-l-4 border-primary/50 text-slate-600 text-base font-medium italic pl-2">
              {user?.bio}
            </p>
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
              <ShareDialog
                title={user?.name ?? ""}
                description="Share this profile"
                url={`https://readora.com/${user?.username ?? ""}`}
              />
            </div>
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
