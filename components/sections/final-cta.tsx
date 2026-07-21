"use client";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { COPY } from "@/lib/constants";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-espresso px-5 py-20 text-paper sm:px-8 sm:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, color-mix(in srgb, var(--gold) 28%, transparent), transparent 70%)",
        }}
      />
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-[clamp(2rem,8vw,4.5rem)] leading-[1.05] tracking-tight">
          {COPY.finalCta}
        </h2>
        <p className="font-accent mt-5 text-base text-paper/70 sm:mt-6 sm:text-xl">
          {COPY.finalSupport}
        </p>
        <div className="mt-8 flex justify-center sm:mt-12">
          <Button className="!bg-paper !text-espresso !border-paper hover:!bg-gold-soft hover:!border-gold-soft">
            Sign up free
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
