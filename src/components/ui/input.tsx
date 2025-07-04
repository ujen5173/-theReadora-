import * as React from "react";

import { cn } from "~/lib/utils";

type InputSize = "sm" | "md";

type InputProps = {
  size?: InputSize;
  iconStyle?: string;
  icon?: React.ElementType;
  iconPlacement?: "left" | "right";
  type?: string;
  className?: string;
} & Omit<React.ComponentProps<"input">, "size">;

const sizeClasses = {
  sm: "h-8 px-2 text-sm",
  md: "h-9 px-3 text-sm md:text-base lg:text-base",
};

function Input({
  className,
  type,
  iconStyle = "",
  icon: Icon,
  iconPlacement = "left",
  size = "md", // Default size
  ...props
}: InputProps) {
  return (
    <div className="relative w-full flex items-center">
      {Icon && iconPlacement === "left" && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon className={iconStyle} />
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          sizeClasses[size], // Apply size classes
          Icon && iconPlacement === "left" ? "pl-9" : "",
          Icon && iconPlacement === "right" ? "pr-9" : "",
          className
        )}
        {...props}
      />
      {Icon && iconPlacement === "right" && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Icon className={iconStyle} />
        </div>
      )}
    </div>
  );
}

export { Input };
