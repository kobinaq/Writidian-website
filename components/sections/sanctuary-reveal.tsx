"use client";

import { useHeroSanctuaryAudio } from "@/hooks/use-hero-sanctuary-audio";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { SOCIAL_CLUTTER } from "@/lib/constants";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useMemo, useRef } from "react";

registerGsap();

function NotificationCard({
  platform,
  title,
  body,
  accent,
  index,
  compact,
}: {
  platform: string;
  title: string;
  body: string;
  accent: string;
  index: number;
  compact?: boolean;
}) {
  const floatDuration = 3.2 + (index % 5) * 0.35;
  const floatDelay = index * 0.18;
  const tilt = ((index % 5) - 2) * 2.2;
  const floatY = compact ? 4 : 8;

  return (
    <motion.div
      className={`relative ${compact ? "w-[min(46vw,11.5rem)]" : "w-[min(72vw,17.5rem)]"}`}
      initial={{ opacity: 0, scale: 0.82, y: 18 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -floatY, 0],
        rotate: [tilt, tilt + 1.4, tilt],
      }}
      transition={{
        opacity: { duration: 0.45, delay: floatDelay * 0.35 },
        scale: {
          type: "spring",
          stiffness: 280,
          damping: 18,
          delay: floatDelay * 0.35,
        },
        y: {
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        },
        rotate: {
          duration: floatDuration * 1.15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        },
      }}
    >
      <motion.span
        aria-hidden
        className="absolute -right-1 -top-1 z-10 h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3"
        style={{ background: accent }}
        animate={{ scale: [1, 1.35, 1], opacity: [1, 0.55, 1] }}
        transition={{
          duration: 1.6 + (index % 3) * 0.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.12,
        }}
      />
      <div
        className={`rounded-2xl border border-white/30 bg-white/92 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.55)] backdrop-blur-md ${
          compact ? "p-2.5" : "p-3.5"
        }`}
      >
        <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
          <span
            className={`relative flex shrink-0 items-center justify-center rounded-full font-bold text-white ${
              compact ? "h-6 w-6 text-[9px]" : "h-8 w-8 text-[11px]"
            }`}
            style={{ background: accent }}
          >
            {platform.slice(0, 1)}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`truncate font-semibold text-ink ${
                compact ? "text-[10px]" : "text-xs"
              }`}
            >
              {title}
            </p>
            <p className="text-[9px] uppercase tracking-[0.14em] text-ink-muted sm:text-[10px]">
              {platform}
            </p>
          </div>
          <span className="shrink-0 text-[9px] text-ink-muted sm:text-[10px]">
            now
          </span>
        </div>
        <p
          className={`text-left leading-snug text-ink/85 ${
            compact ? "text-[10px] line-clamp-2" : "text-[12px]"
          }`}
        >
          {body}
        </p>
        {!compact && (
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-ink/8">
            <motion.div
              className="h-full rounded-full"
              style={{ background: accent }}
              initial={{ width: "12%" }}
              animate={{ width: ["12%", "88%", "40%", "70%"] }}
              transition={{
                duration: 5 + (index % 4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function SanctuaryReveal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const clutterRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { unlock, setSanctuaryVolume, fadeOutPastHero } =
    useHeroSanctuaryAudio();

  const clutter = useMemo(
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
      const clutterEl = clutterRef.current;
      const veil = veilRef.current;
      const caption = captionRef.current;
      const progress = progressRef.current;
      if (!root || !pin || !scene || !clutterEl) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const pieces = gsap.utils.toArray<HTMLElement>(
        clutterEl.querySelectorAll("[data-clutter]"),
      );

      if (reduced) {
        gsap.set(pieces, { opacity: 0 });
        gsap.set(scene, { scale: 1, filter: "none" });
        gsap.set(veil, { opacity: 0 });
        gsap.set(caption, { opacity: 1, y: 0 });
        if (progress) gsap.set(progress, { scaleX: 1 });
        return;
      }

      gsap.set(scene, { scale: 1.06, filter: "blur(8px) brightness(0.45)" });
      gsap.set(veil, { opacity: 0.6 });
      gsap.set(caption, { opacity: 0, y: 24 });
      gsap.set(pieces, {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        filter: "blur(0px)",
      });
      if (progress) gsap.set(progress, { scaleX: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.85,
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

      pieces.forEach((piece, i) => {
        const ox = Number(piece.dataset.ox ?? 0);
        const oy = Number(piece.dataset.oy ?? 0);
        const rot = Number(piece.dataset.rot ?? 0);
        tl.to(
          piece,
          {
            x: `${ox}vw`,
            y: `${oy}vh`,
            rotate: rot,
            scale: 1.2,
            opacity: 0,
            filter: "blur(16px)",
            duration: 0.55,
          },
          0.04 + i * 0.03,
        );
      });

      tl.to(
        scene,
        {
          scale: 1,
          filter: "blur(0px) brightness(1)",
          duration: 0.55,
        },
        0.2,
      );
      tl.to(veil, { opacity: 0, duration: 0.45 }, 0.22);
      tl.to(caption, { opacity: 1, y: 0, duration: 0.3 }, 0.55);
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
        clutter,
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
            src="/images/writing-studio-notebook.png"
            alt="Serene artisan writing studio with an open notebook and golden light through the window"
            fill
            priority
            className="object-cover object-[center_40%] md:object-center"
            sizes="100vw"
          />
        </div>

        <div
          ref={veilRef}
          aria-hidden
          className="absolute inset-0 z-10 bg-espresso/55"
        />

        <div
          ref={clutterRef}
          className="pointer-events-none absolute inset-0 z-20"
          aria-hidden
        >
          {clutter.map((item, index) => (
            <div
              key={item.id}
              data-clutter
              data-ox={item.ox}
              data-oy={item.oy}
              data-rot={item.rot}
              className="absolute will-change-transform"
              style={{
                left: `${isMobile ? item.mx : item.x}%`,
                top: `${isMobile ? item.my : item.y}%`,
              }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <NotificationCard
                  {...item}
                  index={index}
                  compact={isMobile}
                />
              </div>
            </div>
          ))}
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
