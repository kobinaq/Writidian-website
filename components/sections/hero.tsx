"use client";

import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";
import { useMemo, useRef } from "react";

registerGsap();

const HeroJournal = dynamic(
  () =>
    import("@/components/hero/hero-journal").then((m) => m.HeroJournal),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="h-full w-full bg-[radial-gradient(ellipse_at_55%_45%,#ebe4d4_0%,transparent_65%)]"
      />
    ),
  },
);

/* Words set in italic serif for emphasis */
const ITALIC_WORDS = new Set(["craft"]);

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

      if (reduced) {
        gsap.set([...words, ...rest], { opacity: 1, y: 0 });
        if (media) gsap.set(media, { opacity: 1, scale: 1 });
        if (rule) gsap.set(rule, { scaleX: 1 });
        return;
      }

      gsap.set(words, { opacity: 0, y: 26, rotateX: 24 });
      gsap.set(rest, { opacity: 0, y: 16 });
      if (media) gsap.set(media, { opacity: 0, scale: 1.04 });
      if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (media) {
        tl.to(media, { opacity: 1, scale: 1, duration: 1.4 }, 0);
      }
      if (rule) {
        tl.to(
          rule,
          { scaleX: 1, duration: 0.9, ease: "power2.inOut" },
          0.35,
        );
      }

      tl.to(
        words,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.85,
          stagger: 0.085,
        },
        0.55,
      );

      tl.to(
        rest,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
        },
        1.2,
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
      {/* Warm paper field — atmosphere behind copy + journal */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_70%_40%,#efe6d4_0%,var(--paper)_48%,#ebe4d6_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(circle_at_78%_55%,rgba(199,168,115,0.22)_0%,transparent_42%)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 px-6 pb-20 pt-28 sm:px-10 sm:pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-6 lg:pt-24">
        <div className="flex max-w-xl flex-col items-start text-left [perspective:900px] lg:max-w-none">
          {/* Eyebrow — letterspaced small caps over a drawn hairline */}
          <div data-hero className="flex w-full items-center gap-4">
            <p className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.32em] text-gold">
              A writing sanctuary
            </p>
            <span
              ref={ruleRef}
              aria-hidden
              className="block h-px w-full max-w-[9rem] bg-gold/50"
            />
          </div>

          {/* Headline — the voice of the page, not a logotype */}
          <h1
            className="mt-7 font-serif text-[clamp(2.6rem,7.5vw,4.9rem)] leading-[1.04] tracking-tight text-ink sm:mt-9"
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
            className="mt-6 max-w-md text-[1rem] leading-relaxed text-ink-muted sm:mt-7 sm:text-lg"
          >
            {COPY.heroSupport}
          </p>

          {/* CTA — one clear action, one quiet promise */}
          <div
            data-hero
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-11"
          >
            <Button>Begin writing</Button>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              Free to start · No AI, ever
            </p>
          </div>

          <a
            data-hero
            href="#sanctuary"
            className="mt-12 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-gold transition-opacity hover:opacity-70 sm:mt-16"
          >
            Enter the sanctuary
            <span
              aria-hidden
              className="cue-line block h-5 w-px origin-top bg-gold/60"
            />
          </a>
        </div>

        {/* 3D journal mount */}
        <div
          ref={mediaRef}
          className="relative mx-auto h-[min(52vh,420px)] w-full max-w-lg will-change-transform sm:h-[min(56vh,480px)] lg:mx-0 lg:h-[min(72vh,620px)] lg:max-w-none"
          role="img"
          aria-label="Leather journal opening with handwritten text"
        >
          <HeroJournal />
        </div>
      </div>

      {/* Folio mark — quiet editorial detail */}
      <p
        aria-hidden
        className="absolute bottom-6 right-6 hidden font-serif text-xs italic tracking-wide text-ink/45 sm:right-10 lg:block"
      >
        Writidian · est. for the patient craft
      </p>
    </section>
  );
}
