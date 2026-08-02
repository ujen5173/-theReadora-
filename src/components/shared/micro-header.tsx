"use client";

import { ArrowRight01Icon } from "hugeicons-react";
import Link from "next/link";
import { useState } from "react";

export function MicroHeader() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="z-50 relative bg-[length:200%_auto] bg-gradient-to-r from-rose-500 via-primary to-rose-500 px-4 py-2 font-medium text-white text-sm text-center animate-gradient-flow">
      <div className="flex justify-center items-center gap-2 mx-auto container">
        <span className="hidden sm:inline">
          ✨ The Readora Writing Contest is near!
        </span>
        <span className="sm:hidden">✨ Writing Contest Live!</span>
        <Link
          href="/contest"
          className="group inline-flex items-center gap-1 font-bold decoration-white/50 hover:decoration-white underline underline-offset-2 transition-all"
        >
          Learn more
          <ArrowRight01Icon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="top-1/2 right-4 absolute opacity-70 hover:opacity-100 transition-opacity -translate-y-1/2"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}
