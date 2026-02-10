"use client";

import Link from "next/link";
import { cn } from "~/lib/utils";
import { kanit } from "~/utils/font";

const Logo = () => {
  return (
    <div>
      <Link href="/">
        <span
          className={cn(
            "font-black text-primary/90 text-xl sm:text-2xl cursor-pointer select-none",
            kanit.className,
          )}
        >
          [theReadora]
        </span>
      </Link>
    </div>
  );
};

export default Logo;
