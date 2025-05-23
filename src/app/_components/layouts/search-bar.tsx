"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import useKeyPress from "~/app/hooks/use-key-press";
import { Input } from "~/components/ui/input";

const SearchBar = ({ size = "lg" }: { size?: "md" | "lg" | "sm" }) => {
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
          placeholder="Search..."
          icon={KbdIcon}
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

const KbdIcon = () => (
  <kbd className="pointer-events-none hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[12px] font-medium opacity-100 sm:flex">
    <span className="text-xs mt-1">⌘</span> + K
  </kbd>
);
