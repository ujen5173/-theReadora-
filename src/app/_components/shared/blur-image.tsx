"use client";

import { CldImage } from "next-cloudinary";
import { useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

const BlurImage = ({
  alt,
  src,
  className,
  style,
  sizes,
  priority,
}: {
  alt: string;
  src: string;
  style?: Record<string, string>;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative aspect-[1/1.6] h-full w-full">
      {isLoading && <Skeleton className="absolute inset-0 animate-pulse" />}
      <CldImage
        width="1200"
        height="700"
        onLoad={() => setIsLoading(false)}
        src={src}
        alt={alt}
        sizes={sizes}
        draggable={false}
        {...style}
        priority={!!priority}
        className={cn(
          "transition-opacity duration-100 rounded-lg",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
      />
    </div>
  );
};

export default BlurImage;
