"use client";

import { COPY } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

registerGsap();

const LINES = [
  "The forest held its breath before she spoke.",
  "Somewhere beyond the ridge, a river kept writing.",
];

export function Editor() {
  const rootRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const frame = frameRef.current;
      const linesBox = linesRef.current;
      if (!root || !frame || !linesBox) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const lines = gsap.utils.toArray<HTMLElement>(
        linesBox.querySelectorAll("[data-line]"),
      );

      if (reduced) {
        gsap.set(frame, { opacity: 1, y: 0, scale: 1 });
        gsap.set(lines, { opacity: 1, x: 0 });
        return;
      }

      gsap.set(frame, { opacity: 0, y: 80, scale: 0.96 });
      gsap.set(lines, { opacity: 0, x: -16 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 65%",
          end: "bottom 55%",
          scrub: 1.05,
        },
      });

      tl.to(frame, { opacity: 1, y: 0, scale: 1, duration: 0.4 }, 0);
      lines.forEach((line, i) => {
        tl.to(line, { opacity: 1, x: 0, duration: 0.25 }, 0.2 + i * 0.18);
      });
    },
    { dependencies: [] },
  );

  return (
    <section
      id="editor"
      ref={rootRef}
      className="bg-paper px-5 py-20 sm:px-8 sm:py-48"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-[clamp(1.85rem,6vw,4rem)] leading-[1.08] tracking-tight text-ink">
          {COPY.editorTitle}
        </h2>
        <p className="font-accent mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
          {COPY.editorBody}
        </p>

        <div
          ref={frameRef}
          className="mt-10 overflow-hidden rounded-2xl border border-ink/10 bg-[#f7f4ee] text-left shadow-[0_30px_60px_-35px_rgba(14,12,9,0.4)] will-change-transform sm:mt-14 sm:rounded-[1.25rem]"
        >
          {/* App editor chrome */}
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3 sm:px-5">
            <span className="font-accent text-sm text-ink-muted">29:59</span>
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-md text-ink-muted"
                title="Download draft"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 3v12" strokeLinecap="round" />
                  <path d="m7 11 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 21h14" strokeLinecap="round" />
                </svg>
              </span>
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-md bg-espresso text-paper"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 14v-2a9 9 0 0 1 18 0v2" strokeLinecap="round" />
                  <path d="M21 16a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Z" />
                  <path d="M3 16a2 2 0 0 0 2 2h1v-5H5a2 2 0 0 0-2 2Z" />
                </svg>
              </span>
              <span className="rounded-md bg-espresso px-3 py-1.5 text-xs font-medium text-paper">
                Done
              </span>
            </div>
          </div>

          <div className="px-4 pt-5 sm:px-8 sm:pt-7">
            <p className="font-serif text-lg text-ink-muted/70 sm:text-xl">
              Untitled Draft...
            </p>
            <div className="mt-3 h-px bg-ink/10" />
          </div>

          <div ref={linesRef} className="space-y-4 px-4 py-6 sm:space-y-5 sm:px-8 sm:py-10">
            {LINES.map((line) => (
              <p
                key={line}
                data-line
                className="font-serif text-lg leading-relaxed text-ink sm:text-2xl"
              >
                {line}
              </p>
            ))}
            <p className="font-serif text-lg text-ink-muted sm:text-2xl">
              <span className="inline-block h-[1.1em] w-0.5 animate-pulse bg-gold align-middle" />
            </p>
          </div>

          <div className="flex justify-center border-t border-ink/10 px-4 py-3 sm:py-4">
            <div className="flex items-center gap-4 rounded-full bg-paper px-5 py-2 text-ink-muted shadow-sm ring-1 ring-ink/10 sm:gap-5">
              {["B", "I", "U"].map((t) => (
                <span key={t} className="text-sm font-semibold">
                  {t}
                </span>
              ))}
              <span aria-hidden className="h-4 w-px bg-ink/15" />
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink" />
              <span aria-hidden className="text-xs">☰</span>
              <span aria-hidden className="text-xs">⊞</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
