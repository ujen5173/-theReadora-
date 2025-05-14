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
import { useEffect, useState } from "react";
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

  const { user, isLoading } = useUserStore();

  const router = useRouter();

  // For hydration shit
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="h-7 w-7 sm:h-10 sm:w-10 animate-pulse bg-gray-200 rounded-full" />
    );
  }

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
        <Button size="sm" asChild className="sm:hidden text-xs w-full">
          <Link href="/auth/signin" className="w-full">
            Sign In
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2">
          <div className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={40}
                height={40}
                priority
                sizes="(max-width: 640px) 28px, 40px"
                className="rounded-full object-cover w-7 h-7 sm:w-10 sm:h-10"
              />
            ) : (
              <div className="h-7 w-7 sm:h-10 sm:w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-medium text-xs sm:text-base">
                {user.name?.[0] || "U"}
              </div>
            )}
          </div>
          {fromMobileMenu && (
            <div className="flex items-center gap-2 sm:hidden">
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-700 truncate">
                  {user.name}
                </span>
                <span className="text-xs text-slate-500 truncate">
                  {user.email}
                </span>
              </div>
            </div>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-[280px] sm:w-64 p-0"
          align="end"
          sideOffset={8}
        >
          <div className="p-3 space-y-1 border-b">
            <h2 className="text-sm font-bold text-slate-700 truncate">
              {user.name}
            </h2>
            <p className="text-xs font-medium text-slate-600 truncate">
              {user.email}
            </p>
          </div>
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="p-1">
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer px-2 sm:px-3 py-2 rounded-md">
                  <UserCircle02Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-2 text-slate-800" />
                  <span className="ml-2 text-sm">Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/creations">
                <DropdownMenuItem className="cursor-pointer px-2 sm:px-3 py-2 rounded-md">
                  <BookIcon className="w-4 h-4 text-slate-800" />
                  <span className="ml-2 text-sm">My Creations</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/analytics">
                <DropdownMenuItem className="cursor-pointer px-2 sm:px-3 py-2 rounded-md">
                  <AnalyticsUpIcon className="w-4 h-4 text-slate-800" />
                  <span className="ml-2 text-sm">Analytics</span>
                </DropdownMenuItem>
              </Link>
              <Link href={"/settings?tab=coins"}>
                <DropdownMenuItem className="cursor-pointer px-2 sm:px-3 py-2 rounded-md">
                  <CoinsBitcoinIcon className="w-4 h-4 text-slate-800" />
                  <span className="ml-2 text-sm">My Wallet</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/reading-list">
                <DropdownMenuItem className="cursor-pointer px-2 sm:px-3 py-2 rounded-md">
                  <Bookshelf01Icon className="w-4 h-4 text-slate-800" />
                  <span className="ml-2 text-sm">Reading List</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer px-2 sm:px-3 py-2 rounded-md">
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
              className="cursor-pointer px-2 sm:px-3 py-2 rounded-md text-red-500 hover:bg-destructive/10 hover:text-red-600"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span className="ml-2 text-sm">Sign Out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
