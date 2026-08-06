"use client";

import { Button } from "@/components/ui/button";
import { useSound } from "@/components/sound-context";
import { SITE } from "@/lib/constants";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#sanctuary", label: "Sanctuary", id: "sanctuary" },
  { href: "/#soundscapes", label: "Sound", id: "soundscapes" },
  { href: "/#prompt", label: "Prompt", id: "prompt" },
  { href: "/#editor", label: "Write", id: "editor" },
] as const;

function SoundIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg
        width="17"
        height="17"
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
      width="17"
      height="17"
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
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setMuted(true);
  }, [setMuted]);

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );

    const onScroll = () => {
      let current: string | null = null;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= window.innerHeight * 0.35) current = el.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="relative z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="relative mx-auto max-w-6xl rounded-sm">
        <div className="flex h-14 items-center justify-between gap-3 px-1 sm:h-16 sm:px-2">
          {/* Wordmark */}
          <a
            href="/"
            className="group relative shrink-0 font-serif text-lg tracking-tight text-ink sm:text-2xl"
          >
            {SITE.name}
            <span
              aria-hidden
              className="absolute -bottom-0.5 left-0 h-px w-[1.1em] origin-left bg-gold transition-transform duration-500 group-hover:scale-x-125"
            />
          </a>

          {/* Reading list — desktop */}
          <nav
            aria-label="Page sections"
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 md:flex lg:gap-8"
          >
            {LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`font-eyebrow group/link relative flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive ? "text-gold" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-1 w-1 rounded-full bg-gold transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {link.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-gold transition-transform duration-300 ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover/link:scale-x-100"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                void unlockAudio();
                toggleMuted();
              }}
              aria-pressed={muted}
              aria-label={muted ? "Unmute sound" : "Mute sound"}
              className={`group relative flex h-10 w-10 items-center justify-center transition-colors duration-300 ${
                muted
                  ? "text-ink-muted hover:text-ink"
                  : "text-gold hover:text-ink"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-sm transition-shadow ${
                  !muted
                    ? "ring-1 ring-gold/40"
                    : "ring-1 ring-transparent group-hover:ring-current/20"
                }`}
              >
                <SoundIcon muted={muted} />
              </span>
              <span className="font-eyebrow pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-sm border border-ink/10 bg-paper px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-ink opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                {muted ? "Sound off" : "Sound on"}
              </span>
            </button>

            <Button
              variant="primary"
              className="!rounded-sm !px-3.5 !py-2 !text-[11px] uppercase tracking-[0.14em] sm:!px-4 sm:!text-xs"
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
