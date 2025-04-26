"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import Logo from "../../shared/logo";
import UserHeader from "../../user/user-header";
import { useNewChapterStore } from "~/store/useNewChapter";

const StoryEditorHeader = () => {
  const { isAutoSaving, wordCount, title, setTitle } = useNewChapterStore();

  return (
    <div className="border-b sticky top-0 z-50 bg-white shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Link href="/write">
            <Button
              variant="outline"
              size="icon"
              icon={ChevronLeft}
              className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            />
          </Link>
          <Input
            placeholder="Untitled Chapter"
            size="lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-[300px] font-semibold"
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        </div>

        <div>
          <Logo />
        </div>

        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="text-sm text-muted-foreground px-3 py-1.5 border border-border rounded-md bg-slate-100 dark:bg-slate-800">
            {isAutoSaving ? "Saving..." : "Saved"} · {wordCount} words
          </span>

          <UserHeader />
        </div>
      </div>
    </div>
  );
};

export default StoryEditorHeader;
