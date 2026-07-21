"use client";

import { COPY, EDITOR_SAMPLE_LINES } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

registerGsap();

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

      gsap.set(frame, { opacity: 0, y: 72, scale: 0.97 });
      gsap.set(lines, { opacity: 0, x: -14 });

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
        tl.to(line, { opacity: 1, x: 0, duration: 0.25 }, 0.22 + i * 0.16);
      });
    },
    { dependencies: [] },
  );

  return (
    <section
      id="editor"
      ref={rootRef}
      className="bg-paper px-5 py-20 sm:px-8 sm:py-44"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-eyebrow text-[15px] tracking-wide text-gold">
          The writing room
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl font-serif text-[clamp(1.85rem,6vw,4rem)] leading-[1.08] tracking-tight text-ink">
          {COPY.editorTitle}
        </h2>
        <p className="font-accent mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
          {COPY.editorBody}
        </p>

        <div
          ref={frameRef}
          className="mt-10 overflow-hidden rounded-[1.25rem] border border-ink/10 bg-[#f7f4ee] text-left shadow-[0_36px_70px_-40px_rgba(14,12,9,0.45)] will-change-transform sm:mt-14"
        >
          <div className="flex items-center gap-3 border-b border-ink/10 px-3 py-2.5 sm:px-4 sm:py-3">
            <span className="font-accent shrink-0 text-sm text-ink-muted">
              29:51
            </span>

            <div className="mx-auto flex min-w-0 max-w-[14rem] items-center gap-2 rounded-full border border-ink/8 bg-paper px-2.5 py-1.5 shadow-sm sm:max-w-[18rem]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-espresso text-[10px] text-paper">
                ♪
              </span>
              <div className="min-w-0 text-left">
                <p className="truncate text-[11px] font-medium text-ink">
                  Amber Drift
                </p>
                <p className="truncate text-[9px] uppercase tracking-[0.12em] text-ink-muted">
                  Genres · Romance
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <span
                aria-hidden
                className="hidden h-8 w-8 items-center justify-center rounded-md text-ink-muted sm:flex"
              >
                ↓
              </span>
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-md bg-espresso text-paper"
              >
                ◉
              </span>
              <span className="rounded-md bg-espresso px-3 py-1.5 text-xs font-medium text-paper">
                Done
              </span>
            </div>
          </div>

          <div className="px-5 pt-5 sm:px-9 sm:pt-7">
            <p className="font-serif text-lg text-ink-muted/65 sm:text-xl">
              Untitled Draft...
            </p>
            <div className="mt-3 h-px bg-ink/10" />
          </div>

          <div
            ref={linesRef}
            className="space-y-4 px-5 py-6 sm:space-y-5 sm:px-9 sm:py-10"
          >
            {EDITOR_SAMPLE_LINES.map((line) => (
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

          <div className="flex justify-center border-t border-ink/10 px-4 py-3.5">
            <div className="flex items-center gap-4 rounded-full bg-paper px-5 py-2 text-ink-muted shadow-sm ring-1 ring-ink/10 sm:gap-5">
              {["B", "I", "U"].map((t) => (
                <span key={t} className="text-sm font-semibold text-ink/80">
                  {t}
                </span>
              ))}
              <span aria-hidden className="h-4 w-px bg-ink/15" />
              <span className="h-3.5 w-3.5 rounded-full bg-ink" />
              <span aria-hidden className="text-xs">
                ≡
              </span>
              <span aria-hidden className="text-xs">
                ▤
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
