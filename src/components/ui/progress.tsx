"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const progressVariants = cva("relative w-full overflow-hidden rounded-full", {
  variants: {
    variant: {
      default: "bg-primary/20",
      secondary: "bg-secondary/20",
      destructive: "bg-destructive/20",
      success: "bg-green-500/20",
      warning: "bg-yellow-500/20",
      info: "bg-blue-500/20",
    },
    size: {
      sm: "h-1",
      default: "h-2",
      lg: "h-3",
      xl: "h-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const progressIndicatorVariants = cva("h-full w-full flex-1 transition-all", {
  variants: {
    variant: {
      default: "bg-primary",
      secondary: "bg-secondary",
      destructive: "bg-destructive",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      info: "bg-blue-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  value?: number;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, size, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    data-slot="progress"
    className={cn(progressVariants({ variant, size }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn(progressIndicatorVariants({ variant }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
