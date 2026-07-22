"use client";

import { Reveal } from "@/components/ui/reveal";
import { COPY } from "@/lib/constants";

export function Stance() {
  return (
    <section className="relative overflow-hidden bg-espresso px-5 py-20 text-paper sm:px-8 sm:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, color-mix(in srgb, var(--gold) 28%, transparent), transparent 70%)",
        }}
      />
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.1] tracking-tight">
          {COPY.stanceTitle}
        </h2>
        <p className="font-accent mt-5 text-base leading-relaxed text-paper/70 sm:mt-8 sm:text-xl">
          {COPY.stanceBody}
        </p>
      </Reveal>
    </section>
  );
}
