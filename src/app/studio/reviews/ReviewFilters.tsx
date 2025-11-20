"use client";

import { Bookshelf01Icon, StarIcon } from "hugeicons-react";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { cn } from "~/lib/utils";
import type useReview from "../hooks/useReview";

type ReviewFiltersProps = {
  authorWorkTitle: ReturnType<typeof useReview>["authorWorkTitle"];
  setMetrics: ReturnType<typeof useReview>["setMetrics"];
  applyMetrics: ReturnType<typeof useReview>["applyMetrics"];
  metrics: ReturnType<typeof useReview>["metrics"];
  resetFilters: ReturnType<typeof useReview>["resetFilters"];
};

const ReviewFilters = ({
  authorWorkTitle,
  setMetrics,
  applyMetrics,
  metrics,
  resetFilters,
}: ReviewFiltersProps) => {
  const [open, setOpen] = useState(false);

  const selectedStory = useMemo(
    () => (authorWorkTitle ?? []).find(({ id }) => id === metrics.selectedWork),
    [authorWorkTitle, metrics.selectedWork]
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      applyMetrics();
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={metrics.sorting}
          onValueChange={(e) => {
            setMetrics({
              srt: e as "ALL" | "LATEST" | "OLDEST" | "MOST_LIKED",
            });
          }}
        >
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
        <Select
          value={
            metrics.ratings != null ? metrics.ratings.toString() : undefined
          }
          onValueChange={(e) => {
            setMetrics({
              ratings: +e,
            });
          }}
        >
          <SelectTrigger className="bg-white w-[180px]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((n) => (
              <SelectItem
                value={n.toString()}
                key={n}
                className="flex items-center gap-2"
              >
                <div className="flex items-center">
                  <span className="mr-1">({n}) </span>
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
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {selectedStory ? (
                selectedStory.title
              ) : (
                <>
                  <Bookshelf01Icon className="w-4 h-4 text-slate-600" />
                  Choose Stories
                </>
              )}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search stories..." className="h-9" />
              <CommandList className="max-h-[300px]">
                <CommandEmpty>No story found.</CommandEmpty>
                <CommandGroup>
                  {(authorWorkTitle ?? []).map((framework) => (
                    <CommandItem
                      key={framework.id}
                      value={framework.title}
                      onSelect={(currentValue) => {
                        setMetrics({
                          selected: framework.id,
                        });
                        setOpen(false);
                      }}
                    >
                      {framework.title}
                      <Check
                        className={cn(
                          "ml-auto",
                          metrics.selectedWork === framework.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button onClick={applyMetrics}>Apply Filter</Button>
        <Button onClick={resetFilters} variant="outline">
          Reset Filters
        </Button>
      </div>

      <div className="w-72">
        <Input
          className="bg-white"
          placeholder="Search through keywords..."
          value={metrics.query}
          onChange={(e) => setMetrics({ query: e.target.value })}
          onKeyDown={handleSearchKeyDown}
        />
      </div>
    </>
  );
};

export default ReviewFilters;
