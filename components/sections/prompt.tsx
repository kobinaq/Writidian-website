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
  const orderRef = useRef(0);

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

      const layout = (front: number, animate: boolean) => {
        cards.forEach((card, ci) => {
          const order = (ci - front + cards.length) % cards.length;
          const props = {
            y: order * 18,
            x: order * 10,
            rotate: order === 0 ? -1.5 : order === 1 ? 2.5 : -3.5,
            scale: 1 - order * 0.045,
            opacity: order === 0 ? 1 : order === 1 ? 0.92 : 0.78,
            zIndex: cards.length - order,
            filter: order === 0 ? "none" : `brightness(${1 - order * 0.06})`,
          };
          if (animate) {
            gsap.to(card, { ...props, duration: 0.85, ease: "power2.inOut" });
          } else {
            gsap.set(card, props);
          }
        });
      };

      if (reduced) {
        gsap.set(copy, { opacity: 1, y: 0 });
        layout(0, false);
        return;
      }

      gsap.set(copy, { opacity: 0, y: 36 });
      layout(0, false);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 72%",
            end: "center 55%",
            scrub: 1,
          },
        })
        .to(copy, { opacity: 1, y: 0, duration: 0.4 }, 0);

      const shuffle = gsap.timeline({
        repeat: -1,
        repeatDelay: 2.2,
        scrollTrigger: {
          trigger: root,
          start: "top 55%",
          end: "bottom 25%",
          toggleActions: "play pause resume pause",
        },
      });

      shuffle.to({}, {
        duration: 2.4,
        onStart: () => {
          orderRef.current = (orderRef.current + 1) % cards.length;
          layout(orderRef.current, true);
        },
      });
    },
    { dependencies: [] },
  );

  return (
    <section
      id="prompt"
      ref={rootRef}
      className="relative overflow-hidden bg-surface/50 px-5 py-20 sm:px-8 sm:py-44"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div
          ref={stackRef}
          className="relative order-2 mx-auto h-[24rem] w-full max-w-md sm:h-[28rem] lg:order-1"
        >
          {SAMPLE_PROMPTS.map((prompt, i) => (
            <article
              key={prompt.label}
              data-prompt-card
              className="absolute inset-x-0 top-0 rounded-[1.35rem] bg-white px-6 py-11 text-center shadow-[0_32px_70px_-40px_rgba(14,12,9,0.5)] will-change-transform sm:px-11 sm:py-14"
              style={{ zIndex: SAMPLE_PROMPTS.length - i }}
            >
              <p className="font-eyebrow text-[14px] tracking-wide text-gold">
                {prompt.label}
              </p>
              <p className="mt-7 font-serif text-[clamp(1.2rem,2.5vw,1.75rem)] leading-relaxed text-ink">
                {prompt.text}
              </p>
              <div className="mt-9 inline-flex rounded-full border border-ink/12 px-7 py-2.5 text-sm tracking-wide text-ink">
                Write Now
              </div>
            </article>
          ))}
        </div>

        <div ref={copyRef} className="order-1 lg:order-2">
          <p className="font-eyebrow text-[15px] tracking-wide text-gold">
            Daily prompts
          </p>
          <h2 className="mt-3 font-serif text-[clamp(1.85rem,6vw,4rem)] leading-[1.08] tracking-tight text-ink">
            {COPY.promptTitle}
          </h2>
          <p className="font-accent mt-5 max-w-md text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
            {COPY.promptBody}
          </p>
        </div>
      </div>
    </section>
  );
}
