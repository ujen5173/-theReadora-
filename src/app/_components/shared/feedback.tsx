"use client";
import { Loading03Icon } from "hugeicons-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useUserStore } from "~/store/userStore";
import { api } from "~/trpc/react";

const FeedbackDialog = ({ children }: { children: ReactNode }) => {
  const { user } = useUserStore();
  const [email, setEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user]);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { status, mutateAsync } = api.email.sendFeedbackEmail.useMutation();

  const [from, setFrom] = useState<
    "github" | "twitter" | "none" | "google" | "friends" | undefined
  >();

  const [open, setOpen] = useState(false);

  const onSubmit = async () => {
    const response = inputRef.current?.value;

    if (!response) return;

    await mutateAsync({
      feedback: response,
      userEmail: email ?? user?.email,
      from,
    });

    toast("Feedback submitted successfully.");
    setOpen(false);
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

          <div className="">
            <Label htmlFor="email" className="mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
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
          <Button
            disabled={status === "pending"}
            onClick={onSubmit}
            icon={status === "pending" ? Loading03Icon : undefined}
            iconStyle={status === "pending" ? "animate-spin" : ""}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
