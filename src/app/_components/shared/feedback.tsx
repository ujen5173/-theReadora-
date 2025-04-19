"use client";
import { type ReactNode, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import {
  InLoveIcon,
  Loading03Icon,
  NeutralIcon,
  Sad01Icon,
  Sad02Icon,
  SmileIcon,
} from "hugeicons-react";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";

const FeedbackDialog = ({ children }: { children: ReactNode }) => {
  const [selectedEmoji, setSelectedEmoji] = useState<
    "bad" | "good" | "amazing" | "okay" | "terrible"
  >("okay");

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [from, setFrom] = useState<
    "github" | "twitter" | "none" | "google" | "friends" | undefined
  >();

  const [open, setOpen] = useState(false);

  const onSubmit = async () => {
    const response = inputRef.current?.value;

    if (!response || !selectedEmoji) return;

    toast("Feedback submitted successfully.");
  };

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Give Feedback</DialogTitle>
          <DialogDescription>
            What do you think of our website? Let us know your thoughts.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select
            onValueChange={(value) =>
              setFrom(
                value as
                  | "github"
                  | "twitter"
                  | "none"
                  | "google"
                  | "friends"
                  | undefined
              )
            }
          >
            <SelectTrigger className="bg-white w-full">
              <SelectValue placeholder="Where did you hear us?" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                {["github", "twitter", "none", "google", "friends"].map((f) => (
                  <SelectItem key={f} value={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-5 items-center gap-2">
            {["Terrible", "Bad", "Okay", "Good", "Amazing"].map((rating) => (
              <button
                onClick={() =>
                  setSelectedEmoji(
                    rating.toLowerCase() as
                      | "bad"
                      | "good"
                      | "amazing"
                      | "okay"
                      | "terrible"
                  )
                }
                key={rating}
                className={cn(
                  "rounded-md border aspect-square bg-white p-4 transition hover:bg-zinc-100",
                  selectedEmoji === rating.toLowerCase()
                    ? "border-primary/60 bg-primary/10"
                    : "border-border"
                )}
              >
                {rating === "Terrible" ? (
                  <Sad02Icon className={cn("size-8 text-red-600")} />
                ) : rating === "Bad" ? (
                  <Sad01Icon className={cn("size-8 text-orange-600")} />
                ) : rating === "Okay" ? (
                  <NeutralIcon className={cn("size-8 text-yellow-600")} />
                ) : rating === "Good" ? (
                  <SmileIcon className={cn("size-8 text-blue-600")} />
                ) : (
                  <InLoveIcon className={cn("size-8 text-green-600")} />
                )}
              </button>
            ))}
          </div>
          <div className="">
            <Label htmlFor="name" className="mb-2 block">
              Response
            </Label>
            <Textarea
              id="response"
              required
              ref={inputRef}
              placeholder="Your feedback here..."
              className="min-h-20"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button
              disabled={status === "pending"}
              type="button"
              variant={"secondary"}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={status === "pending"} onClick={onSubmit}>
            {status === "pending" ? (
              <Loading03Icon className={cn("animate-spin text-gray-500")} />
            ) : null}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
