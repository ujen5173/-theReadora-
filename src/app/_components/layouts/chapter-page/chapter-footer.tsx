"use client";
import {
  BookOpenIcon,
  DotIcon,
  Flag,
  MessageSquareIcon,
  StarIcon,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useChapterStore } from "~/store/useChapter";
import { useUserStore } from "~/store/userStore";
import ShareDialog from "../../shared/share-dialog";

const ChapterFooter = () => {
  const { user } = useUserStore();
  const { chapter } = useChapterStore();

  return (
    <section className="bg-slate-100 w-full">
      <div className="max-w-4xl py-8 border-x border-b border-border bg-white px-6 mx-auto">
        {/* Actions Bar */}
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Button icon={BookOpenIcon} variant="default" size="sm">
              Add to Reading List
            </Button>
            <Button icon={StarIcon} variant="secondary" size="sm">
              Vote
            </Button>
          </div>
          <div>
            <ShareDialog
              title={chapter?.title || ""}
              url={`${process.env.NEXT_PUBLIC_APP_URL}/chapter/${chapter?.id}`}
            />
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-800">Comments</h2>
              <span className="text-sm text-slate-500">12</span>
            </div>
          </div>

          {/* Comment Input */}
          <div className="flex items-start gap-3 pb-8 border-b border-border">
            <div className="shrink-0">
              <Image
                src={user?.image || ""}
                alt="Your avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="flex-1">
              <Textarea
                placeholder="Share your thoughts..."
                className="min-h-20 w-full px-4 py-3 text-sm text-slate-700 bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              />
              <div className="mt-2 flex justify-end">
                <Button variant="default" size="sm">
                  Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {/* Comment Item */}
            {[1, 32, 2].map((_, i) => (
              <div key={i} className="flex gap-3 group">
                <div className="mt-2 shrink-0">
                  <Image
                    src={user?.image || ""}
                    alt="User avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-slate-700">
                        John Doe
                      </span>
                      <DotIcon className="size-4 fill-slate-500 text-slate-500" />
                      <span className="text-xs text-slate-500">
                        2 hours ago
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    This chapter was amazing! The character development is
                    really starting to shine through, and I can't wait to see
                    what happens next.
                  </p>

                  {/* Redesigned interaction buttons */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      {/* Vote buttons group */}
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="size-4 text-slate-400 group-hover:text-primary transition-colors" />
                          <span className="text-xs font-medium text-slate-500 group-hover:text-primary transition-colors">
                            24
                          </span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ThumbsDown className="size-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                        </Button>
                      </div>

                      <div className="h-8 border-l border-border" />

                      {/* Reply button */}
                      <Button variant="link" size="sm">
                        <MessageSquareIcon className="size-4 text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="text-xs font-medium text-slate-500 group-hover:text-primary transition-colors">
                          Reply
                        </span>
                      </Button>
                    </div>

                    {/* Report button - appears on hover */}
                    <Button
                      variant={"ghost"}
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 ml-auto"
                    >
                      <Flag className="size-4 text-slate-400 hover:text-red-500 transition-colors" />
                    </Button>
                  </div>

                  {/* Optional: Reply input area when reply is clicked */}
                  {false && (
                    <div className="mt-3 flex items-start gap-2">
                      <Image
                        src={user?.image || ""}
                        alt="Your avatar"
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <textarea
                          placeholder="Write a reply..."
                          className="w-full px-3 py-2 text-sm text-slate-700 bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                          rows={2}
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            Cancel
                          </Button>
                          <Button variant="default" size="sm">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Load More */}
            <div className="pt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-primary"
              >
                Show More Comments
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChapterFooter;
