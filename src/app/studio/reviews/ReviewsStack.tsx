import { format } from "date-fns";
import {
  Bookshelf01Icon,
  Comment01Icon,
  InboxCheckIcon,
  PinIcon,
  StarIcon,
} from "hugeicons-react";
import {
  BookOpenIcon,
  CalendarIcon,
  Dot,
  HeartIcon,
  MoreHorizontalIcon,
  ReplyIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BlurImage from "~/app/_components/shared/blur-image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { formatDate } from "~/utils/helpers";

type ReviewItem = {
  id: string;
  rating: number;
  review: string | null;
  createdAt: Date;
  repliesCount: number;
  likesCount: number;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  story: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
  };
};

const ReviewsStack = ({ reviews }: { reviews: ReviewItem[] }) => {
  const [selectedStories, setSelectedStories] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [sorting, setSorting] = useState<
    "ALL" | "MOST_LIKED" | "LATEST" | "OLDEST"
  >("ALL");
  const [date, setDate] = useState<Date>();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select>
            <SelectTrigger className="bg-white w-[150px]">
              <SelectValue
                placeholder="Sort Reviews"
                className="text-slate-800"
              />
            </SelectTrigger>
            <SelectContent>
              {[
                {
                  id: 1,
                  label: "All Reviews",
                  value: "ALL",
                },
                {
                  id: 2,
                  label: "Most Liked",
                  value: "MOST_LIKED",
                },
                {
                  id: 3,
                  label: "Latest",
                  value: "LATEST",
                },
                {
                  id: 4,
                  label: "Oldest",
                  value: "OLDEST",
                },
              ].map((item) => (
                <SelectItem value={item.value} key={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="bg-white w-[150px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem
                  value={n.toString()}
                  key={n}
                  className="flex items-center gap-2"
                >
                  <div className="flex">
                    {Array.from({ length: n }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-48 flex items-center justify-start gap-2 text-slate-600"
              >
                <Bookshelf01Icon className="w-4 h-4 text-slate-600" />
                Choose Stories
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-3 space-y-2">
              <Input
                placeholder="Search stories..."
                className="mb-2"
                size="sm"
              />
              <div className="max-h-48 overflow-y-auto space-y-1">
                {[
                  "The Lost Chapter",
                  "Midnight City",
                  "Winds of Fire",
                  "Echoes of Time",
                ].map((story) => (
                  <div
                    key={story}
                    className="flex items-center gap-2 p-1 rounded-md hover:bg-muted/60 cursor-pointer"
                  >
                    <span className="text-sm">{story}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[260px] justify-start text-left font-normal text-slate-600"
              >
                <CalendarIcon className="w-4 h-4 text-slate-600" />
                {date ? format(date, "PPP") : <span>Choose a date range</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-72">
          <Input
            className="bg-white"
            placeholder="Search through keywords..."
          />
        </div>
      </div>

      <ScrollArea className="max-h-[80dvh] bg-white border border-border rounded-md w-full">
        <div className="space-y-4 p-4 flex flex-col justify-center">
          {reviews.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-border last:border-0 pb-4 last:pb-0 flex gap-6 relative border-0"
            >
              <div className="flex-1">
                <div className="relative pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
                        <AvatarImage
                          src={comment.user.image ?? undefined}
                          alt={comment.user.name ?? "Reviewer"}
                        />
                        <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                          {(comment.user.name ?? "?")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-1">
                        <Link
                          href={`/profile?user=${
                            comment.user.username ?? "user"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">
                              {comment.user.name ?? "Unknown"}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0.5"
                            >
                              @{comment.user.username ?? "user"}
                            </Badge>
                          </div>
                        </Link>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpenIcon className="h-3.5 w-3.5" />
                            {formatDate(new Date(comment.createdAt))}
                          </span>
                          <Dot />
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-foreground">
                              {comment.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="min-h-[52px]">
                    <p className="text-foreground leading-relaxed">
                      {comment.review}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 gap-2 rounded-full px-3 text-muted-foreground transition-all hover:bg-red-50 hover:text-red-600"
                      >
                        <HeartIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {comment.likesCount}
                        </span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 gap-2 rounded-full px-3 text-muted-foreground transition-all hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Comment01Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {comment.repliesCount}
                        </span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 gap-2 rounded-full px-3 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                      >
                        <ReplyIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Reply</span>
                      </Button>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0 text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-full p-0 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="p-0">
                          <Button
                            size="sm"
                            variant={"outline"}
                            className="w-full"
                          >
                            <PinIcon className="h-4 w-4" />
                            Pin Review
                          </Button>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Link href={`/story/${comment.story.slug}`} target="_blank">
                  <Tooltip>
                    <TooltipTrigger>
                      <div role="button" className="cursor-pointer mt-2 w-24">
                        <BlurImage
                          src={comment.story.thumbnail ?? ""}
                          alt={comment.story.title}
                          className="aspect-[1/1.6] w-full rounded-sm border border-gray-200 flex-shrink-0"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent variant="outline">
                      <p>{comment.story.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </Link>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia className="border border-border" variant="icon">
                  <InboxCheckIcon />
                </EmptyMedia>
                <EmptyTitle>No reviews yet</EmptyTitle>
                <EmptyDescription>
                  Your stories haven’t caught any reviews yet. Keep writing,
                  improving, and getting your stories out there.{" "}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </ScrollArea>
    </>
  );
};

export default ReviewsStack;
