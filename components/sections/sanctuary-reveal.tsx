"use client";

import { useHeroSanctuaryAudio } from "@/hooks/use-hero-sanctuary-audio";
import { SOCIAL_CLUTTER } from "@/lib/constants";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

registerGsap();

function NotificationCard({
  platform,
  title,
  body,
  accent,
  index,
}: {
  platform: string;
  title: string;
  body: string;
  accent: string;
  index: number;
}) {
  const floatDuration = 3.2 + (index % 5) * 0.35;
  const floatDelay = index * 0.18;
  const tilt = ((index % 5) - 2) * 2.2;

  return (
    <motion.div
      className="relative w-[min(72vw,17.5rem)]"
      initial={{ opacity: 0, scale: 0.82, y: 18 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0],
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
        className="absolute -right-1 -top-1 z-10 h-3 w-3 rounded-full"
        style={{ background: accent }}
        animate={{ scale: [1, 1.35, 1], opacity: [1, 0.55, 1] }}
        transition={{
          duration: 1.6 + (index % 3) * 0.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.12,
        }}
      />
      <div className="rounded-2xl border border-white/30 bg-white/92 p-3.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.55)] backdrop-blur-md">
        <div className="mb-2 flex items-center gap-2">
          <motion.span
            className="relative flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ background: accent }}
            animate={{ boxShadow: [`0 0 0 0 ${accent}00`, `0 0 0 8px ${accent}00`, `0 0 0 0 ${accent}00`] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.1 }}
          >
            {platform.slice(0, 1)}
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: `0 0 0 0 ${accent}` }}
              animate={{
                boxShadow: [
                  `0 0 0 0 ${accent}55`,
                  `0 0 0 10px ${accent}00`,
                ],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: index * 0.15,
              }}
            />
          </motion.span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-ink">{title}</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">
              {platform}
            </p>
          </div>
          <motion.span
            className="text-[10px] text-ink-muted"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.08,
            }}
          >
            now
          </motion.span>
        </div>
        <p className="text-left text-[12px] leading-snug text-ink/85">{body}</p>
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
  const { unlock, setSanctuaryVolume, fadeOutPastHero } =
    useHeroSanctuaryAudio();

  useGSAP(
    () => {
      const root = rootRef.current;
      const pin = pinRef.current;
      const scene = sceneRef.current;
      const clutter = clutterRef.current;
      const veil = veilRef.current;
      const caption = captionRef.current;
      const progress = progressRef.current;
      if (!root || !pin || !scene || !clutter) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const pieces = gsap.utils.toArray<HTMLElement>(
        clutter.querySelectorAll("[data-clutter]"),
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
    { dependencies: [unlock, setSanctuaryVolume, fadeOutPastHero] },
  );

  return (
    <div
      id="sanctuary"
      ref={rootRef}
      className="relative h-[260vh]"
      aria-label="Clear the noise"
    >
      <div
        ref={pinRef}
        className="relative h-[100dvh] overflow-hidden bg-espresso"
      >
        <div
          ref={sceneRef}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/images/writing-studio-golden.png"
            alt="Serene artisan writing studio with golden light through the window"
            fill
            priority
            className="object-cover"
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
          {SOCIAL_CLUTTER.map((item, index) => (
            <div
              key={item.id}
              data-clutter
              data-ox={item.ox}
              data-oy={item.oy}
              data-rot={item.rot}
              className="absolute will-change-transform"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <NotificationCard {...item} index={index} />
              </div>
            </div>
          ))}
        </div>

        <div
          ref={captionRef}
          className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-espresso/85 via-espresso/40 to-transparent px-5 pb-14 pt-28 text-center sm:px-8"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-gold-soft">
            Your writing sanctuary
          </p>
          <p className="mx-auto mt-3 max-w-xl font-serif text-2xl text-paper sm:text-3xl">
            Clear the noise. Keep the page.
          </p>
        </div>

        <div className="absolute inset-x-8 bottom-5 z-40 h-0.5 overflow-hidden rounded-full bg-paper/20 sm:inset-x-16">
          <div ref={progressRef} className="hero-progress h-full bg-gold-soft" />
        </div>
      </div>
    </div>
  );
}
