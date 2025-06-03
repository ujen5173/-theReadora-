"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useNewChapterStore } from "~/store/useNewChapter";
import Logo from "../../shared/logo";
import UserHeader from "../../user/user-header";

const StoryEditorHeader = () => {
  const { isAutoSaving, wordCount, title, setTitle } = useNewChapterStore();

  return (
    <div className="border-b sticky top-0 z-50 bg-white shadow-xs">
      <div className="max-w-[1540px] mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Link href="/write">
            <Button
              variant="outline"
              size="icon"
              icon={ChevronLeft}
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            />
          </Link>
          <Input
            placeholder="Untitled Chapter"
            size="md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[200px] sm:w-[300px] font-semibold text-sm sm:text-base"
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        </div>

        <div className="hidden md:block">
          <Logo />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
          <span className="text-xs sm:text-sm text-muted-foreground px-2 sm:px-3 py-1 sm:py-1.5 border border-border rounded-md bg-slate-100 dark:bg-slate-800 whitespace-nowrap">
            {isAutoSaving ? "Saving..." : "Saved"} · {wordCount} words
          </span>

          <UserHeader />
        </div>
      </div>
    </div>
  );
};

export default StoryEditorHeader;
