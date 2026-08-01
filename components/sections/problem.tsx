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
      const flames = gsap.utils.toArray<SVGPathElement>(
        pin.querySelectorAll("path[data-flame]"),
      );
      const handset = pin.querySelector<HTMLElement>("[data-ring-shake]");
      const cord = pin.querySelector<HTMLElement>("[data-ring-cord]");

      if (reduced) {
        gsap.set(spans, { opacity: 1, y: 0 });
        gsap.set([leftCharacter, rightCharacter], { opacity: 1 });
        gsap.set(followUp, { opacity: 1, y: 0 });
        gsap.set(flames, { opacity: 0.85 });
        return;
      }

      gsap.set(spans, { opacity: 0.14, y: 18 });
      gsap.set(followUp, { opacity: 0, y: 20 });
      gsap.set([leftCharacter, rightCharacter], { autoAlpha: 0 });
      gsap.set(flames, { opacity: 0.15, transformOrigin: "50% 100%" });

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
        .to(leftCharacter, { autoAlpha: 1, duration: 0.2 }, 0)
        .to(rightCharacter, { autoAlpha: 1, duration: 0.2 }, 0.14);

      // Idle — phone rings (handset + soft cord sway); candle flames alternate.
      if (handset) {
        const ringTl = gsap.timeline({ repeat: -1 });
        ringTl
          .set(handset, { rotation: 0, x: 0, transformOrigin: "50% 80%" })
          .to(handset, {
            rotation: -4,
            x: -3,
            duration: 0.07,
            ease: "sine.inOut",
          })
          .to(handset, {
            rotation: 4,
            x: 3,
            duration: 0.07,
            ease: "sine.inOut",
          })
          .to(handset, {
            rotation: -4,
            x: -3,
            duration: 0.07,
            ease: "sine.inOut",
          })
          .to(handset, {
            rotation: 4,
            x: 3,
            duration: 0.07,
            ease: "sine.inOut",
          })
          .to(handset, {
            rotation: -3,
            x: -2,
            duration: 0.07,
            ease: "sine.inOut",
          })
          .to(handset, {
            rotation: 3,
            x: 2,
            duration: 0.07,
            ease: "sine.inOut",
          })
          .to(handset, {
            rotation: 0,
            x: 0,
            duration: 0.1,
            ease: "sine.inOut",
          })
          .to({}, { duration: 0.75 });
      }

      if (cord) {
        gsap.to(cord, {
          rotation: 2.5,
          x: 2,
          transformOrigin: "30% 40%",
          duration: 0.14,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 0.04,
        });
      }

      flames.forEach((flame, i) => {
        gsap.to(flame, {
          opacity: 0.95,
          scaleY: 1.06,
          duration: 0.45 + i * 0.08,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.28,
        });
      });
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
      {/* Top-left — rotary phone (noise) */}
      <div
        data-character="overloaded"
        className="problem-character absolute left-[0.5vw] top-[2vh] w-[clamp(120px,14vw,200px)] opacity-85"
      >
        <div className="relative aspect-square w-full">
          <Image
            src="/images/problem-phone-stand.png"
            alt=""
            fill
            unoptimized
            sizes="200px"
            className="object-contain"
          />
          <div
            data-ring-cord
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src="/images/problem-phone-cord.png"
              alt=""
              fill
              unoptimized
              sizes="200px"
              className="object-contain object-[center_55%]"
            />
          </div>
          <div
            data-ring-shake
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src="/images/problem-phone-handset.png"
              alt=""
              fill
              unoptimized
              sizes="200px"
              className="object-contain object-[center_28%] scale-[0.72]"
            />
          </div>
        </div>
      </div>

      {/* Bottom-right — candle + SVG flame curls (focus) */}
      <div
        data-character="focused"
        className="problem-character absolute bottom-[2vh] right-[0.5vw] w-[clamp(120px,14vw,200px)] opacity-85"
      >
        <div className="relative aspect-square w-full">
          <Image
            src="/images/problem-candle-body.png"
            alt=""
            fill
            unoptimized
            sizes="200px"
            className="object-contain"
          />
          <svg
            viewBox="0 0 200 220"
            className="pointer-events-none absolute inset-0 h-full w-full text-paper"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Three curled flame strokes — fade alternately above the wick */}
            <path
              data-flame="1"
              strokeWidth="1.8"
              opacity="0.9"
              d="M100 48c-7-12-5-26 0-34 4 9 6 20 0 34Z"
            />
            <path
              data-flame="2"
              strokeWidth="1.5"
              opacity="0.55"
              d="M91 52c-5-14 0-28 5-32 1 10-1 20-5 32Z"
            />
            <path
              data-flame="3"
              strokeWidth="1.5"
              opacity="0.55"
              d="M109 52c5-14 0-28-5-32-1 10 1 20 5 32Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
