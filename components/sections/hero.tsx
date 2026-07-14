"use client";

import { Button } from "@/components/ui/button";
import { COPY, SITE } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

registerGsap();

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const parts = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-hero]"),
      );
      const light = lightRef.current;
      const underline = underlineRef.current;

      if (reduced) {
        gsap.set(parts, { opacity: 1, y: 0 });
        if (underline) gsap.set(underline, { strokeDashoffset: 0 });
        if (light) gsap.set(light, { opacity: 0.85, scale: 1 });
        return;
      }

      gsap.set(parts, { opacity: 0, y: 28 });
      if (underline) {
        const length = underline.getTotalLength();
        gsap.set(underline, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      }
      if (light) gsap.set(light, { opacity: 0.35, scale: 0.88 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (light) {
        tl.to(
          light,
          { opacity: 1, scale: 1.05, duration: 1.6, ease: "power2.out" },
          0,
        );
      }

      tl.to(
        parts,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.14,
        },
        0.2,
      );

      if (underline) {
        tl.to(
          underline,
          { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" },
          0.55,
        );
      }

      if (light) {
        gsap.to(light, {
          scale: 1.12,
          opacity: 0.75,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.4,
        });
      }
    },
    { dependencies: [] },
  );

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-paper px-5 pb-24 pt-28 sm:px-8"
    >
      {/* Paper field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, #faf7f1 0%, var(--paper) 55%, #ebe4d6 100%)",
        }}
      />

      {/* Breathing gold light */}
      <div
        ref={lightRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[38%] h-[min(70vw,36rem)] w-[min(90vw,48rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--gold) 28%, transparent) 0%, color-mix(in srgb, var(--gold-soft) 12%, transparent) 42%, transparent 70%)",
        }}
      />

      {/* Soft corner ink washes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--ink) 8%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--gold) 16%, transparent), transparent 70%)",
        }}
      />

      {/* Faint ruled paper */}
      <div
        aria-hidden
        className="hero-ruled pointer-events-none absolute inset-x-[8%] top-[22%] bottom-[18%] opacity-[0.07] sm:inset-x-[18%]"
      />

      {/* Local paper grain */}
      <div aria-hidden className="hero-paper-grain pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <div data-hero className="relative inline-block px-2">
          <h1 className="font-serif text-[clamp(3.5rem,11vw,7.5rem)] leading-[0.92] tracking-tight text-ink">
            {SITE.name}
          </h1>
          <svg
            className="absolute left-[6%] right-[4%] top-[92%] h-3 w-[88%] overflow-visible"
            viewBox="0 0 300 12"
            fill="none"
            aria-hidden
          >
            <path
              ref={underlineRef}
              d="M2 8c55-7 110 5 160-2s90-3 136 3"
              stroke="var(--gold)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <p
          data-hero
          className="mt-10 max-w-2xl font-serif text-[clamp(1.35rem,2.8vw,1.85rem)] leading-snug tracking-tight text-ink/80"
        >
          {COPY.heroHeadline}
        </p>

        <p
          data-hero
          className="mt-5 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg"
        >
          {COPY.heroSupport}
        </p>

        <div data-hero className="mt-10">
          <Button>Sign up free</Button>
        </div>

        <a
          data-hero
          href="#sanctuary"
          className="mt-16 flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gold transition-opacity hover:opacity-70"
        >
          See the sanctuary
          <span
            aria-hidden
            className="cue-line block h-8 w-px origin-top bg-gold/60"
          />
        </a>
      </div>
    </section>
  );
}
