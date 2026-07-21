"use client";

import { COPY } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useMemo, useRef } from "react";

registerGsap();

function NoiseArtifacts() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden
    >
      <g data-artifact className="opacity-40">
        <rect
          x="8%"
          y="18%"
          width="72"
          height="18"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-paper/35"
        />
        <circle cx="10.5%" cy="20.2%" r="3" className="fill-gold/70" />
      </g>
      <g data-artifact className="opacity-35">
        <path
          d="M78 22c18-4 36 6 52-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeDasharray="4 6"
          className="text-paper/40"
          transform="translate(420, 80) scale(1.4)"
        />
      </g>
      <g data-artifact>
        <rect
          x="72%"
          y="28%"
          width="90"
          height="44"
          rx="6"
          fill="currentColor"
          className="text-paper/8"
        />
        <text
          x="74%"
          y="34%"
          className="fill-paper/45"
          style={{ fontSize: 11 }}
        >
          12 tabs open
        </text>
      </g>
      <g data-artifact>
        <circle
          cx="18%"
          cy="72%"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-gold/30"
        />
        <line
          x1="16%"
          y1="72%"
          x2="20%"
          y2="72%"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-paper/40"
        />
        <line
          x1="18%"
          y1="70%"
          x2="18%"
          y2="74%"
          stroke="currentColor"
          strokeWidth="1.2"
          className="text-paper/40"
        />
      </g>
      <g data-artifact>
        <path
          d="M850 480 c40-30 80 20 120-10 s70-5 100 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-paper/25"
        />
      </g>
      <g data-artifact>
        <rect
          x="60%"
          y="68%"
          width="120"
          height="36"
          rx="8"
          fill="currentColor"
          className="text-paper/10"
        />
        <text
          x="62%"
          y="74%"
          className="fill-gold-soft/70"
          style={{ fontSize: 10 }}
        >
          ping · rewrite?
        </text>
      </g>
    </svg>
  );
}

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
      const artifacts = gsap.utils.toArray<SVGElement>(
        pin.querySelectorAll("[data-artifact]"),
      );

      if (reduced) {
        gsap.set(spans, { opacity: 1, y: 0 });
        gsap.set(artifacts, { opacity: 0.25 });
        return;
      }

      gsap.set(spans, { opacity: 0.14, y: 18 });
      gsap.set(artifacts, { opacity: 0, y: 20, scale: 0.9 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.0,
          pin: pin,
          anticipatePin: 1,
        },
      });

      tl.to(
        artifacts,
        {
          opacity: 0.55,
          y: 0,
          scale: 1,
          stagger: 0.06,
          duration: 0.35,
        },
        0,
      );

      tl.to(
        spans,
        {
          opacity: 1,
          y: 0,
          ease: "none",
          stagger: 0.08,
          duration: 0.6,
        },
        0.1,
      );

      tl.to(
        artifacts,
        {
          opacity: 0.12,
          y: -30,
          scale: 1.05,
          stagger: 0.04,
          duration: 0.4,
        },
        0.55,
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
        className="relative flex h-[100dvh] items-center justify-center overflow-hidden px-5 sm:px-8"
      >
        <NoiseArtifacts />
        <p className="font-accent relative z-10 max-w-4xl text-center text-[clamp(1.45rem,5.2vw,3.5rem)] leading-[1.35] tracking-tight">
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
