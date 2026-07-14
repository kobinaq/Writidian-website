"use client";

import { Button } from "@/components/ui/button";
import { useSound } from "@/components/sound-context";
import { SITE } from "@/lib/constants";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function Nav() {
  const { muted, toggleMuted, setMuted } = useSound();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setMuted(true);
  }, [setMuted]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5">
      <motion.div
        animate={{
          y: scrolled ? 0 : 4,
          backgroundColor: scrolled
            ? "rgba(247, 244, 238, 0.92)"
            : "rgba(247, 244, 238, 0.72)",
        }}
        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        className="pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-full border border-ink/10 px-4 py-2 shadow-[0_12px_40px_-20px_rgba(14,12,9,0.35)] backdrop-blur-md sm:px-5"
      >
        <a
          href="#top"
          className="font-serif text-lg tracking-tight text-ink sm:text-xl"
        >
          {SITE.name}
        </a>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMuted}
            aria-pressed={muted}
            aria-label={muted ? "Unmute sanctuary sound" : "Mute sanctuary sound"}
            className="rounded-full border border-gold/35 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-ink-muted transition-colors hover:border-gold hover:text-ink sm:text-xs"
          >
            {muted ? "Sound off" : "Sound on"}
          </button>
          <Button className="!px-5 !py-2 !text-xs uppercase tracking-[0.12em]">
            Sign up
          </Button>
        </div>
      </motion.div>
    </header>
  );
}
