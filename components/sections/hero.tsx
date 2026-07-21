"use client";

import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useMemo, useRef } from "react";

registerGsap();

const ITALIC_WORDS = new Set(["human"]);

function splitWords(text: string) {
  return text.split(" ").map((word, i) => ({
    word,
    italic: ITALIC_WORDS.has(word.replace(/[.,]/g, "").toLowerCase()),
    key: `${word}-${i}`,
  }));
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);

  const headlineWords = useMemo(() => splitWords(COPY.heroHeadline), []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const words = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-word]"),
      );
      const rest = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-hero]"),
      );
      const media = mediaRef.current;
      const rule = ruleRef.current;
      const tablet = tabletRef.current;

      if (reduced) {
        gsap.set([...words, ...rest], { opacity: 1, y: 0 });
        if (media) gsap.set(media, { opacity: 1, scale: 1 });
        if (tablet) gsap.set(tablet, { opacity: 1, y: 0 });
        if (rule) gsap.set(rule, { scaleX: 1 });
        return;
      }

      gsap.set(words, { opacity: 0, y: 26, rotateX: 24 });
      gsap.set(rest, { opacity: 0, y: 16 });
      if (media) gsap.set(media, { opacity: 0, scale: 1.04 });
      if (tablet) gsap.set(tablet, { opacity: 0, y: 48, rotateX: 8 });
      if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (media) {
        tl.to(media, { opacity: 1, scale: 1, duration: 1.8 }, 0);
      }
      if (rule) {
        tl.to(rule, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 0.4);
      }
      tl.to(
        words,
        { opacity: 1, y: 0, rotateX: 0, duration: 0.85, stagger: 0.085 },
        0.55,
      );
      tl.to(rest, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 1.15);
      if (tablet) {
        tl.to(tablet, { opacity: 1, y: 0, rotateX: 0, duration: 1.1 }, 0.85);
      }
    },
    { dependencies: [] },
  );

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      {/* Full-bleed desk photograph */}
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/hero-mid-story.jpg"
          alt="Open journal mid-story, handwritten pages and a fountain pen on a quiet desk"
          fill
          priority
          className="object-cover object-[72%_center] sm:object-[66%_center] lg:object-[60%_center]"
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(105deg,rgba(247,244,238,0.96)_0%,rgba(247,244,238,0.82)_28%,rgba(247,244,238,0.35)_48%,rgba(247,244,238,0.08)_62%,transparent_75%)]"
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-20 pt-28 sm:gap-14 sm:px-10 sm:pb-24 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-10 lg:pt-32">
        <div className="flex max-w-xl flex-col items-start text-left [perspective:900px]">
          <div data-hero className="flex w-full items-center gap-4">
            <p className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">
              Writidian
            </p>
            <span
              ref={ruleRef}
              aria-hidden
              className="block h-px w-full max-w-[9rem] bg-gold/50"
            />
          </div>

          <p
            data-hero
            className="font-eyebrow mt-5 text-[15px] tracking-wide text-gold"
          >
            {COPY.heroEyebrow}
          </p>

          <h1
            className="mt-5 font-serif text-[clamp(2.5rem,6.8vw,4.6rem)] leading-[1.04] tracking-tight text-ink sm:mt-6"
            aria-label={COPY.heroHeadline}
          >
            {headlineWords.map(({ word, italic, key }, i) => (
              <span key={key} className="inline-block whitespace-nowrap">
                <span
                  data-word
                  className={`inline-block origin-bottom will-change-transform ${
                    italic ? "italic text-gold" : ""
                  }`}
                >
                  {word}
                </span>
                {i < headlineWords.length - 1 ? "\u00A0" : null}
              </span>
            ))}
          </h1>

          <p
            data-hero
            className="font-accent mt-6 max-w-md text-[1.15rem] leading-relaxed text-ink-muted sm:mt-7 sm:text-xl"
          >
            {COPY.heroSupport}
          </p>

          <div
            data-hero
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-11"
          >
            <Button>Begin writing</Button>
            <p className="font-eyebrow text-[13px] tracking-wide text-ink-muted">
              Free to start · No credit card required
            </p>
          </div>

          <a
            data-hero
            href="#sanctuary"
            className="font-eyebrow mt-12 flex items-center gap-3 text-[13px] tracking-wide text-gold transition-opacity hover:opacity-70 sm:mt-16"
          >
            Enter the sanctuary
            <span
              aria-hidden
              className="cue-line block h-5 w-px origin-top bg-gold/60"
            />
          </a>
        </div>

        {/* Landscape tablet — product journey */}
        <div
          ref={tabletRef}
          data-hero
          className="relative mx-auto w-full max-w-[36rem] [perspective:1200px] lg:mr-0 lg:max-w-none"
        >
          <div className="relative aspect-[1180/820] w-full overflow-hidden rounded-[1.4rem] bg-[#1c1916] p-[0.65rem] shadow-[0_50px_100px_-40px_rgba(14,12,9,0.65)] ring-1 ring-black/40 sm:rounded-[1.75rem] sm:p-3">
            <div className="relative h-full w-full overflow-hidden rounded-[0.95rem] bg-paper sm:rounded-[1.15rem]">
              <div
                aria-hidden
                className="absolute left-1/2 top-1.5 z-10 h-1 w-14 -translate-x-1/2 rounded-full bg-ink/15 sm:top-2 sm:h-1.5 sm:w-16"
              />
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/videos/hero-ipad-journey.webm"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Writidian app journey from daily prompt to the editor"
              />
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-8 -bottom-6 -z-10 h-16 rounded-[100%] bg-espresso/25 blur-2xl"
          />
        </div>
      </div>
    </section>
  );
}
