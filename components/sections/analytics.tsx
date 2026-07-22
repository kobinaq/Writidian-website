"use client";

import { Reveal } from "@/components/ui/reveal";
import { COPY } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useMemo, useRef } from "react";

registerGsap();

const WEEK = [
  { day: "Mon", h: 28 },
  { day: "Tue", h: 62 },
  { day: "Wed", h: 44 },
  { day: "Thu", h: 78 },
  { day: "Fri", h: 36 },
  { day: "Sat", h: 90 },
  { day: "Sun", h: 54 },
];

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export function Analytics() {
  const rootRef = useRef<HTMLElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const heatRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const heatCells = useMemo(
    () =>
      Array.from({ length: 84 }, (_, i) => ({
        id: i,
        level: [0, 0, 1, 2, 3, 1, 2, 0, 3, 2, 1, 0][i % 12],
      })),
    [],
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      const bars = barsRef.current;
      const heat = heatRef.current;
      const stats = statsRef.current;
      if (!root || !bars || !heat || !stats) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const barEls = gsap.utils.toArray<HTMLElement>(
        bars.querySelectorAll("[data-bar]"),
      );
      const cells = gsap.utils.toArray<HTMLElement>(
        heat.querySelectorAll("[data-cell]"),
      );
      const statEls = gsap.utils.toArray<HTMLElement>(
        stats.querySelectorAll("[data-stat]"),
      );

      if (reduced) {
        gsap.set(barEls, { scaleY: 1, opacity: 1 });
        gsap.set(cells, { opacity: 1 });
        gsap.set(statEls, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(barEls, { scaleY: 0.08, opacity: 0.35, transformOrigin: "bottom" });
      gsap.set(cells, { opacity: 0.15 });
      gsap.set(statEls, { opacity: 0, y: 18 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 68%",
          end: "center 40%",
          scrub: 1.15,
        },
      });

      tl.to(
        statEls,
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.35 },
        0,
      )
        .to(
          barEls,
          {
            scaleY: 1,
            opacity: 1,
            stagger: 0.07,
            duration: 0.45,
            ease: "power2.out",
          },
          0.1,
        )
        .to(
          cells,
          {
            opacity: 1,
            stagger: { each: 0.008, from: "start" },
            duration: 0.25,
          },
          0.25,
        );
    },
    { dependencies: [] },
  );

  const cellTone = (level: number) => {
    if (level === 0) return "bg-ink/8";
    if (level === 1) return "bg-gold/25";
    if (level === 2) return "bg-gold/55";
    return "bg-gold";
  };

  return (
    <section
      id="analytics"
      ref={rootRef}
      className="bg-paper px-5 py-20 sm:px-8 sm:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="font-serif text-[clamp(1.85rem,5vw,3.75rem)] leading-[1.08] tracking-tight text-ink">
            {COPY.analyticsTitle}
          </h2>
          <p className="font-accent mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
            {COPY.analyticsBody}
          </p>
        </Reveal>

        <div
          ref={statsRef}
          className="mt-10 grid grid-cols-3 gap-3 sm:mt-14 sm:gap-5"
        >
          {[
            { label: "Sanctuary Hrs", value: "14.5" },
            { label: "Words Flowed", value: "28.4k" },
            { label: "Momentum", value: "12d" },
          ].map((stat) => (
            <div
              key={stat.label}
              data-stat
              className="rounded-2xl border border-ink/10 bg-surface/70 px-3 py-5 text-center sm:px-6 sm:py-7"
            >
              <p className="font-serif text-2xl text-ink sm:text-4xl">
                {stat.value}
              </p>
              <p className="font-eyebrow mt-2 text-[9px] uppercase tracking-[0.16em] text-ink-muted sm:text-[11px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Reveal y={36}>
            <div className="rounded-[1.5rem] border border-ink/10 bg-paper p-5 sm:p-8">
              <p className="font-eyebrow text-[10px] uppercase tracking-[0.2em] text-gold sm:text-xs">
                7-Day Output
              </p>
              <div
                ref={barsRef}
                className="mt-8 flex h-40 items-end justify-between gap-2 sm:h-48 sm:gap-3"
              >
                {WEEK.map((d) => (
                  <div
                    key={d.day}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div
                      data-bar
                      className="w-full rounded-t-md bg-gold/80"
                      style={{ height: `${d.h}%` }}
                    />
                    <span className="font-eyebrow text-[9px] uppercase tracking-[0.12em] text-ink-muted sm:text-[10px]">
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06} y={36}>
            <div className="rounded-[1.5rem] border border-ink/10 bg-paper p-5 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="font-eyebrow text-[10px] uppercase tracking-[0.2em] text-gold sm:text-xs">
                  Writing Rhythm
                </p>
                <p className="text-[10px] text-ink-muted sm:text-xs">2026</p>
              </div>
              <div
                ref={heatRef}
                className="mt-6 grid grid-cols-12 gap-1.5 sm:mt-8 sm:gap-2"
              >
                {heatCells.map((cell) => (
                  <div
                    key={cell.id}
                    data-cell
                    className={`aspect-square rounded-[3px] sm:rounded-sm ${cellTone(cell.level)}`}
                  />
                ))}
              </div>
              <div className="font-eyebrow mt-4 flex justify-between text-[9px] uppercase tracking-[0.14em] text-ink-muted sm:text-[10px]">
                {MONTHS.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-ink-muted">
                <span>Less</span>
                <span className="h-2.5 w-2.5 rounded-[2px] bg-ink/8" />
                <span className="h-2.5 w-2.5 rounded-[2px] bg-gold/25" />
                <span className="h-2.5 w-2.5 rounded-[2px] bg-gold/55" />
                <span className="h-2.5 w-2.5 rounded-[2px] bg-gold" />
                <span>More</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
