"use client";

import { useHeroSanctuaryAudio } from "@/hooks/use-hero-sanctuary-audio";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { SOCIAL_CLUTTER } from "@/lib/constants";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useMemo, useRef } from "react";

registerGsap();

export function SanctuaryReveal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const ledgerRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { unlock, setSanctuaryVolume, fadeOutPastHero } =
    useHeroSanctuaryAudio();

  const lines = useMemo(
    () =>
      isMobile
        ? SOCIAL_CLUTTER.filter((item) => item.mobile)
        : [...SOCIAL_CLUTTER],
    [isMobile],
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      const pin = pinRef.current;
      const scene = sceneRef.current;
      const ledger = ledgerRef.current;
      const veil = veilRef.current;
      const caption = captionRef.current;
      const progress = progressRef.current;
      if (!root || !pin || !scene || !ledger) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const strikes = gsap.utils.toArray<HTMLElement>(
        ledger.querySelectorAll("[data-strike]"),
      );
      const rows = gsap.utils.toArray<HTMLElement>(
        ledger.querySelectorAll("[data-row]"),
      );

      if (reduced) {
        gsap.set(ledger, { opacity: 0 });
        gsap.set(scene, { scale: 1, filter: "none" });
        gsap.set(veil, { opacity: 0 });
        gsap.set(caption, { opacity: 1, y: 0 });
        if (progress) gsap.set(progress, { scaleX: 1 });
        return;
      }

      gsap.set(scene, { scale: 1.06, filter: "blur(8px) brightness(0.45)" });
      gsap.set(veil, { opacity: 0.55 });
      gsap.set(caption, { opacity: 0, y: 24 });
      gsap.set(ledger, { opacity: 1, y: 0, rotate: -0.6 });
      gsap.set(strikes, { scaleX: 0 });
      gsap.set(rows, { opacity: 1 });
      if (progress) gsap.set(progress, { scaleX: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.15,
          pin: pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.28) setSanctuaryVolume(0);
            else if (p < 0.72) setSanctuaryVolume((p - 0.28) / 0.44);
            else setSanctuaryVolume(1);
          },
          onLeave: () => fadeOutPastHero(),
          onLeaveBack: () => setSanctuaryVolume(0),
        },
      });

      // Gold strikethroughs draw across each ledger line
      strikes.forEach((strike, i) => {
        tl.to(
          strike,
          { scaleX: 1, duration: 0.12 },
          0.05 + i * 0.045,
        );
      });

      // Struck lines fade as the page clears
      rows.forEach((row, i) => {
        tl.to(
          row,
          { opacity: 0.28, duration: 0.1 },
          0.12 + i * 0.045,
        );
      });

      tl.to(
        ledger,
        {
          opacity: 0,
          y: -36,
          rotate: -2.4,
          filter: "blur(8px)",
          duration: 0.35,
        },
        0.42,
      );

      tl.to(
        scene,
        {
          scale: 1,
          filter: "blur(0px) brightness(1)",
          duration: 0.55,
        },
        0.28,
      );
      tl.to(veil, { opacity: 0, duration: 0.45 }, 0.3);
      tl.to(caption, { opacity: 1, y: 0, duration: 0.3 }, 0.58);
      if (progress) tl.to(progress, { scaleX: 1, duration: 1 }, 0);

      const unlockOnce = () => {
        void unlock();
        window.removeEventListener("scroll", unlockOnce);
        window.removeEventListener("pointerdown", unlockOnce);
      };
      window.addEventListener("scroll", unlockOnce, { passive: true });
      window.addEventListener("pointerdown", unlockOnce);
      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        window.removeEventListener("scroll", unlockOnce);
        window.removeEventListener("pointerdown", unlockOnce);
      };
    },
    {
      dependencies: [
        unlock,
        setSanctuaryVolume,
        fadeOutPastHero,
        lines,
        isMobile,
      ],
    },
  );

  return (
    <div
      id="sanctuary"
      ref={rootRef}
      className="relative h-[200vh] md:h-[260vh]"
      aria-label="Clear the noise"
    >
      <div
        ref={pinRef}
        className="relative h-[100dvh] overflow-hidden bg-espresso"
      >
        <div ref={sceneRef} className="absolute inset-0 will-change-transform">
          <Image
            src="/images/writing-sanctuary-focus.png"
            alt="Writer focused at a desk with headphones, papers, and a city window beyond"
            fill
            priority
            className="object-cover object-[72%_center] sm:object-[68%_center] md:object-[62%_center]"
            sizes="100vw"
          />
        </div>

        <div
          ref={veilRef}
          aria-hidden
          className="absolute inset-0 z-10 bg-espresso/55"
        />

        {/* Crossed-out ledger */}
        <div
          ref={ledgerRef}
          className="pointer-events-none absolute inset-x-0 top-[12%] z-20 flex justify-center px-4 sm:top-[14%] sm:px-8"
          aria-hidden
        >
          <div
            className="relative w-full max-w-lg overflow-hidden shadow-[0_24px_60px_-20px_rgba(14,12,9,0.65)] sm:max-w-xl"
            style={{
              background:
                "linear-gradient(180deg, #F7F4EE 0%, #F3EDE3 55%, #EFE8DB 100%)",
            }}
          >
            {/* Paper grain + ruled field */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.55]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    transparent,
                    transparent 2.35rem,
                    color-mix(in srgb, var(--gold) 28%, transparent) 2.35rem,
                    color-mix(in srgb, var(--gold) 28%, transparent) calc(2.35rem + 1px)
                  )
                `,
                backgroundPosition: "0 2.6rem",
              }}
            />
            {/* Classic ledger margin */}
            <div
              aria-hidden
              className="absolute bottom-3 left-[2.15rem] top-10 w-px sm:left-[2.6rem]"
              style={{
                background:
                  "color-mix(in srgb, #9a3b2f 55%, transparent)",
              }}
            />

            <div className="relative px-5 pb-5 pt-4 sm:px-7 sm:pb-6 sm:pt-5">
              <div className="mb-3 flex items-end justify-between border-b border-ink/10 pb-2.5">
                <p className="font-serif text-[11px] uppercase tracking-[0.2em] text-ink/55 sm:text-xs">
                  Distractions
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gold sm:text-[11px]">
                  Strike through
                </p>
              </div>

              <ul className="space-y-0">
                {lines.map((item, index) => (
                  <li
                    key={item.id}
                    data-row
                    className="relative flex min-h-[2.35rem] items-center pl-6 sm:min-h-[2.5rem] sm:pl-8"
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-ink/25"
                    />
                    <p
                      className={`relative w-full pr-2 leading-snug text-ink/90 ${
                        item.tone === "serif"
                          ? "font-serif text-[0.95rem] sm:text-[1.05rem]"
                          : "font-sans text-[0.8rem] tracking-wide sm:text-[0.88rem]"
                      }`}
                    >
                      {item.line}
                      {/* Gold strike — draws left → right via scaleX */}
                      <span
                        data-strike
                        className="absolute left-0 top-[52%] h-[1.5px] w-full origin-left bg-gold"
                        style={{
                          transform: "scaleX(0)",
                          boxShadow: "0 0 0 0.5px color-mix(in srgb, var(--gold) 40%, transparent)",
                        }}
                      />
                    </p>
                    <span className="sr-only">Line {index + 1}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          ref={captionRef}
          className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-espresso/90 via-espresso/45 to-transparent px-5 pb-[max(3.5rem,calc(env(safe-area-inset-bottom)+2.5rem))] pt-20 text-center sm:px-8 sm:pb-14 sm:pt-28"
        >
          <p className="text-[10px] uppercase tracking-[0.24em] text-gold-soft sm:text-xs">
            Your writing sanctuary
          </p>
          <p className="mx-auto mt-2 max-w-xl font-serif text-xl text-paper sm:mt-3 sm:text-3xl">
            Clear the noise. Keep the page.
          </p>
        </div>

        <div className="absolute inset-x-5 bottom-3 z-40 h-0.5 overflow-hidden rounded-full bg-paper/20 sm:inset-x-16 sm:bottom-5">
          <div ref={progressRef} className="hero-progress h-full bg-gold-soft" />
        </div>
      </div>
    </div>
  );
}
