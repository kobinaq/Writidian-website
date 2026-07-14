"use client";

import { Reveal } from "@/components/ui/reveal";
import { COPY } from "@/lib/constants";

export function Platform() {
  return (
    <section className="bg-surface/50 px-5 py-20 sm:px-8 sm:py-24">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
          {COPY.platformNote}
        </p>
      </Reveal>
    </section>
  );
}
