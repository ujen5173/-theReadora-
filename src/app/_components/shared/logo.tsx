import { cn } from "~/lib/utils";
import { kanit } from "~/utils/font";

const Logo = () => {
  return (
    <div>
      <span
        className={cn("text-2xl font-black text-destructive", kanit.className)}
      >
        [theReadora]
      </span>
    </div>
  );
};

export default Logo;
