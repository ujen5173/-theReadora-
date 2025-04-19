import { cn } from "~/lib/utils";
import { kanit } from "~/utils/font";

const Logo = () => {
  return (
    <div>
      <span
        className={cn("text-2xl font-black text-primary/90", kanit.className)}
      >
        [theReadora]
      </span>
    </div>
  );
};

export default Logo;
