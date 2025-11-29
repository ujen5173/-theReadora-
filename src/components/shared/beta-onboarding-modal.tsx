"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export function BetaOnboardingModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("beta-onboarding-seen");
    if (!hasSeenModal || hasSeenModal === "false") {
      const timer = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("beta-onboarding-seen", "true");
  };

  const handleAction = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[500px] border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl"
        onEscapeKeyDown={handleClose}
      >
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-black tracking-tight text-slate-700">
              Beta Notice — Demo Content Ahead
            </DialogTitle>
          </div>
          <DialogDescription className="text-base leading-relaxed text-muted-foreground">
            This is an early release of{" "}
            <span className="text-primary font-semibold">TheReadora</span>. Most
            stories you see are demo content. If you want real exposure as a new
            or rising author, head to the <Link href="/write">Originals</Link>{" "}
            page. Our platform is here to promote new authors and push their
            content to the world.
            <br />
            <br />
            View comparison of{" "}
            <Link
              href="/comparision"
              onClick={handleClose}
              className="text-primary font-semibold underline"
            >
              Readora vs Others
            </Link>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2 sm:flex-row sm:justify-start">
          <Button
            asChild
            size="lg"
            className="font-semibold shadow-md transition-all hover:scale-105"
            onClick={handleAction}
          >
            <Link href="/write">Start creating</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary/20 hover:bg-primary/5 hover:text-primary"
            onClick={handleAction}
          >
            <Link href="/search?content-type=original">View originals</Link>
          </Button>
        </div>

        <DialogFooter className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row sm:justify-between w-full border-t pt-4 mt-2">
          <p className="text-xs text-muted-foreground">
            Feedback:{" "}
            <a
              href="mailto:support@thereadora.com"
              className="hover:underline hover:text-foreground transition-colors"
            >
              readora5173@gmail.com
            </a>
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
          >
            Not now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
