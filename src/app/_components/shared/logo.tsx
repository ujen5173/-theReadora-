import Link from "next/link";
import { cn } from "~/lib/utils";
import { kanit } from "~/utils/font";

const Logo = () => {
  return (
    <div>
      <Link href="/">
        <span
          className={cn(
            "cursor-pointer select-none text-2xl font-black text-primary/90",
            kanit.className
          )}
        >
          [theReadora]
        </span>
      </Link>
    </div>
  );
};

export default Logo;
