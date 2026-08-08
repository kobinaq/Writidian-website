"use client";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ABOUT } from "@/lib/about";
import { APP_URL } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

registerGsap();

function AboutHero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const items = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-about-hero]"),
      );

      if (reduced) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(items, { opacity: 0, y: 28 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.15,
      });
    },
    { dependencies: [] },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-paper px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_20%_0%,rgba(163,138,94,0.14),transparent_60%),linear-gradient(180deg,var(--surface)_0%,var(--paper)_100%)]"
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <p
          data-about-hero
          className="font-serif text-[clamp(2.8rem,10vw,5.5rem)] leading-[0.95] tracking-tight text-ink"
        >
          Writidian
        </p>
        <p
          data-about-hero
          className="font-eyebrow mt-5 text-[12px] uppercase tracking-[0.24em] text-gold sm:mt-6"
        >
          {ABOUT.title}
        </p>
        <div
          data-about-hero
          aria-hidden
          className="mx-auto mt-5 h-1 w-16 bg-gold/40 sm:mt-6"
        />
        <p
          data-about-hero
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:mt-8 sm:text-lg"
        >
          {ABOUT.coined}
        </p>
      </div>
    </section>
  );
}

function EtymologyEquation() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const parts = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-eq]"),
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
          duration: 0.9,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 82%",
            once: true,
          },
        },
      );
    },
    { dependencies: [] },
  );

  return (
    <div
      ref={rootRef}
      className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-5 pb-16 font-serif text-2xl text-ink sm:flex-row sm:justify-center sm:gap-7 sm:pb-24 sm:text-4xl"
    >
      {ABOUT.equation.map((part, i) => (
        <div key={part.word} className="flex items-center gap-5 sm:gap-7">
          {i > 0 ? (
            <span data-eq className="text-gold" aria-hidden>
              {i === ABOUT.equation.length - 1 ? "=" : "+"}
            </span>
          ) : null}
          <div data-eq className="flex flex-col items-center">
            <span className={part.emphasis ? "font-bold italic" : undefined}>
              {part.word}
            </span>
            {part.note ? (
              <span
                className={`mt-2 font-sans text-[10px] uppercase tracking-[0.2em] sm:text-xs ${
                  part.emphasis ? "text-gold" : "text-ink-muted"
                }`}
              >
                {part.note}
              </span>
            ) : (
              <span className="mt-2 h-4" aria-hidden />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AboutPageContent() {
  const [thinking, hostile, purpose] = ABOUT.paragraphs;

  return (
    <div className="bg-paper">
      <AboutHero />
      <EtymologyEquation />

      {/* Thinking — image-led band */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <Image
          src="/images/writing-sanctuary-focus.jpg"
          alt="A focused writer at a quiet desk"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/45 to-espresso/25"
        />
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-3xl items-end px-5 py-16 sm:px-8 sm:py-24">
          <Reveal y={40} className="w-full">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.22em] text-gold-soft">
              Why we write
            </p>
            <p className="mt-5 font-serif text-[clamp(1.5rem,4vw,2.15rem)] leading-[1.25] text-paper">
              {thinking}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Hostile digital environment — espresso */}
      <section className="relative overflow-hidden bg-espresso px-5 py-20 text-paper sm:px-8 sm:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 70% 40%, color-mix(in srgb, var(--gold) 22%, transparent), transparent 70%)",
          }}
        />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <p className="font-eyebrow text-[11px] uppercase tracking-[0.22em] text-gold-soft">
            The problem
          </p>
          <p className="mt-6 font-serif text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.25]">
            {hostile}
          </p>
        </Reveal>
      </section>

      {/* Purpose + CTA */}
      <section className="relative overflow-hidden bg-paper px-5 py-20 sm:px-8 sm:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_50%_100%,rgba(163,138,94,0.1),transparent_65%)]"
        />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <p className="font-eyebrow text-[11px] uppercase tracking-[0.22em] text-gold">
            Our purpose
          </p>
          <p className="mt-6 font-serif text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.25] text-ink">
            {purpose}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12">
            <Button href={APP_URL}>Begin writing</Button>
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.2em] text-ink-muted">
              Free to start
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
