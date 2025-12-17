"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { PinIcon } from "hugeicons-react";
import {
  ArrowUpDown,
  BarChart3,
  Edit3,
  MoreHorizontal,
  Pin,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Spinner } from "~/components/ui/spinner";
import { api } from "~/trpc/react";
import { formatSmartDate } from "~/utils/helpers";

export type WorkRow = {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  storyStatus: "DRAFT" | "PUBLISHED" | "PRIVATE" | "SCHEDULED" | "DELETED";
  views: number;
  likes: number;
  reviews: number;
  averageRating: number;
  pin: boolean;
  createdAt: Date;
};

const storyStatusVariant = (p: WorkRow["storyStatus"]) => {
  switch (p) {
    case "PUBLISHED":
      return "default";
    case "PRIVATE":
      return "secondary";
    case "DRAFT":
      return "outline";
    case "SCHEDULED":
      return "destructive";
    case "DELETED":
      return "secondary";
    default:
      return "secondary";
  }
};

export const columns: ColumnDef<WorkRow>[] = [
  {
    header: "SN",
    size: 150,
    cell: ({ row }) => {
      return row.original.pin ? (
        <div className="">
          <PinIcon className="mr-2 size-4 text-slate-700" />
        </div>
      ) : (
        <span>{row.index + 1}</span>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Work",
    size: 300,
    cell: ({ row }) => {
      const data = row.original;

      return (
        <div className="flex items-center gap-3">
          <div className="relative aspect-[1.04/1.7] z-0 w-14 rounded-sm ring-1 ring-border bg-muted">
            {data.pin && (
              <div className="absolute -top-2 -right-4 z-10">
                <PinIcon className="mr-2 size-4 text-red-500" />
              </div>
            )}
            <Image
              src={data.thumbnail || "/default-profile.png"}
              alt={data.title}
              fill
              className="object-cover"
              sizes="100px"
            />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="truncate text-base font-semibold text-slate-700">
              {data.title}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {formatSmartDate(data.createdAt)}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "storyStatus",
    header: "Status",
    size: 120,
    cell: ({ row }) => {
      const p = row.getValue("storyStatus") as WorkRow["storyStatus"];
      return (
        <Badge variant={storyStatusVariant(p)} className="uppercase">
          {p.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "views",
    size: 100,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="px-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Views
        <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="tabular-nums">
        {Intl.NumberFormat().format(row.getValue("views"))}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "likes",
    size: 100,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="px-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Likes
        <ArrowUpDown className="ml-1 size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="tabular-nums">
        {Intl.NumberFormat().format(row.getValue("likes"))}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "reviews",
    size: 100,
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="px-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Reviews
        <ArrowUpDown className="ml-1 size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="tabular-nums">
        {Intl.NumberFormat().format(row.getValue("reviews"))}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Actions",
    size: 100,
    cell: ({ row }) => {
      const { mutateAsync, status } = api.story.pinToTop.useMutation();

      const work = row.original;

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{work.title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/write?editId=${work.id}`}>
                <Edit3 className="mr-2 size-4" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/studio/analytics?story=${work.id}`}>
                <BarChart3 className="mr-2 size-4" /> View insights
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/studio/reviews?story=${work.id}`}>
                <Star className="mr-2 size-4" /> Reviews
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await mutateAsync({
                  storyId: work.id,
                  status: !work.pin,
                });
              }}
            >
              {status === "pending" ? (
                <Spinner />
              ) : (
                <Pin className="mr-2 size-4" />
              )}{" "}
              {work.pin ? "Unpin from top" : "Pin to top"}
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                //  TODO: delete handler 
              }}
            >
              <Trash2 className="mr-2 size-4" /> Delete
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
