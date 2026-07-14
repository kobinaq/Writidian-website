"use client";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { COPY } from "@/lib/constants";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-paper px-5 py-32 sm:px-8 sm:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-3xl"
      />
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-tight text-ink">
          {COPY.finalCta}
        </h2>
        <p className="mt-6 text-lg text-ink-muted sm:text-xl">
          {COPY.finalSupport}
        </p>
        <div className="mt-12 flex justify-center">
          <Button>Sign up free</Button>
        </div>
      </Reveal>
    </section>
  );
}
