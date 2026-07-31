"use client";

import { COPY } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
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

      if (reduced) {
        gsap.set(spans, { opacity: 1, y: 0 });
        gsap.set([leftCharacter, rightCharacter], { opacity: 1 });
        gsap.set(followUp, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(spans, { opacity: 0.14, y: 18 });
      gsap.set(followUp, { opacity: 0, y: 20 });

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
        .fromTo(
          leftCharacter,
          { autoAlpha: 0, x: -24, y: 16 },
          { autoAlpha: 1, x: 0, y: 0, duration: 0.35, ease: "power2.out" },
          0,
        )
        .fromTo(
          rightCharacter,
          { autoAlpha: 0, x: 24, y: 16 },
          { autoAlpha: 1, x: 0, y: 0, duration: 0.35, ease: "power2.out" },
          0.1,
        )
        .to(
          leftCharacter,
          { x: -6, duration: 0.3, ease: "power1.inOut" },
          0.7,
        )
        .to(
          rightCharacter,
          { x: 6, duration: 0.3, ease: "power1.inOut" },
          0.7,
        );
    },
    { dependencies: [words.length] },
  );

  return (
    <section
      ref={rootRef}
      className="relative h-[170vh] bg-espresso text-paper md:h-[220vh]"
    >
      <div
        ref={pinRef}
        className="relative flex h-[100dvh] flex-col items-center justify-center overflow-hidden px-5 sm:px-8"
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
      <div
        data-character="overloaded"
        className="problem-character absolute bottom-[4vh] left-[-2rem] w-[min(42vw,280px)] sm:left-[2vw] lg:left-[7vw]"
      >
        <Image
          src="/images/problem-overload-cutout.png"
          alt=""
          width={560}
          height={560}
          className="h-auto w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
          sizes="(max-width: 640px) 42vw, 280px"
          priority={false}
          unoptimized
        />
      </div>
      <div
        data-character="focused"
        className="problem-character absolute bottom-[4vh] right-[-2rem] w-[min(42vw,280px)] sm:right-[2vw] lg:right-[7vw]"
      >
        <Image
          src="/images/problem-focus-cutout.png"
          alt=""
          width={560}
          height={560}
          className="h-auto w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
          sizes="(max-width: 640px) 42vw, 280px"
          priority={false}
          unoptimized
        />
      </div>
    </div>
  );
}
