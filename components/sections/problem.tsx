"use client";

import { COPY } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useMemo, useRef } from "react";

registerGsap();

export function Problem() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const words = useMemo(() => COPY.problemWords.split(" "), []);

  useGSAP(
    () => {
      const root = rootRef.current;
      const pin = pinRef.current;
      if (!root || !pin) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const spans = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll("[data-word]"),
      );
      const leftCharacter = pin.querySelector<HTMLElement>(
        "[data-character='overloaded']",
      );
      const rightCharacter = pin.querySelector<HTMLElement>(
        "[data-character='focused']",
      );
      const followUp = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll("[data-follow-up]"),
      );
      const scribblePaths = gsap.utils.toArray<SVGPathElement>(
        pin.querySelectorAll("[data-scribble-path]"),
      );

      if (reduced) {
        gsap.set(spans, { opacity: 1, y: 0 });
        gsap.set([leftCharacter, rightCharacter], { opacity: 1 });
        gsap.set(followUp, { opacity: 1, y: 0 });
        gsap.set(scribblePaths, { strokeDashoffset: 0 });
        return;
      }

      gsap.set(spans, { opacity: 0.14, y: 18 });
      gsap.set(followUp, { opacity: 0, y: 20 });
      gsap.set([leftCharacter, rightCharacter], { autoAlpha: 0 });

      scribblePaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.0,
          pin: pin,
          anticipatePin: 1,
        },
      });

      // Words land by ~70% of the pin so the purpose lines have room to arrive.
      reveal.to(
        spans,
        {
          opacity: 1,
          y: 0,
          ease: "none",
          duration: 0.12,
          stagger: { each: 0.58 / Math.max(spans.length - 1, 1) },
        },
        0,
      );

      reveal.to(
        followUp,
        {
          opacity: 1,
          y: 0,
          duration: 0.16,
          ease: "power2.out",
          stagger: 0.06,
        },
        0.76,
      );

      const story = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
        },
      });

      story
        .to(leftCharacter, { autoAlpha: 1, duration: 0.15 }, 0)
        .to(
          scribblePaths.filter((_, i) => i < 3),
          { strokeDashoffset: 0, duration: 0.55, ease: "none", stagger: 0.08 },
          0.05,
        )
        .to(rightCharacter, { autoAlpha: 1, duration: 0.15 }, 0.12)
        .to(
          scribblePaths.filter((_, i) => i >= 3),
          { strokeDashoffset: 0, duration: 0.5, ease: "none", stagger: 0.06 },
          0.18,
        );
    },
    { dependencies: [words.length] },
  );

  return (
    <section
      ref={rootRef}
      className="relative h-[170vh] scroll-mt-24 bg-espresso text-paper md:h-[220vh]"
    >
      <div
        ref={pinRef}
        className="relative flex h-[100dvh] flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-24 sm:px-8 sm:pt-28"
      >
        <ProblemCharacters />
        <p className="relative z-10 max-w-5xl text-center font-serif text-[clamp(1.15rem,4.2vw,2.9rem)] leading-[1.3] tracking-tight">
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              data-word
              className="mr-[0.28em] inline-block will-change-transform"
            >
              {word}
            </span>
          ))}
        </p>

        <div className="relative z-10 mt-8 max-w-2xl text-center sm:mt-12">
          <p
            data-follow-up
            className="font-accent text-base leading-relaxed text-paper/75 sm:text-lg"
          >
            {COPY.problemPurpose}
          </p>
          <p
            data-follow-up
            className="font-eyebrow mt-5 text-[11px] uppercase tracking-[0.3em] text-gold-soft sm:mt-7"
          >
            {COPY.problemBridge}
          </p>
        </div>
      </div>
    </section>
  );
}

function ProblemCharacters() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {/* Top-left — tangled noise scribble */}
      <div
        data-character="overloaded"
        className="problem-character absolute left-[2vw] top-[14vh] w-[min(38vw,220px)] sm:left-[4vw] lg:left-[8vw]"
      >
        <svg
          viewBox="0 0 200 200"
          className="h-auto w-full text-paper"
          fill="none"
        >
          <path
            data-scribble-path
            d="M28 42c38-22 72 18 48 46-22 26-8 48 24 38 34-10 52 22 28 44-20 18-58 8-72-14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />
          <path
            data-scribble-path
            d="M56 28c22 34-8 58-34 42 40 36 86 12 94-22 8-36-18-52-42-28-16 16 6 48 34 40"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
          />
          <path
            data-scribble-path
            d="M118 54c-8 28 18 46 40 28 24-20 8-58-22-48-26 8-18 42 12 36 18-4 26 18 8 28"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.32"
          />
        </svg>
      </div>

      {/* Bottom-right — clean continuous line */}
      <div
        data-character="focused"
        className="problem-character absolute bottom-[8vh] right-[2vw] w-[min(36vw,200px)] sm:right-[4vw] lg:right-[8vw]"
      >
        <svg
          viewBox="0 0 200 160"
          className="h-auto w-full text-paper"
          fill="none"
        >
          <path
            data-scribble-path
            d="M18 118c28-52 62-78 96-78 34 0 58 28 58 58 0 36-28 52-56 42"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />
          <path
            data-scribble-path
            d="M42 132h108"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            data-scribble-path
            d="M148 96c8 6 14 16 12 28"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            opacity="0.45"
          />
        </svg>
      </div>
    </div>
  );
}
