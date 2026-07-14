"use client";

import { COPY } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

registerGsap();

const LINES = [
  "The forest held its breath before she spoke.",
  "Somewhere beyond the ridge, a river kept writing.",
  "She stayed with the sentence until it told the truth.",
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

      gsap.set(frame, { opacity: 0, y: 80, scale: 0.94 });
      gsap.set(lines, { opacity: 0, x: -24 });

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
      <div className="mx-auto max-w-4xl">
        <h2 className="max-w-2xl font-serif text-[clamp(1.85rem,6vw,4rem)] leading-[1.08] tracking-tight text-ink">
          {COPY.editorTitle}
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
          {COPY.editorBody}
        </p>

        <div
          ref={frameRef}
          className="mt-10 overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-[0_30px_60px_-35px_rgba(14,12,9,0.4)] will-change-transform sm:mt-14 sm:rounded-[1.75rem]"
        >
          <div className="flex items-center gap-2 border-b border-ink/10 px-4 py-3 sm:px-5 sm:py-4">
            <span className="h-2.5 w-2.5 rounded-full bg-gold" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
            <span className="ml-2 text-[10px] uppercase tracking-[0.18em] text-ink-muted sm:ml-3 sm:text-[11px]">
              Untitled draft
            </span>
            <span className="ml-auto hidden text-[11px] uppercase tracking-[0.14em] text-gold sm:inline">
              Focus · 24 min
            </span>
          </div>
          <div ref={linesRef} className="space-y-4 px-4 py-8 sm:space-y-5 sm:px-10 sm:py-14">
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
        </div>
      </div>
    </section>
  );
}
