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

      if (reduced) {
        gsap.set(spans, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(spans, { opacity: 0.28, y: 18 });

      gsap.to(spans, {
        opacity: 1,
        y: 0,
        ease: "none",
        stagger: 0.08,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.0,
          pin: pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { dependencies: [words.length] },
  );

  return (
    <section ref={rootRef} className="relative h-[170vh] bg-espresso text-paper md:h-[220vh]">
      <div
        ref={pinRef}
        className="flex h-[100dvh] items-center justify-center px-5 sm:px-8"
      >
        <p className="max-w-4xl text-center font-serif text-[clamp(1.35rem,5.2vw,3.5rem)] leading-[1.3] tracking-tight">
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
      </div>
    </section>
  );
}
