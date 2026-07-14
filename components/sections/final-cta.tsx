"use client";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { COPY } from "@/lib/constants";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-paper px-5 py-20 sm:px-8 sm:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-3xl sm:h-[28rem] sm:w-[28rem]"
      />
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-[clamp(2rem,8vw,4.5rem)] leading-[1.05] tracking-tight text-ink">
          {COPY.finalCta}
        </h2>
        <p className="mt-5 text-base text-ink-muted sm:mt-6 sm:text-xl">
          {COPY.finalSupport}
        </p>
        <div className="mt-8 flex justify-center sm:mt-12">
          <Button>Sign up free</Button>
        </div>
      </Reveal>
    </section>
  );
}
