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

      // Idle motion — candle flame flickers; phone shakes as it rings.
      const flame = pin.querySelector<SVGPathElement>("[data-flame]");
      const ringShake = gsap.utils.toArray<SVGGElement | SVGPathElement>(
        pin.querySelectorAll("[data-ring-shake]"),
      );

      if (flame) {
        gsap.set(flame, { transformOrigin: "50% 100%" });
        gsap.to(flame, {
          scaleY: 0.92,
          scaleX: 1.08,
          skewX: 4,
          transformOrigin: "50% 100%",
          duration: 0.16,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      if (ringShake.length) {
        const ringTl = gsap.timeline({ repeat: -1 });
        ringTl
          .set(ringShake, { rotation: 0, x: 0, transformOrigin: "50% 50%" })
          .to(ringShake, { rotation: -3.5, x: -2.5, duration: 0.07, ease: "sine.inOut" })
          .to(ringShake, { rotation: 3.5, x: 2.5, duration: 0.07, ease: "sine.inOut" })
          .to(ringShake, { rotation: -3.5, x: -2.5, duration: 0.07, ease: "sine.inOut" })
          .to(ringShake, { rotation: 3.5, x: 2.5, duration: 0.07, ease: "sine.inOut" })
          .to(ringShake, { rotation: -3.5, x: -2.5, duration: 0.07, ease: "sine.inOut" })
          .to(ringShake, { rotation: 3.5, x: 2.5, duration: 0.07, ease: "sine.inOut" })
          .to(ringShake, { rotation: 0, x: 0, duration: 0.1, ease: "sine.inOut" })
          .to({}, { duration: 0.7 }); // pause between rings
      }
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
      {/* Top-left — rotary phone tangled in its cord = noise / "The world will not stop talking" */}
      <div
        data-character="overloaded"
        className="problem-character absolute left-[0.5vw] top-[2vh] w-[clamp(120px,14vw,200px)] opacity-80"
      >
        <svg
          viewBox="0 0 220 220"
          className="h-auto w-full text-paper"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Tangled cord — chaos loop */}
          <g data-ring-shake>
            <path
              data-scribble-path
              strokeWidth="1.6"
              opacity="0.5"
              d="M104 92c-18 18-34 12-40-2-6-16 8-34 26-28 16 6 14 28-4 32-16 4-30-8-24-24 8-18 32-16 40 2 6 16-8 30-26 26"
            />
            <path
              data-scribble-path
              strokeWidth="1.4"
              opacity="0.42"
              d="M96 100c22 10 44-6 44-28 0-16-14-28-30-26-14 2-24 16-20 30 4 12 18 18 28 12 10-6 12-20 4-28-8-10-24-10-32 0"
            />
          </g>
          {/* Phone base */}
          <path
            data-scribble-path
            strokeWidth="2"
            opacity="0.85"
            d="M64 150c4-14 14-22 28-22h36c14 0 24 8 28 22l6 20c2 8-4 14-12 14H70c-8 0-14-6-12-14l6-20Z"
          />
          {/* Dial ring */}
          <path
            data-scribble-path
            strokeWidth="1.7"
            opacity="0.8"
            d="M110 168a16 16 0 1 0 0.01 0"
          />
          {/* Handset resting on top — shakes with the ring */}
          <path
            data-scribble-path
            data-ring-shake
            strokeWidth="2"
            opacity="0.9"
            d="M62 118c6-10 18-14 30-12l44 6c12 2 20 10 22 20 1 8-5 14-13 14h-14c-6 0-11-4-13-10l-6-16-38-4-8 12c-3 5-8 8-14 8h-8c-8 0-13-6-12-14l4-14Z"
          />
          {/* Cord drops into tangle */}
          <path
            data-scribble-path
            strokeWidth="1.5"
            opacity="0.6"
            d="M148 132c14 8 22 20 20 34-2 16-18 24-32 18-12-6-16-20-8-30 8-10 22-10 30 0"
          />
        </svg>
      </div>

      {/* Bottom-right — single candle, one clean flame = focus / "Writidian's purpose" */}
      <div
        data-character="focused"
        className="problem-character absolute bottom-[2vh] right-[0.5vw] w-[clamp(120px,14vw,200px)] opacity-80"
      >
        <svg
          viewBox="0 0 200 220"
          className="h-auto w-full text-paper"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Candle body */}
          <path
            data-scribble-path
            strokeWidth="2"
            opacity="0.9"
            d="M78 96h44v84c0 12-10 20-22 20s-22-8-22-20V96Z"
          />
          {/* Wax drip */}
          <path
            data-scribble-path
            strokeWidth="1.5"
            opacity="0.6"
            d="M78 96c4 10 12 14 20 10 8-4 18-2 24-10"
          />
          {/* Wick */}
          <path
            data-scribble-path
            strokeWidth="1.6"
            opacity="0.8"
            d="M100 96v-14"
          />
          {/* Flame — single clean teardrop */}
          <path
            data-scribble-path
            data-flame
            strokeWidth="2"
            opacity="0.95"
            d="M100 82c-8-14-4-30 0-38 4 8 8 24 0 38Z"
          />
          {/* Halo — one soft ring of light */}
          <path
            data-scribble-path
            strokeWidth="1.2"
            opacity="0.35"
            d="M100 58a34 30 0 1 0 0.01 0"
          />
          {/* Saucer */}
          <path
            data-scribble-path
            strokeWidth="1.7"
            opacity="0.7"
            d="M58 200h84"
          />
        </svg>
      </div>
    </div>
  );
}
