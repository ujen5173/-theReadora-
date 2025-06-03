"use client";
import { Book01Icon, Bookshelf01Icon, RecordIcon } from "hugeicons-react";
import { CalendarDays, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { env } from "~/env";
import { useUserProfileStore } from "~/store/userProfileStore";
import { useUserStore } from "~/store/userStore";
import { formatDate } from "~/utils/helpers";
import BlurImage from "../../shared/blur-image";
import FollowButton from "../../shared/follow-button";
import ShareDialog from "../../shared/share-dialog";
import UserCreations from "./user-creations";
import UserReadingList from "./user-reading-list";

const ProfileMetaData = () => {
  const { user: author } = useUserProfileStore();
  const [user, setUser] = useState(author);
  const { user: loggedInUser } = useUserStore();

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
      <div className="mx-auto max-w-[1540px] pb-16 sm:px-4">
        <div className="relative pt-16 pb-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="flex justify-center sm:justify-start">
              <div className="relative p-1 rounded-full bg-gradient-to-r from-primary to-primary/80 overflow-hidden">
                <div className="absolute w-36 h-36 inset-1 rounded-full bg-white" />

                <div className="relative w-36 h-36 rounded-full bg-white border-[3px] border-white shadow-lg overflow-hidden">
                  <BlurImage
                    src={user?.image ?? "/default-profile.png"}
                    alt={user?.name ?? "User Profile Image"}
                    width={160}
                    height={160}
                    className="size-36 rounded-full"
                    size="size-36"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 mt-2 space-y-6">
              <div className="text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-700 tracking-tight">
                    {user?.name}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-slate-600">
                  <span
                    className="font-medium cursor-pointer text-slate-700"
                    onClick={() => {
                      navigator.clipboard.writeText(`${user?.username}`);
                      toast.success("Username copied!");
                    }}
                  >
                    @{user?.username}
                  </span>

                  <RecordIcon className="size-1.5 fill-slate-500 text-slate-500" />
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4" />
                    Joined {formatDate(new Date(user?.createdAt ?? ""))}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
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
              {author?.id === loggedInUser?.id ? (
                <Button variant={"outline"} asChild>
                  <Link href="/settings">Edit Profile</Link>
                </Button>
              ) : (
                <FollowButton
                  followingTo={{
                    id: author?.id,
                    name: author?.name,
                  }}
                />
              )}
            </div>
          </div>

          {/* Action Buttons - Mobile */}
          <div className="flex mt-8 gap-3 md:hidden justify-center">
            {author?.id === loggedInUser?.id ? (
              <Button variant={"outline"} asChild>
                <Link href="/settings">Edit Profile</Link>
              </Button>
            ) : (
              <FollowButton
                followingTo={{
                  id: author?.id,
                  name: author?.name,
                }}
              />
            )}
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
                url={`${env.NEXT_PUBLIC_APP_URL}/profile?user=${
                  user?.username ?? ""
                }`}
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
            </TabsList>
          </div>

          <TabsContent value="works">
            <UserCreations />
          </TabsContent>
          <TabsContent value="reading-list" className="mt-8 px-4">
            <UserReadingList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileMetaData;
