"use client";

import {
  AnalyticsUpIcon,
  Bookshelf01Icon,
  UserCircle02Icon,
} from "hugeicons-react";
import { BookIcon, CreditCard, LogOut, SettingsIcon } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useAuthSync } from "~/hooks/useAuthSync";
import { useUserStore } from "~/store/userStore";

export default function UserHeader() {
  useAuthSync();

  const { user, isLoading } = useUserStore();

  const router = useRouter();

  // For hydration shit
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full" />;
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button size="sm" asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer rounded-full">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={40}
              height={40}
              priority
              sizes="40px"
              className="rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-medium">
              {user.name?.[0] || "U"}
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <div className="p-2 space-y-1">
            <h2 className="text-sm font-bold text-slate-700">{user.name}</h2>
            <p className="text-xs font-medium text-slate-600">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer px-3 py-2">
              <UserCircle02Icon className="w-5 h-5 stroke-2 text-slate-800" />
              Profile
            </DropdownMenuItem>
          </Link>
          <Link href="/creations">
            <DropdownMenuItem className="cursor-pointer px-3 py-2">
              <BookIcon className="w-4 h-4 text-slate-800" />
              My Creations
            </DropdownMenuItem>
          </Link>
          <Link href="/analytics">
            <DropdownMenuItem className="cursor-pointer px-3 py-2">
              <AnalyticsUpIcon className="w-4 h-4 text-slate-800" />
              Analytics
            </DropdownMenuItem>
          </Link>
          <Link href={"/premium"}>
            <DropdownMenuItem className="cursor-pointer px-3 py-2">
              <CreditCard className="w-4 h-4 text-slate-800" />
              Billing
            </DropdownMenuItem>
          </Link>
          <Link href="/reading-list">
            <DropdownMenuItem className="cursor-pointer px-3 py-2">
              <Bookshelf01Icon className="w-4 h-4 text-slate-800" />
              Reading List
            </DropdownMenuItem>
          </Link>
          <Link href="/settings">
            <DropdownMenuItem className="cursor-pointer px-3 py-2">
              <SettingsIcon className="w-4 h-4 text-slate-800" />
              Settings
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="cursor-pointer px-3 py-2 text-red-500 hover:bg-destructive/10 hover:text-red-600"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
