"use client";

import { Button } from "@/components/ui/button";
import { useSound } from "@/components/sound-context";
import { SITE } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#sanctuary", label: "Sanctuary", id: "sanctuary" },
  { href: "#soundscapes", label: "Sound", id: "soundscapes" },
  { href: "#prompt", label: "Prompt", id: "prompt" },
  { href: "#editor", label: "Write", id: "editor" },
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
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setMuted(true);
  }, [setMuted]);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const id = window.setTimeout(() => setReady(true), reduce ? 0 : 40);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const sanctuary = document.getElementById("sanctuary");
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );

    const onScroll = () => {
      const y = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
      setScrolled(y > 20);

      // Hide on scroll down, reveal on scroll up (after leaving the top)
      if (y < 48) {
        setHidden(false);
      } else if (y > lastY.current + 6) {
        setHidden(true);
        setMenuOpen(false);
      } else if (y < lastY.current - 6) {
        setHidden(false);
      }
      lastY.current = y;

      // Dark surface while the sanctuary pin fills the viewport
      if (sanctuary) {
        const r = sanctuary.getBoundingClientRect();
        setOnDark(r.top <= 56 && r.bottom > window.innerHeight * 0.45);
      }

      // Active reading-list item
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

  const ink = onDark ? "text-paper" : "text-ink";
  const mutedInk = onDark ? "text-paper/55" : "text-ink-muted";
  const hoverInk = onDark ? "hover:text-paper" : "hover:text-ink";
  const barBg = onDark
    ? scrolled
      ? "bg-espresso/90 border-paper/10"
      : "bg-espresso/55 border-paper/5"
    : scrolled
      ? "bg-paper/92 border-ink/10"
      : "bg-paper/70 border-ink/5";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:px-5 sm:pt-4 ${
        hidden ? "-translate-y-[120%] opacity-0" : "translate-y-0 opacity-100"
      } ${ready ? "" : "translate-y-[-8px] opacity-0"}`}
    >
      <div
        className={`relative mx-auto max-w-6xl overflow-hidden rounded-md border backdrop-blur-md transition-[background-color,border-color,height] duration-300 ${barBg}`}
      >
        <div
          className={`flex items-center justify-between gap-3 px-3 transition-[height] duration-300 sm:px-5 ${
            scrolled ? "h-12 sm:h-[3.25rem]" : "h-14 sm:h-16"
          }`}
        >
          {/* Wordmark */}
          <a
            href="#top"
            className={`group relative shrink-0 font-serif tracking-tight transition-colors duration-300 ${ink} ${
              scrolled ? "text-lg sm:text-xl" : "text-lg sm:text-2xl"
            }`}
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
                  className={`relative rounded-sm text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${
                    isActive ? (onDark ? "text-gold-soft" : "text-gold") : mutedInk
                  } ${hoverInk}`}
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-gold transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
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
              className={`group relative flex h-9 items-center justify-center gap-2 rounded-sm px-2 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${mutedInk} ${hoverInk} ${
                !muted && onDark ? "text-gold-soft" : ""
              } ${!muted && !onDark ? "text-gold" : ""}`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-sm transition-shadow ${
                  !muted
                    ? "ring-1 ring-gold/40"
                    : "ring-1 ring-transparent"
                }`}
              >
                <SoundIcon muted={muted} />
              </span>
              <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-sm border border-ink/10 bg-paper px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-ink opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                {muted ? "Sound off" : "Sound on"}
              </span>
            </button>

            <Button className="!rounded-sm !px-3.5 !py-2 !text-[11px] uppercase tracking-[0.14em] sm:!px-4 sm:!text-xs">
              Begin writing
            </Button>

            {/* Section menu — mobile only */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-sections"
              aria-label={menuOpen ? "Close section menu" : "Open section menu"}
              className={`flex h-9 w-9 items-center justify-center rounded-sm transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:hidden ${mutedInk} ${hoverInk}`}
            >
              <span className="relative flex h-3 w-4 flex-col justify-between" aria-hidden>
                <span
                  className={`h-px w-full bg-current transition-transform duration-300 ${
                    menuOpen ? "translate-y-[5.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-px w-full bg-current transition-opacity duration-300 ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`h-px w-full bg-current transition-transform duration-300 ${
                    menuOpen ? "-translate-y-[5.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Section list panel — mobile only */}
        <div
          id="mobile-sections"
          className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
            menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <nav
            aria-label="Page sections"
            className={`overflow-hidden ${menuOpen ? "" : "pointer-events-none invisible"}`}
          >
            <div
              className={`flex flex-col border-t px-4 py-3 ${
                onDark ? "border-paper/10" : "border-ink/10"
              }`}
            >
              {LINKS.map((link) => {
                const isActive = active === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    tabIndex={menuOpen ? undefined : -1}
                    className={`rounded-sm py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                      isActive
                        ? onDark
                          ? "text-gold-soft"
                          : "text-gold"
                        : mutedInk
                    } ${hoverInk}`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Reading progress hairline */}
        <div
          aria-hidden
          className={`absolute inset-x-0 bottom-0 h-px ${
            onDark ? "bg-paper/10" : "bg-ink/8"
          }`}
        >
          <div
            className="h-full origin-left bg-gold transition-[transform] duration-150 ease-out"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>
    </header>
  );
}
