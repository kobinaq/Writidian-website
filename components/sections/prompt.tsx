"use client";

import { COPY } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

registerGsap();

export function Prompt() {
  const rootRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const card = cardRef.current;
      const copy = copyRef.current;
      if (!root || !card || !copy) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        gsap.set([card, copy], { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set(card, { scale: 0.78, opacity: 0.2, y: 100, rotate: -2 });
      gsap.set(copy, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          end: "center center",
          scrub: 1.05,
        },
      });

      tl.to(copy, { opacity: 1, y: 0, duration: 0.35 }, 0).to(
        card,
        { scale: 1, opacity: 1, y: 0, rotate: 0, duration: 0.55 },
        0.05,
      );
    },
    { dependencies: [] },
  );

  return (
    <section
      id="prompt"
      ref={rootRef}
      className="relative overflow-hidden bg-surface/60 px-5 py-20 sm:px-8 sm:py-48"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div ref={copyRef}>
          <h2 className="font-serif text-[clamp(1.85rem,6vw,4rem)] leading-[1.08] tracking-tight text-ink">
            {COPY.promptTitle}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
            {COPY.promptBody}
          </p>
        </div>

        <article
          ref={cardRef}
          className="relative rounded-2xl border border-gold/50 bg-paper px-5 py-10 text-center shadow-[0_40px_80px_-40px_rgba(14,12,9,0.45)] will-change-transform sm:rounded-[1.75rem] sm:px-14 sm:py-20"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-[2.5rem] bg-gold/10 blur-2xl"
          />
          <p className="text-xs uppercase tracking-[0.28em] text-gold">
            {COPY.samplePromptLabel}
          </p>
          <p className="mt-8 font-serif text-[clamp(1.35rem,2.8vw,2rem)] leading-relaxed text-ink">
            {COPY.samplePrompt}
          </p>
          <div className="mt-8 inline-flex rounded-full border border-gold px-6 py-2.5 text-sm tracking-wide text-gold sm:mt-12 sm:px-7 sm:py-3">
            Write Now
          </div>
        </article>
      </div>
    </section>
  );
}
