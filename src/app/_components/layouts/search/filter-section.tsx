"use client";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { Input } from "~/components/ui/input";
import {
  BookOpen,
  Flame,
  Clock,
  TrendingUp,
  Tags,
  Filter,
  Sparkles,
  Image,
  AlertCircle,
  Star,
  Eye,
  Calendar,
  Plus,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import PremiumBanner from "../../shared/premium-banner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { GENRES } from "~/utils/constants";
import { cn } from "~/lib/utils";
import { useFilterStore } from "~/store/useFilter";

const FilterSection = ({
  query,
  genre,
  handleRefetch,
}: {
  query: string;
  genre: string;
  handleRefetch: () => void;
}) => {
  const {
    genre: genreStore,
    sortBy,
    status,
    contentType,
    minChapterCount,
    maxChapterCount,
    minViewsCount,
    maxViewsCount,
    publishedAt,
    tags,
    setQuery,
    setGenre,
    setSortBy,
    setStatus,
    setContentType,
    setChapterCount,
    setViewsCount,
    setPublishedAt,
    setTags,
    resetAll,
    applyFilters,
  } = useFilterStore();

  const [chapterRange, setChapterRange] = useState([0, 100]);
  const [viewRange, setViewRange] = useState([0, 1000000]);
  const [customTag, setCustomTag] = useState("");

  const popularTags = [
    "Fantasy",
    "Romance",
    "Sci-Fi",
    "Mystery",
    "Horror",
    "Adventure",
    "Drama",
    "Action",
    "Comedy",
    "Slice of Life",
  ];

  const sortOptions = [
    { icon: Flame, label: "Hot" },
    { icon: TrendingUp, label: "Popular" },
    { icon: Clock, label: "Latest" },
    { icon: Star, label: "Top Rated" },
  ];

  const handleAddCustomTag = () => {
    if (customTag && !tags.includes(customTag)) {
      setTags([...tags, customTag]);
      setCustomTag("");
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <section className="space-y-4">
      <PremiumBanner />

      <div className="w-full bg-white rounded-lg border border-border">
        {/* Header */}
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="size-5 text-primary" />
              <h3 className="font-semibold text-slate-900">Story Filters</h3>
            </div>
            <Button
              onClick={() => {
                resetAll();
                handleRefetch();
              }}
              variant="ghost"
              size="sm"
              className="text-slate-500"
            >
              Reset All
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Search Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              By Genre
            </Label>
            <div className="relative">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {genreStore
                      ? GENRES.find(
                          (g) => g.toLowerCase() === genreStore.toLowerCase()
                        )
                      : "Select genre"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search genre..." />
                    <CommandList>
                      <CommandEmpty>No genre found.</CommandEmpty>
                      <CommandGroup>
                        {GENRES.map((g) => (
                          <CommandItem
                            key={g}
                            value={g}
                            onSelect={(currentValue) => {
                              setGenre(currentValue);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                genreStore.toLowerCase() === g.toLowerCase()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {g}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Sort By
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.label}
                  variant="outline"
                  size="sm"
                  icon={option.icon}
                  className={cn(
                    "w-full justify-start",
                    sortBy === option.label && "bg-primary text-white"
                  )}
                  onClick={() => {
                    setSortBy(option.label);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Status Section */}
          <div className="border border-border space-y-4 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-sm text-slate-700">Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-4 text-slate-600" />
                  <Label htmlFor="completed" className="text-sm">
                    Completed Only
                  </Label>
                </div>
                <Switch
                  id="completed"
                  checked={status.includes("COMPLETED")}
                  onCheckedChange={(checked) => {
                    setStatus(
                      checked
                        ? [...status, "COMPLETED"]
                        : status.filter((s) => s !== "COMPLETED")
                    );
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-slate-600" />
                  <Label htmlFor="mature" className="text-sm">
                    Mature Content
                  </Label>
                </div>
                <Switch
                  id="mature"
                  checked={status.includes("MATURE")}
                  onCheckedChange={(checked) => {
                    setStatus(
                      checked
                        ? [...status, "MATURE"]
                        : status.filter((s) => s !== "MATURE")
                    );
                  }}
                />
              </div>
            </div>
          </div>

          {/* Content Type Section */}
          <div className="border border-border space-y-4 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-medium text-sm text-slate-700">Content Type</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-slate-600" />
                  <Label htmlFor="ai" className="text-sm">
                    AI Generated
                  </Label>
                </div>
                <Switch
                  id="ai"
                  checked={contentType.includes("AI_GENREATED")}
                  onCheckedChange={(checked) => {
                    setContentType(
                      checked
                        ? [...contentType, "AI_GENREATED"]
                        : contentType.filter((type) => type !== "AI_GENREATED")
                    );
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image className="size-4 text-slate-600" />
                  <Label htmlFor="graphics" className="text-sm">
                    With Graphics
                  </Label>
                </div>
                <Switch
                  id="graphics"
                  checked={contentType.includes("ORIGINAL")}
                  onCheckedChange={(checked) => {
                    setContentType(
                      checked
                        ? [...contentType, "ORIGINAL"]
                        : contentType.filter((type) => type !== "ORIGINAL")
                    );
                  }}
                />
              </div>
            </div>
          </div>

          {/* Metrics Section */}
          <div className="space-y-6">
            {/* Chapter Range */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-slate-600" />
                <Label className="text-sm font-medium">Chapters</Label>
              </div>
              <Slider
                value={chapterRange}
                onValueChange={setChapterRange}
                min={0}
                max={100}
                step={1}
                defaultValue={[minChapterCount, maxChapterCount]}
                onValueCommit={() => {
                  setChapterCount(chapterRange[0] ?? 0, chapterRange[1] ?? 0);
                }}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{chapterRange[0]} chapters</span>
                <span>{chapterRange[1]}+ chapters</span>
              </div>
            </div>

            {/* View Range */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="size-4 text-slate-600" />
                <Label className="text-sm font-medium">View Count</Label>
              </div>
              <Slider
                value={viewRange}
                onValueChange={setViewRange}
                min={0}
                max={1000000}
                step={50000}
                defaultValue={[minViewsCount, maxViewsCount]}
                onValueCommit={() => {
                  setViewsCount(viewRange[0] ?? 0, viewRange[1] ?? 0);
                }}
                className="w-full"
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {viewRange?.[0] ? (viewRange[0] / 1000).toFixed(1) : "0"}K
                </span>
                <span>
                  {viewRange?.[1] ? (viewRange[1] / 1000).toFixed(1) : "0"}K+
                </span>
              </div>
            </div>
          </div>

          {/* Publication Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-slate-600" />
              <Label className="text-sm font-medium">Publication Date</Label>
            </div>
            <Select
              value={publishedAt}
              onValueChange={(value) => {
                setPublishedAt(
                  value as "LAST_WEEK" | "LAST_MONTH" | "LAST_YEAR" | "ALL_TIME"
                );
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tags className="size-4 text-slate-600" />
              <Label className="text-sm font-medium">Tags</Label>
            </div>

            {/* Custom Tag Input */}
            <div className="w-full flex gap-2">
              <Input
                placeholder="Add custom tag..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                className="flex-1"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleAddCustomTag}
                disabled={!customTag}
              >
                <Plus className="size-4" />
              </Button>
            </div>

            {/* Selected and Popular Tags */}
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-lg">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="default"
                  className="cursor-pointer"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                >
                  {tag} ×
                </Badge>
              ))}
              {popularTags
                .filter((tag) => !tags.includes(tag))
                .map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => setTags([...tags, tag])}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        {/* Apply Filters Button - Sticky */}
        <div className="sticky bottom-0 p-4 border-t rounded-b-lg border-slate-200 bg-white">
          <Button
            className="w-full"
            onClick={() => {
              handleRefetch();
            }}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
