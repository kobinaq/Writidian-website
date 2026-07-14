"use client";

import { Button } from "@/components/ui/button";
import { useSound } from "@/components/sound-context";
import { SITE } from "@/lib/constants";
import { useEffect, useState } from "react";

function SoundIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        <path d="m23 9-6 6" />
        <path d="m17 9 6 6" />
      </svg>
    );
  }
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

export function Nav() {
  const { muted, toggleMuted, setMuted, unlockAudio } = useSound();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setMuted(true);
  }, [setMuted]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-ink/10 bg-paper/95 backdrop-blur-md"
          : "border-transparent bg-paper/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-8">
        <a
          href="#top"
          className="font-serif text-lg tracking-tight text-ink sm:text-2xl"
        >
          {SITE.name}
        </a>
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              void unlockAudio();
              toggleMuted();
            }}
            aria-pressed={muted}
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            className="flex h-10 w-10 items-center justify-center text-ink-muted transition-colors hover:text-ink"
          >
            <SoundIcon muted={muted} />
          </button>
          <Button className="!px-4 !py-2 !text-[11px] uppercase tracking-[0.12em] sm:!px-5 sm:!text-xs">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
}
