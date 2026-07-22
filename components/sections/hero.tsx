"use client";

import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useMemo, useRef } from "react";

registerGsap();

const GOLD_WORDS = new Set(["craft"]);

function splitWords(text: string) {
  return text.split(" ").map((word, i) => ({
    word,
    gold: GOLD_WORDS.has(word.replace(/[.,]/g, "").toLowerCase()),
    key: `${word}-${i}`,
  }));
}

/** Portrait iPad Pro–style device. */
function IpadMockup() {
  return (
    <div className="relative aspect-[3/4] w-[min(72vw,19.5rem)] sm:w-[min(58vw,22rem)] lg:w-[min(28vw,23rem)] xl:w-[24rem] [perspective:1200px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 bottom-[-10%] -z-10 h-[26%] rounded-[100%] bg-espresso/28 blur-3xl"
      />

      <div
        className="relative h-full w-full rounded-[1.85rem] p-[0.55rem] sm:rounded-[2.1rem] sm:p-[0.62rem]"
        style={{
          background:
            "linear-gradient(145deg, #5c5a58 0%, #2a2826 18%, #1a1918 45%, #3d3b39 72%, #6e6c69 100%)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.22) inset, 0 -1px 0 rgba(0,0,0,0.45) inset, 0 28px 60px -24px rgba(14,12,9,0.55), 0 8px 24px -12px rgba(14,12,9,0.35)",
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-[1.4rem] p-[0.36rem] sm:rounded-[1.65rem] sm:p-[0.42rem]"
          style={{
            background:
              "linear-gradient(160deg, #0c0b0a 0%, #1f1d1b 40%, #121110 100%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.06) inset",
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[1.1rem] bg-[#f7f4ee] sm:rounded-[1.3rem]">
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(160deg,#f7f4ee_0%,#efebe3_55%,#e8e2d6_100%)]"
            />
            <div
              aria-hidden
              className="absolute inset-0 flex flex-col px-5 pb-5 pt-10 sm:px-6 sm:pt-11"
            >
              <p className="font-eyebrow text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                Daily prompt
              </p>
              <p className="mt-4 font-serif text-[0.95rem] leading-snug text-ink/80 sm:text-[1.05rem]">
                {COPY.samplePrompt}
              </p>
            </div>

            <video
              className="absolute inset-0 z-10 h-full w-full object-cover"
              src="/videos/herodemo.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Writidian product demo"
            />

            {/* Front camera — top center in portrait */}
            <div
              aria-hidden
              className="absolute left-1/2 top-3 z-20 -translate-x-1/2 sm:top-3.5"
            >
              <span className="block h-[7px] w-[7px] rounded-full bg-[#1a1918] shadow-[0_0_0_1.5px_#2e2c2a] sm:h-2 sm:w-2" />
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-30 rounded-[1.1rem] sm:rounded-[1.3rem]"
              style={{
                background:
                  "linear-gradient(125deg, rgba(255,255,255,0.18) 0%, transparent 28%, transparent 62%, rgba(255,255,255,0.06) 100%)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
              }}
            />
          </div>
        </div>

        {/* Side buttons */}
        <span
          aria-hidden
          className="absolute -left-[3px] top-[16%] h-9 w-[3px] rounded-l-sm bg-[#3a3836] sm:h-11"
        />
        <span
          aria-hidden
          className="absolute -left-[3px] top-[28%] h-6 w-[3px] rounded-l-sm bg-[#3a3836] sm:h-7"
        />
        <span
          aria-hidden
          className="absolute -right-[3px] top-[22%] h-12 w-[3px] rounded-r-sm bg-[#3a3836] sm:h-14"
        />
      </div>
    </div>
  );
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);
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
      const tablet = tabletRef.current;
      const rule = ruleRef.current;

      if (reduced) {
        gsap.set([...words, ...rest], { opacity: 1, y: 0 });
        if (tablet) gsap.set(tablet, { opacity: 1, y: 0 });
        if (rule) gsap.set(rule, { scaleX: 1 });
        return;
      }

      gsap.set(words, { opacity: 0, y: 26, rotateX: 24 });
      gsap.set(rest, { opacity: 0, y: 16 });
      if (tablet) gsap.set(tablet, { opacity: 0, y: 36 });
      if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (rule) {
        tl.to(rule, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 0.35);
      }
      if (tablet) {
        tl.to(tablet, { opacity: 1, y: 0, duration: 1.1 }, 0.45);
      }
      tl.to(
        words,
        { opacity: 1, y: 0, rotateX: 0, duration: 0.85, stagger: 0.085 },
        0.55,
      );
      tl.to(rest, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 1.15);
    },
    { dependencies: [] },
  );

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-paper"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_78%_45%,rgba(163,138,94,0.11),transparent_62%),linear-gradient(180deg,var(--paper)_0%,var(--surface)_100%)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-20 pt-28 sm:gap-14 sm:px-10 sm:pb-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:pt-32 xl:gap-20">
        <div className="flex max-w-xl flex-col items-start text-left [perspective:900px]">
          <div data-hero className="flex w-full items-center gap-4">
            <p className="font-eyebrow whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.32em] text-gold">
              A writing sanctuary
            </p>
            <span
              ref={ruleRef}
              aria-hidden
              className="block h-px w-full max-w-[9rem] bg-gold/50"
            />
          </div>

          <h1
            className="mt-7 font-serif text-[clamp(2.6rem,7.5vw,4.9rem)] leading-[1.04] tracking-tight text-ink sm:mt-9"
            aria-label={COPY.heroHeadline}
          >
            {headlineWords.map(({ word, gold, key }, i) => (
              <span key={key} className="inline-block whitespace-nowrap">
                <span
                  data-word
                  className={`inline-block origin-bottom will-change-transform ${
                    gold ? "text-gold" : ""
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
            className="font-accent mt-6 max-w-md text-[1rem] leading-relaxed text-ink-muted sm:mt-7 sm:text-lg"
          >
            {COPY.heroSupport}
          </p>

          <div
            data-hero
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-11"
          >
            <Button>Begin writing</Button>
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              Free to start
            </p>
          </div>
        </div>

        {/* Portrait iPad — fully in-frame with right-side breathing room */}
        <div
          ref={tabletRef}
          className="relative flex justify-center will-change-transform lg:justify-end lg:pr-2 xl:pr-6"
        >
          <IpadMockup />
        </div>
      </div>
    </section>
  );
}
