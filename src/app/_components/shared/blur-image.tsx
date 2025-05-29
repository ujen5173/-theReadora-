"use client";

import type { ImageProps } from "next/image";
import Image from "next/image";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { cardHeight, cardWidth } from "~/utils/constants";
import { getBlurUrl } from "~/utils/uploadToCloudinary";

interface BlurImageProps extends Omit<ImageProps, "src"> {
  src: string;
  className?: string;
  alt: string;
  width?: number;
  height?: number;
  size?: string;
}

const BlurImage = ({
  src,
  className,
  alt = "Image",
  width,
  height,
  size,
  ...props
}: BlurImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const blurredImage = getBlurUrl(src);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Blur placeholder */}
      <Image
        className={cn(
          "absolute inset-0 aspect-[1/1.6] w-full rounded-lg object-cover transition-opacity duration-300",
          isLoaded ? "opacity-0" : "opacity-100",
          size
        )}
        src={blurredImage}
        alt={`${alt} (blur)`}
        width={width ?? cardWidth}
        height={height ?? cardHeight}
        priority
      />

      {/* Main image */}
      <Image
        className={cn(
          "aspect-[1/1.6] w-full rounded-lg object-cover",
          className
        )}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        width={width ?? cardWidth}
        height={height ?? cardHeight}
        priority
        {...props}
      />
    </div>
  );
};

export default BlurImage;
