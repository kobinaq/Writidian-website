"use client";

import { COPY, SAMPLE_PROMPTS } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

registerGsap();

export function Prompt() {
  const rootRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const stack = stackRef.current;
      const copy = copyRef.current;
      if (!root || !stack || !copy) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const cards = gsap.utils.toArray<HTMLElement>(
        stack.querySelectorAll("[data-prompt-card]"),
      );

      if (reduced) {
        gsap.set([copy, ...cards], { opacity: 1, y: 0, rotate: 0 });
        return;
      }

      gsap.set(copy, { opacity: 0, y: 40 });
      cards.forEach((card, i) => {
        gsap.set(card, {
          opacity: i === 0 ? 1 : 0.7,
          y: i * 14,
          rotate: (i - 1) * 2.2,
          scale: 1 - i * 0.03,
          zIndex: cards.length - i,
        });
      });

      const enter = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          end: "center center",
          scrub: 1.05,
        },
      });

      enter.to(copy, { opacity: 1, y: 0, duration: 0.35 }, 0);
      cards.forEach((card, i) => {
        enter.to(
          card,
          {
            opacity: i === 0 ? 1 : 0.7,
            y: i * 12,
            rotate: (i - 1) * 1.8,
            scale: 1 - i * 0.025,
            duration: 0.45,
          },
          0.05 + i * 0.04,
        );
      });

      const shuffle = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.6,
        scrollTrigger: {
          trigger: root,
          start: "top 60%",
          end: "bottom 20%",
          toggleActions: "play pause resume pause",
        },
      });

      SAMPLE_PROMPTS.forEach((_, i) => {
        const next = (i + 1) % SAMPLE_PROMPTS.length;
        shuffle.to({}, {
          duration: 2,
          onStart: () => {
            cards.forEach((card, ci) => {
              const order = (ci - next + cards.length) % cards.length;
              gsap.to(card, {
                y: order * 12,
                rotate: (order - 1) * 1.8,
                scale: 1 - order * 0.025,
                opacity: order === 0 ? 1 : 0.65,
                zIndex: cards.length - order,
                duration: 0.75,
                ease: "power2.inOut",
              });
            });
          },
        });
      });
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
        <div
          ref={stackRef}
          className="relative order-2 mx-auto h-[22rem] w-full max-w-md sm:h-[26rem] lg:order-1"
        >
          {SAMPLE_PROMPTS.map((prompt) => (
            <article
              key={prompt.label}
              data-prompt-card
              className="absolute inset-x-0 top-0 rounded-2xl bg-paper px-5 py-10 text-center shadow-[0_28px_60px_-36px_rgba(14,12,9,0.4)] will-change-transform sm:rounded-[1.5rem] sm:px-10 sm:py-14"
            >
              <p className="font-eyebrow text-[14px] tracking-wide text-gold">
                {prompt.label}
              </p>
              <p className="mt-6 font-serif text-[clamp(1.15rem,2.4vw,1.7rem)] leading-relaxed text-ink">
                {prompt.text}
              </p>
              <div className="mt-8 inline-flex rounded-full border border-ink/15 px-6 py-2.5 text-sm tracking-wide text-ink sm:mt-10">
                Write Now
              </div>
            </article>
          ))}
        </div>

        <div ref={copyRef} className="order-1 lg:order-2">
          <h2 className="font-serif text-[clamp(1.85rem,6vw,4rem)] leading-[1.08] tracking-tight text-ink">
            {COPY.promptTitle}
          </h2>
          <p className="font-accent mt-4 max-w-md text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
            {COPY.promptBody}
          </p>
        </div>
      </div>
    </section>
  );
}
