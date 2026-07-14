"use client";

import { Reveal } from "@/components/ui/reveal";
import { COPY } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

registerGsap();

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function Streak() {
  const rootRef = useRef<HTMLElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const daysRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const flame = flameRef.current;
      const count = countRef.current;
      const days = daysRef.current;
      if (!root || !flame || !count || !days) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const pills = gsap.utils.toArray<HTMLElement>(
        days.querySelectorAll("[data-day]"),
      );

      if (reduced) {
        gsap.set(flame, { scale: 1, opacity: 1 });
        count.textContent = "12";
        gsap.set(pills, { opacity: 1, scale: 1 });
        return;
      }

      gsap.set(flame, { scale: 0.6, opacity: 0.4 });
      gsap.set(pills, { opacity: 0.25, scale: 0.85 });
      count.textContent = "0";

      const state = { value: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          end: "center 45%",
          scrub: 1.1,
        },
      });

      tl.to(flame, { scale: 1.08, opacity: 1, duration: 0.45 }, 0)
        .to(
          state,
          {
            value: 12,
            duration: 0.55,
            onUpdate: () => {
              count.textContent = String(Math.round(state.value));
            },
          },
          0.05,
        )
        .to(
          pills,
          {
            opacity: 1,
            scale: 1,
            stagger: 0.06,
            duration: 0.35,
          },
          0.15,
        )
        .to(flame, { scale: 1, duration: 0.2 }, 0.55);
    },
    { dependencies: [] },
  );

  return (
    <section
      id="streak"
      ref={rootRef}
      className="bg-surface/50 px-5 py-20 sm:px-8 sm:py-40"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <h2 className="font-serif text-[clamp(1.85rem,5vw,3.75rem)] leading-[1.08] tracking-tight text-ink">
            {COPY.streakTitle}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
            {COPY.streakBody}
          </p>
        </Reveal>

        <Reveal delay={0.08} y={40}>
          <div className="rounded-[1.5rem] border border-ink/10 bg-paper p-6 shadow-[0_30px_60px_-40px_rgba(14,12,9,0.35)] sm:p-10">
            <div className="flex items-center gap-5">
              <div
                ref={flameRef}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1e4] sm:h-20 sm:w-20"
                aria-hidden
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[#e07a3a]"
                >
                  <path
                    d="M12 2s5 5.2 5 10a5 5 0 1 1-10 0c0-2.4 1.4-4.8 3-6.5C10.8 7.2 12 9 12 9s.7-1.6 1.6-2.8C15 4.4 12 2 12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <p className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">
                  <span ref={countRef}>0</span>
                  <span className="ml-2 text-2xl text-ink-muted sm:text-3xl">
                    Days
                  </span>
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-muted">
                  Streak
                </p>
              </div>
            </div>

            <div
              ref={daysRef}
              className="mt-8 grid grid-cols-7 gap-2 sm:mt-10 sm:gap-3"
            >
              {DAYS.map((day, i) => (
                <div key={`${day}-${i}`} className="text-center">
                  <div
                    data-day
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full sm:h-11 sm:w-11 ${
                      i < 5
                        ? "bg-gold/25 text-ink"
                        : i === 5
                          ? "bg-gold text-paper"
                          : "border border-ink/10 text-ink-muted"
                    }`}
                  >
                    {i < 6 ? (
                      <span className="text-[10px] font-medium sm:text-xs">
                        ✓
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                    {day}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-ink/10 pt-6">
              {[
                { label: "Words", value: "4.2k", icon: "crown" },
                { label: "Focus", value: "6h", icon: "clock" },
                { label: "Drafts", value: "11", icon: "book" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-surface/80 px-3 py-4 text-center"
                >
                  <p className="font-serif text-xl text-ink sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
