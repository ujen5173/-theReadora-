import { cn } from "~/lib/utils";

type KbdProps = React.ComponentProps<"kbd"> & {
  variant?: "normal" | "beta-label";
};

function Kbd({ className, variant = "normal", ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        variant === "normal" &&
          cn(
            "bg-muted text-muted-foreground pointer-events-none inline-flex h-6 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 border border-slate-300 font-sans text-xs font-medium select-none",
            "[&_svg:not([class*='size-'])]:size-3",
            "[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10"
          ),
        variant === "beta-label" &&
          cn(
            "inline-flex h-5 w-fit items-center justify-center rounded-full px-2 select-none font-sans text-[10px] font-semibold tracking-wide",
            "uppercase bg-blue-500/10 text-blue-700 border border-blue-300 dark:text-blue-300 dark:border-blue-400/40"
          ),
        className
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
