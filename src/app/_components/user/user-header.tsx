"use client";

import {
  AnalyticsUpIcon,
  Bookshelf01Icon,
  CoinsBitcoinIcon,
  UserCircle02Icon,
} from "hugeicons-react";
import { BookIcon, LogOut, SettingsIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useAuthSync } from "~/hooks/useAuthSync";
import { useUserStore } from "~/store/userStore";

export default function UserHeader({
  fromMobileMenu = false,
}: {
  fromMobileMenu?: boolean;
}) {
  useAuthSync();

  const { user } = useUserStore();

  const router = useRouter();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          asChild
          className="hidden sm:inline-flex text-xs sm:text-sm"
        >
          <Link href="/auth/signin">Sign In</Link>
        </Button>
        <Button size="sm" asChild className="sm:hidden w-full text-xs">
          <Link href="/auth/signin" className="w-full">
            Sign In
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full">
            <div className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  priority
                  sizes="(max-width: 640px) 28px, 40px"
                  className="rounded-full size-7 sm:size-10 object-cover"
                />
              ) : (
                <div className="flex justify-center items-center bg-primary/10 rounded-full sm:w-10 sm:h-10 size-7 font-medium text-primary text-xs sm:text-base">
                  {user.name?.[0] || "U"}
                </div>
              )}
            </div>
            {fromMobileMenu && (
              <div className="flex items-center gap-2">
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-slate-700 text-sm truncate">
                    {user.name}
                  </span>
                  <span className="text-slate-500 text-xs truncate">
                    {user.email}
                  </span>
                </div>
              </div>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="p-0 w-[280px] sm:w-64"
            align="end"
            sideOffset={8}
          >
            <div className="space-y-1 p-3 border-b">
              <h2 className="font-bold text-slate-700 text-sm truncate">
                {user.name}
              </h2>
              <p className="font-medium text-slate-600 text-xs truncate">
                {user.email}
              </p>
            </div>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="p-1">
                <Link href="/studio">
                  <DropdownMenuItem className="px-2 sm:px-3 py-2 rounded-md cursor-pointer">
                    <AnalyticsUpIcon className="w-4 h-4 text-slate-800" />
                    <span className="ml-2 text-sm">Studio</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/profile">
                  <DropdownMenuItem className="px-2 sm:px-3 py-2 rounded-md cursor-pointer">
                    <UserCircle02Icon className="stroke-2 w-4 sm:w-5 h-4 sm:h-5 text-slate-800" />
                    <span className="ml-2 text-sm">Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/creations">
                  <DropdownMenuItem className="px-2 sm:px-3 py-2 rounded-md cursor-pointer">
                    <BookIcon className="w-4 h-4 text-slate-800" />
                    <span className="ml-2 text-sm">My Creations</span>
                  </DropdownMenuItem>
                </Link>
                <Link href={"/settings?tab=coins"}>
                  <DropdownMenuItem className="px-2 sm:px-3 py-2 rounded-md cursor-pointer">
                    <CoinsBitcoinIcon className="w-4 h-4 text-slate-800" />
                    <span className="ml-2 text-sm">My Wallet</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/reading-list">
                  <DropdownMenuItem className="px-2 sm:px-3 py-2 rounded-md cursor-pointer">
                    <Bookshelf01Icon className="w-4 h-4 text-slate-800" />
                    <span className="ml-2 text-sm">Reading List</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings">
                  <DropdownMenuItem className="px-2 sm:px-3 py-2 rounded-md cursor-pointer">
                    <SettingsIcon className="w-4 h-4 text-slate-800" />
                    <span className="ml-2 text-sm">Settings</span>
                  </DropdownMenuItem>
                </Link>
              </div>
            </div>
            <div className="p-1 border-t">
              <DropdownMenuItem
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                className="hover:bg-destructive/10 px-2 sm:px-3 py-2 rounded-md text-red-500 hover:text-red-600 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span className="ml-2 text-sm">Sign Out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
