import { Loading03Icon } from "hugeicons-react";

import { cn } from "~/lib/utils";

function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof Loading03Icon>) {
  return (
    <Loading03Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
