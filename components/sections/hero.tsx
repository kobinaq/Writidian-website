"use client";

import { Button } from "@/components/ui/button";
import { COPY, SITE } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

registerGsap();

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

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
      if (reduced) {
        gsap.set(parts, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        parts,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.1,
        },
      );
    },
    { dependencies: [] },
  );

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-paper px-5 pb-24 pt-28 sm:px-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 40%, color-mix(in srgb, var(--gold) 22%, transparent), transparent 70%), radial-gradient(ellipse 40% 30% at 85% 15%, color-mix(in srgb, var(--gold-soft) 18%, transparent), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <p
          data-hero
          className="font-serif text-[clamp(3rem,8vw,6.5rem)] leading-none tracking-tight text-ink"
        >
          {SITE.name}
        </p>
        <h1
          data-hero
          className="mt-6 max-w-4xl font-serif text-[clamp(1.85rem,4.4vw,3.5rem)] leading-[1.12] tracking-tight text-ink"
        >
          {COPY.heroHeadline}
        </h1>
        <p
          data-hero
          className="mt-7 max-w-lg text-base leading-relaxed text-ink-muted sm:text-xl"
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
          <span aria-hidden className="cue-line block h-8 w-px origin-top bg-gold/60" />
        </a>
      </div>
    </section>
  );
}
