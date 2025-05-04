"use client";
import { PlusSignIcon, Search01Icon } from "hugeicons-react";
import { Edit3Icon, Loader2, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";
import { useReadinglistStore } from "~/store/useReadinglist";
import { api } from "~/trpc/react";

type Story = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  author: {
    name: string;
    username: string;
  };
};

const ReadingListDialog = ({
  onSuccess,
  children,
}: {
  onSuccess?: () => void;
  children?: React.ReactNode;
}) => {
  const { open, setOpen, edit, edited, setEdited } = useReadinglistStore();

  const [data, setData] = useState({
    title: edited?.title ?? "Untitled",
    description: edited?.description ?? "",
    stories: edited?.stories ?? [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Story[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { mutateAsync, status: createStatus } = api.list.create.useMutation();
  const { mutateAsync: updateMutate, status: updateStatus } =
    api.list.update.useMutation();
  const searchQuery$ = api.story.simpleSearch.useQuery(
    { query: searchQuery },
    {
      enabled: searchQuery.length > 0,
    }
  );

  // Update data if list changes
  useEffect(() => {
    if (edited) {
      setData({
        title: edited.title,
        description: edited.description,
        stories: edited.stories,
      });
    } else {
      setData({
        title: "Untitled",
        description: "",
        stories: [],
      });
    }
  }, [edited, open]);

  // React to search results change
  useEffect(() => {
    if (searchQuery$.data) {
      setSearchResults(searchQuery$.data);
      setIsSearching(false);
    }
  }, [searchQuery$.data]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddStory = (story: Story) => {
    const storyId = story.id;
    const storyExists = data.stories.some((s) =>
      typeof s === "string" ? s === storyId : s.id === storyId
    );

    if (!storyExists) {
      setData((prev) => ({
        ...prev,
        stories: [...prev.stories, { id: story.id, title: story.title }],
      }));
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveStory = (storyId: string) => {
    setData((prev) => ({
      ...prev,
      stories: prev.stories.filter((s) =>
        typeof s === "string" ? s !== storyId : s.id !== storyId
      ),
    }));
  };

  const handleCreate = async () => {
    try {
      const initialStories = data.stories.map((s) =>
        typeof s === "string" ? s : s.id
      );

      if (edited) {
        await updateMutate({
          title: data.title || "Untitled",
          description: data.description,
          initialStories,
          id: edited.id,
        });
        toast("Reading list updated successfully");
      } else {
        await mutateAsync({
          title: data.title || "Untitled",
          description: data.description,
          initialStories,
        });
        toast("Reading list created successfully");
      }

      setOpen(false);
      setEdited(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      toast("Failed to save reading list");
    }
  };

  const isLoading = createStatus === "pending" || updateStatus === "pending";

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setEdited(null);
        }
      }}
    >
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            onClick={() => {
              setOpen(true);
              setEdited(null); // Reset on new creation
            }}
            icon={PlusSignIcon}
            className="mt-4"
          >
            Create Reading List
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-slate-800">
            {edited ? (
              `Edit ${data.title || "Untitled"} Reading List`
            ) : (
              <>
                <span className="text-primary underline underline-offset-2">
                  {data.title.trim() || "Untitled"}
                </span>{" "}
                Reading list
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={data.title}
              maxLength={20}
              onChange={(e) =>
                setData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Premium Reads"
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) =>
                setData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="col-span-3"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initial_stories" className="text-right">
              Add Stories
            </Label>
            <Input
              id="initial_stories"
              icon={isSearching ? Loader2 : Search01Icon}
              iconPlacement="right"
              iconStyle={
                isSearching
                  ? "animate-spin size-4 text-slate-700"
                  : "size-4 text-slate-700"
              }
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />

            {searchResults.length > 0 && (
              <ScrollArea className="h-48 rounded-md border">
                <div className="space-y-2">
                  {searchResults.map((story) => (
                    <div
                      key={story.id}
                      className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-md cursor-pointer"
                      onClick={() => handleAddStory(story)}
                    >
                      <div className="h-12 w-12 relative rounded-sm overflow-hidden flex-shrink-0">
                        <Image
                          src={story.thumbnail || "/placeholder.png"}
                          alt={story.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-800 truncate">
                          {story.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          by {story.author.name}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddStory(story);
                        }}
                        disabled={isLoading}
                      >
                        <PlusSignIcon className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {data.stories.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Selected Stories ({data.stories.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.stories.map((story) => (
                    <Badge
                      key={typeof story === "string" ? story : story.id}
                      variant="secondary"
                      className="flex items-center gap-1 py-1 px-2"
                    >
                      <span className="truncate max-w-[150px]">
                        {typeof story === "string" ? story : story.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-slate-200 rounded-full"
                        onClick={() =>
                          handleRemoveStory(
                            typeof story === "string" ? story : story.id
                          )
                        }
                        disabled={isLoading}
                      >
                        <X className="size-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            icon={isLoading ? Loader2 : edited ? Edit3Icon : PlusSignIcon}
            iconStyle={isLoading ? "animate-spin" : ""}
            disabled={isLoading}
            onClick={handleCreate}
          >
            {isLoading
              ? edited
                ? "Updating..."
                : "Creating..."
              : edited
              ? "Update"
              : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReadingListDialog;
