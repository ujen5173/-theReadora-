"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "~/store/userStore";
import { useAuthSync } from "~/hooks/useAuthSync";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Bookmark01Icon, Bookshelf01Icon, UserIcon } from "hugeicons-react";
import { BookIcon, CreditCard, LogOut } from "lucide-react";

export default function UserHeader() {
  useAuthSync();

  const { user, isLoading } = useUserStore();

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
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer px-3 py-2">
              <UserIcon className="w-4 h-4 text-slate-800" />
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer px-3 py-2">
            <BookIcon className="w-4 h-4 text-slate-800" />
            My Creations
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer px-3 py-2">
            <CreditCard className="w-4 h-4 text-slate-800" />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer px-3 py-2">
            <Bookshelf01Icon className="w-4 h-4 text-slate-800" />
            Reading List
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer px-3 py-2">
            <Bookmark01Icon className="w-4 h-4 text-slate-800" />
            Favorites
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer px-3 py-2 text-red-500 hover:bg-destructive/10 hover:text-red-600">
            <LogOut className="w-4 h-4 text-red-500" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
