"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import * as React from "react";

import { cn } from "~/lib/utils";

interface CheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  variant?: "default" | "primary";
  size?: "default" | "sm" | "lg";
}

function Checkbox({
  className,
  variant = "default",
  size = "default",
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:text-primary-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        // Size variations
        size === "default" && "size-4",
        size === "sm" && "size-3.5",
        size === "lg" && "size-5",
        // Variant styles
        variant === "default" &&
          "data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:data-[state=checked]:bg-primary",
        variant === "primary" &&
          "border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:data-[state=checked]:bg-primary",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon
          className={cn(
            size === "default" && "size-3.5",
            size === "sm" && "size-3",
            size === "lg" && "size-4"
          )}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
