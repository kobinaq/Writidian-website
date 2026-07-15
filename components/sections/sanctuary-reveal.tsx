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

const TEAR_SHAPES = [
  "polygon(2% 6%, 18% 1%, 38% 7%, 56% 2%, 74% 8%, 92% 3%, 100% 14%, 97% 38%, 100% 62%, 94% 86%, 78% 98%, 54% 93%, 32% 100%, 12% 94%, 0% 78%, 3% 48%, 0% 22%)",
  "polygon(0% 10%, 22% 2%, 44% 8%, 68% 0%, 88% 7%, 100% 18%, 96% 42%, 100% 68%, 92% 92%, 70% 100%, 46% 94%, 24% 100%, 6% 88%, 0% 64%, 4% 36%)",
  "polygon(4% 0%, 28% 5%, 52% 0%, 76% 6%, 98% 2%, 100% 28%, 94% 52%, 100% 76%, 88% 100%, 58% 95%, 34% 100%, 10% 92%, 0% 70%, 5% 42%, 0% 16%)",
  "polygon(0% 4%, 16% 0%, 40% 6%, 62% 1%, 84% 8%, 100% 4%, 98% 32%, 100% 58%, 95% 84%, 72% 100%, 48% 94%, 22% 100%, 0% 82%, 3% 54%, 0% 28%)",
  "polygon(6% 2%, 30% 0%, 54% 7%, 78% 1%, 100% 10%, 97% 36%, 100% 60%, 93% 88%, 68% 100%, 42% 95%, 18% 100%, 0% 86%, 2% 58%, 0% 30%, 4% 12%)",
] as const;

function PaperScrap({
  line,
  tone,
  index,
  compact,
}: {
  line: string;
  tone: "serif" | "sans";
  index: number;
  compact?: boolean;
}) {
  const floatDuration = 3.4 + (index % 5) * 0.4;
  const floatDelay = index * 0.16;
  const tilt = ((index % 5) - 2) * 3.4;
  const floatY = compact ? 3 : 6;
  const tear = TEAR_SHAPES[index % TEAR_SHAPES.length];
  const paperTint =
    index % 3 === 0
      ? "#F7F4EE"
      : index % 3 === 1
        ? "#F3EDE3"
        : "#EFE8DB";

  return (
    <motion.div
      className={`relative ${compact ? "w-[min(48vw,12rem)]" : "w-[min(70vw,16.5rem)]"}`}
      initial={{ opacity: 0, scale: 0.86, y: 14 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -floatY, 0],
        rotate: [tilt, tilt + 1.8, tilt],
      }}
      transition={{
        opacity: { duration: 0.5, delay: floatDelay * 0.3 },
        scale: {
          type: "spring",
          stiffness: 220,
          damping: 20,
          delay: floatDelay * 0.3,
        },
        y: {
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        },
        rotate: {
          duration: floatDuration * 1.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        },
      }}
    >
      <div
        className={`relative shadow-[0_14px_28px_-14px_rgba(14,12,9,0.55)] ${
          compact ? "px-3.5 py-3" : "px-4 py-3.5"
        }`}
        style={{
          backgroundColor: paperTint,
          clipPath: tear,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 13px, color-mix(in srgb, var(--gold) 55%, transparent) 13px, color-mix(in srgb, var(--gold) 55%, transparent) 14px)",
            backgroundPosition: "0 10px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[12%] top-[18%] h-px bg-gold/35"
        />
        <p
          className={`relative text-left leading-snug text-ink ${
            tone === "serif" ? "font-serif" : "font-sans"
          } ${
            compact
              ? "text-[11px]"
              : tone === "serif"
                ? "text-[15px]"
                : "text-[13px]"
          }`}
        >
          {line}
        </p>
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
            scale: 1.15,
            opacity: 0,
            filter: "blur(14px)",
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
            src="/images/writing-sanctuary-focus.jpg"
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
                <PaperScrap
                  line={item.line}
                  tone={item.tone}
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
            Clear the distractions. Build your world.
          </p>
        </div>

        <div className="absolute inset-x-5 bottom-3 z-40 h-0.5 overflow-hidden rounded-full bg-paper/20 sm:inset-x-16 sm:bottom-5">
          <div ref={progressRef} className="hero-progress h-full bg-gold-soft" />
        </div>
      </div>
    </div>
  );
}
