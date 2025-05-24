"use client";
import { ArrowRight, Loader2, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import type { BookMetadataType } from "~/app/write/wrapper";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { LANGUAGES } from "~/utils/constants";
import { GENRES } from "~/utils/genre";

const MAX_TAGS = 15;

const BookMetadata = ({
  editData,
  status,
  onSubmit,
}: {
  editData: BookMetadataType | null;
  status: "idle" | "success" | "error" | "pending";
  onSubmit: (metadata: BookMetadataType) => void;
}) => {
  const [metadata, setMetadata] = useState<BookMetadataType>(
    editData || {
      title: "",
      synopsis: "",
      tags: [],
      genre: "",
      isMature: false,
      hasAiContent: false,
      language: "English",
      isLGBTQContent: false,
    }
  );

  const [currentTag, setCurrentTag] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();

      const tagsToAdd = currentTag
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      if (metadata.tags.length + tagsToAdd.length > MAX_TAGS) {
        toast.error(`Maximum ${MAX_TAGS} tags allowed`);
        return;
      }

      const newTags = tagsToAdd.filter((tag) => !metadata.tags.includes(tag));

      if (newTags.length > 0) {
        setMetadata((prev) => ({
          ...prev,
          tags: [...new Set([...prev.tags, ...newTags])],
        }));
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setMetadata((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <div className="flex-1 space-y-4 sm:space-y-6">
      <div className="space-y-1.5 sm:space-y-2">
        <Label
          htmlFor="title"
          className="text-sm sm:text-base text-slate-700 font-semibold inline-block"
        >
          Book Title
        </Label>
        <Input
          id="title"
          placeholder="Enter your book title"
          value={metadata.title}
          onChange={(e) =>
            setMetadata((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full bg-white"
        />
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label
          htmlFor="synopsis"
          className="text-sm sm:text-base text-slate-700 font-semibold inline-block"
        >
          Synopsis
        </Label>
        <Textarea
          id="synopsis"
          placeholder="Write a compelling synopsis for your book..."
          value={metadata.synopsis}
          onChange={(e) =>
            setMetadata((prev) => ({ ...prev, synopsis: e.target.value }))
          }
          className="w-full bg-white h-32 sm:h-64"
        />
      </div>

      <div className="space-y-1.5 sm:space-y-2 w-full">
        <Label
          htmlFor="tags"
          className="text-sm sm:text-base text-slate-700 font-semibold inline-block"
        >
          Tags
        </Label>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Add up to {MAX_TAGS} tags to help readers find your book
        </p>
        <div className="space-y-1.5 sm:space-y-2">
          <Input
            id="tags"
            placeholder="Enter tags and press Enter"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleAddTag}
            disabled={metadata.tags.length >= MAX_TAGS}
            className="bg-white"
          />
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {metadata.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm border border-border text-slate-700"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1.5 sm:ml-2 hover:text-destructive"
                >
                  <X className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
        <div className="flex-1 space-y-1.5 sm:space-y-2">
          <Label
            htmlFor="genre"
            className="text-sm sm:text-base text-slate-700 font-semibold inline-block"
          >
            Genre
          </Label>
          <Select
            value={metadata.genre ?? undefined}
            onValueChange={(value) =>
              setMetadata((prev) => ({
                ...prev,
                genre: value as (typeof GENRES)[number]["slug"],
              }))
            }
          >
            <SelectTrigger id="genre" className="w-full bg-white">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] sm:max-h-96 overflow-y-auto">
              {GENRES.map((genre) => (
                <SelectItem key={genre.name} value={genre.slug}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-1.5 sm:space-y-2">
          <Label
            htmlFor="language"
            className="text-sm sm:text-base text-slate-700 font-semibold inline-block"
          >
            Language
          </Label>
          <Select
            value={metadata.language}
            onValueChange={(value) =>
              setMetadata((prev) => ({
                ...prev,
                language: value as (typeof LANGUAGES)[number]["name"],
              }))
            }
          >
            <SelectTrigger id="language" className="w-full bg-white">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.name} value={lang.name}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 w-full">
        <h3 className="text-sm sm:text-base text-slate-700 font-semibold inline-block">
          Content Information
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs sm:text-sm text-slate-700 font-semibold">
                Mature Content
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                This book contains mature themes or content
              </p>
            </div>
            <Switch
              checked={metadata.isMature}
              onCheckedChange={(checked) =>
                setMetadata((prev) => ({ ...prev, isMature: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs sm:text-sm text-slate-700 font-semibold">
                LGBTQ+ Content
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                This book contains LGBTQ+ themes or characters
              </p>
            </div>
            <Switch
              checked={metadata.isLGBTQContent}
              onCheckedChange={(checked) =>
                setMetadata((prev) => ({ ...prev, isLGBTQContent: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs sm:text-sm text-slate-700 font-semibold">
                AI-Generated Content
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
                This book contains AI-generated content
              </p>
            </div>
            <Switch
              checked={metadata.hasAiContent}
              onCheckedChange={(checked) =>
                setMetadata((prev) => ({
                  ...prev,
                  hasAiContent: checked,
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="pt-3 sm:pt-4">
        <Button
          onClick={() => onSubmit(metadata)}
          icon={ArrowRight}
          effect={status === "pending" ? undefined : "expandIcon"}
          iconPlacement="right"
          disabled={status === "pending"}
          className="w-full sm:w-auto"
        >
          {status === "pending" ? (
            <>
              <Loader2 className="size-3.5 sm:size-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : !!editData ? (
            "Update the story Information"
          ) : (
            "Continue to Story Editor"
          )}
        </Button>
      </div>
    </div>
  );
};

export default BookMetadata;
