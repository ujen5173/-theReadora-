"use client";
import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { ArrowRight, X } from "lucide-react";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";
import { GENRES, LANGUAGES } from "~/utils/constants";
import type { BookMetadataType } from "~/app/write/page";

const BookMetadata = ({
  onSubmit,
}: {
  onSubmit: (metadata: BookMetadataType) => void;
}) => {
  const [metadata, setMetadata] = useState<BookMetadataType>({
    title: "",
    synopsis: "",
    tags: [],
    genre: "Romance",
    isMature: false,
    hasAiContent: false,
    language: "English",
    isLGBTQContent: false,
  });

  const [currentTag, setCurrentTag] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (metadata.tags.length >= 5) {
        toast.error("Maximum 5 tags allowed");
        return;
      }
      if (metadata.tags.includes(currentTag.trim())) {
        toast.error("Tag already exists");
        return;
      }
      setMetadata((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
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
    <div className="flex-1 space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="title"
          className="text-base text-slate-700 font-semibold inline-block"
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
          className=" w-full bg-white"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="synopsis"
          className="text-base text-slate-700 font-semibold inline-block"
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
          className=" w-full bg-white h-32"
        />
      </div>

      <div className="space-y-2  w-full">
        <Label
          htmlFor="tags"
          className="text-base text-slate-700 font-semibold inline-block"
        >
          Tags
        </Label>
        <p className="text-sm text-muted-foreground">
          Add up to 5 tags to help readers find your book
        </p>
        <div className="space-y-2">
          <Input
            id="tags"
            placeholder="Enter tags and press Enter"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleAddTag}
            disabled={metadata.tags.length >= 5}
            className="bg-white"
          />
          <div className="flex flex-wrap gap-2">
            {metadata.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-2 py-1 text-sm border border-border text-slate-700"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2  w-full">
        <div className="flex-1 space-y-2">
          <Label
            htmlFor="genre"
            className="text-base text-slate-700 font-semibold inline-block"
          >
            Genre
          </Label>
          <Select
            value={metadata.genre}
            onValueChange={(value) =>
              setMetadata((prev) => ({
                ...prev,
                genre: value as (typeof GENRES)[number],
              }))
            }
          >
            <SelectTrigger id="genre" className="w-full bg-white">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              {GENRES.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-2">
          <Label
            htmlFor="language"
            className="text-base text-slate-700 font-semibold inline-block"
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

      <div className="space-y-4  w-full">
        <h3 className="text-base text-slate-700 font-semibold inline-block">
          Content Information
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm text-slate-700 font-semibold">
                Mature Content
              </Label>
              <p className="text-sm text-muted-foreground">
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
              <Label className="text-sm text-slate-700 font-semibold">
                LGBTQ+ Content
              </Label>
              <p className="text-sm text-muted-foreground">
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
              <Label className="text-sm text-slate-700 font-semibold">
                AI-Generated Content
              </Label>
              <p className="text-sm text-muted-foreground">
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

      <div className="pt-4">
        <Button
          onClick={() => onSubmit(metadata)}
          icon={ArrowRight}
          effect={"expandIcon"}
          iconPlacement="right"
        >
          Continue to Story Editor
        </Button>
      </div>
    </div>
  );
};

export default BookMetadata;
