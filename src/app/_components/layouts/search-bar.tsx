"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import useKeyPress from "~/app/hooks/use-key-press";
import { Input } from "~/components/ui/input";
import { Kbd } from "~/components/ui/kbd";

const SearchBar = ({ size = "md" }: { size?: "md" | "sm" }) => {
  const router = useRouter();
  const ref = useRef<HTMLInputElement | null>(null);

  const handleKeyPress = (): void => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  useKeyPress(handleKeyPress);

  return (
    <div className="relative max-w-80 flex-1">
      <form
        onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => {
          e.preventDefault();
          router.push(`/search?query=${ref?.current?.value}`);
        }}
      >
        <Input
          size={size}
          placeholder="Begin your next chapter..."
          icon={() => <Kbd>Ctrl + K</Kbd>}
          ref={ref}
          className="bg-white w-full"
          autoFocus={false}
          iconPlacement="right"
        />
      </form>
    </div>
  );
};

export default SearchBar;
