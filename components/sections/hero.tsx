"use client";

import { Button } from "@/components/ui/button";
import { COPY, SITE } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useMemo, useRef } from "react";

registerGsap();

function splitLetters(text: string) {
  return text.split("").map((char, i) => ({
    char: char === " " ? "\u00A0" : char,
    key: `${text}-${i}`,
  }));
}

function splitWords(text: string) {
  return text.split(" ").map((word, i) => ({
    word,
    key: `${word}-${i}`,
  }));
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);

  const brandLetters = useMemo(() => splitLetters(SITE.name), []);
  const headlineWords = useMemo(() => splitWords(COPY.heroHeadline), []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const letters = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-letter]"),
      );
      const words = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-word]"),
      );
      const rest = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-hero]"),
      );
      const media = mediaRef.current;
      const underline = underlineRef.current;

      if (reduced) {
        gsap.set([...letters, ...words, ...rest], { opacity: 1, y: 0 });
        if (underline) gsap.set(underline, { strokeDashoffset: 0 });
        if (media) gsap.set(media, { opacity: 1, scale: 1 });
        return;
      }

      gsap.set(letters, { opacity: 0, y: 28, rotateX: 35 });
      gsap.set(words, { opacity: 0, y: 20 });
      gsap.set(rest, { opacity: 0, y: 18 });
      if (media) gsap.set(media, { opacity: 0, scale: 1.04 });
      if (underline) {
        const length = underline.getTotalLength();
        gsap.set(underline, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (media) {
        tl.to(media, { opacity: 1, scale: 1, duration: 1.6 }, 0);
      }

      tl.to(
        letters,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.65,
          stagger: 0.04,
        },
        0.25,
      );

      if (underline) {
        tl.to(
          underline,
          { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" },
          0.7,
        );
      }

      tl.to(
        words,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.07,
        },
        0.8,
      );

      tl.to(
        rest,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
        },
        1.1,
      );
    },
    { dependencies: [] },
  );

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      {/* Full-bleed hero plane — text sits on the empty left of the photo */}
      <div
        ref={mediaRef}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="/images/hero-notebook.png"
          alt="Open notebook on a quiet desk"
          fill
          priority
          className="object-cover object-[68%_center] sm:object-[62%_center] lg:object-center"
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl px-5 pb-16 pt-24 sm:px-8 sm:pb-24 sm:pt-28">
        <div className="flex max-w-xl flex-col items-start text-left [perspective:800px] lg:max-w-[42%]">
          <div className="relative inline-block">
            <h1
              className="font-serif text-[clamp(2.75rem,10vw,5.75rem)] leading-[0.92] tracking-tight text-ink"
              aria-label={SITE.name}
            >
              {brandLetters.map(({ char, key }) => (
                <span
                  key={key}
                  data-letter
                  className="inline-block origin-bottom will-change-transform"
                >
                  {char}
                </span>
              ))}
            </h1>
            <svg
              className="absolute left-0 top-[94%] h-3 w-[92%] overflow-visible"
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
            className="mt-8 max-w-md font-serif text-[clamp(1.25rem,3vw,1.85rem)] leading-snug tracking-tight text-ink/80"
            aria-label={COPY.heroHeadline}
          >
            {headlineWords.map(({ word, key }, i) => (
              <span key={key} className="inline-block whitespace-nowrap">
                <span data-word className="inline-block will-change-transform">
                  {word}
                </span>
                {i < headlineWords.length - 1 ? "\u00A0" : null}
              </span>
            ))}
          </p>

          <p
            data-hero
            className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-ink-muted sm:mt-5 sm:text-lg"
          >
            {COPY.heroSupport}
          </p>

          <div data-hero className="mt-8 sm:mt-10">
            <Button>Sign up free</Button>
          </div>

          <a
            data-hero
            href="#sanctuary"
            className="mt-10 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-gold transition-opacity hover:opacity-70 sm:mt-12"
          >
            See the sanctuary
            <span
              aria-hidden
              className="cue-line block h-5 w-px origin-top bg-gold/60"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
