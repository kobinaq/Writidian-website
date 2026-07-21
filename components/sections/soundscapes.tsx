"use client";

import { COPY, GENRES, SOUNDSCAPE_SCENES } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import {
  useSoundscapeAudio,
  type SoundscapeSceneId,
} from "@/hooks/use-soundscape-audio";
import { useSound } from "@/components/sound-context";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

registerGsap();

const SCENE_IDS = SOUNDSCAPE_SCENES.map((s) => s.id) as SoundscapeSceneId[];

export function Soundscapes() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const scenesRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const trackRef = useRef<HTMLParagraphElement>(null);
  const lastIndexRef = useRef(-1);
  const { setScene, fadeOutSection, ensureBeds } = useSoundscapeAudio();
  const { unlockAudio } = useSound();

  useGSAP(
    () => {
      const root = rootRef.current;
      const pin = pinRef.current;
      const scenes = scenesRef.current;
      const caption = captionRef.current;
      const titleEl = titleRef.current;
      const trackEl = trackRef.current;
      if (!root || !pin || !scenes || !caption || !titleEl || !trackEl) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const cards = gsap.utils.toArray<HTMLElement>(
        scenes.querySelectorAll("[data-scene]"),
      );

      const applyCopy = (index: number) => {
        const scene = SOUNDSCAPE_SCENES[index];
        if (!scene) return;
        titleEl.textContent = scene.title;
        trackEl.textContent = scene.track;
        caption.textContent = scene.line;
      };

      const syncScene = (index: number) => {
        if (index === lastIndexRef.current) return;
        lastIndexRef.current = index;
        applyCopy(index);
        void setScene(SCENE_IDS[index]);
      };

      if (reduced) {
        gsap.set(cards, { opacity: 0 });
        gsap.set(cards[0], { opacity: 1 });
        applyCopy(0);
        return;
      }

      gsap.set(cards, { opacity: 0 });
      gsap.set(cards[0], { opacity: 1 });
      applyCopy(0);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.05,
          pin: pin,
          anticipatePin: 1,
          onEnter: () => {
            void unlockAudio().then(() => ensureBeds());
            lastIndexRef.current = -1;
            syncScene(0);
          },
          onEnterBack: () => {
            void unlockAudio().then(() => ensureBeds());
            lastIndexRef.current = -1;
            syncScene(SCENE_IDS.length - 1);
          },
          onLeave: () => {
            lastIndexRef.current = -1;
            fadeOutSection();
          },
          onLeaveBack: () => {
            lastIndexRef.current = -1;
            fadeOutSection();
          },
          onUpdate: (self) => {
            const idx = Math.min(
              SCENE_IDS.length - 1,
              Math.floor(self.progress * 0.999 * SCENE_IDS.length),
            );
            syncScene(idx);

            const local = self.progress * SCENE_IDS.length - idx;
            const card = cards[idx];
            if (!card) return;
            const bg = card.querySelector<HTMLElement>("[data-layer='bg']");
            const mid = card.querySelector<HTMLElement>("[data-layer='mid']");
            const fg = card.querySelector<HTMLElement>("[data-layer='fg']");
            if (bg) gsap.set(bg, { y: local * -48, scale: 1.12 + local * 0.05 });
            if (mid) gsap.set(mid, { y: local * -16, opacity: 0.85 + local * 0.1 });
            if (fg) gsap.set(fg, { y: local * 36, scale: 1.05 + local * 0.04 });
          },
        },
      });

      SOUNDSCAPE_SCENES.forEach((_, i) => {
        if (i === 0) return;
        const prev = cards[i - 1];
        const next = cards[i];
        const at = (i / SOUNDSCAPE_SCENES.length) * 0.9;
        tl.to(prev, { opacity: 0, duration: 0.22 }, at);
        tl.fromTo(
          next,
          { opacity: 0, scale: 1.03 },
          { opacity: 1, scale: 1, duration: 0.24 },
          at,
        );
      });
    },
    { dependencies: [setScene, fadeOutSection, ensureBeds, unlockAudio] },
  );

  return (
    <section
      id="soundscapes"
      ref={rootRef}
      data-nav-theme="dark"
      className="relative h-[300vh] bg-espresso md:h-[400vh]"
    >
      <div ref={pinRef} className="relative h-[100dvh] overflow-hidden">
        <div ref={scenesRef} className="absolute inset-0">
          {SOUNDSCAPE_SCENES.map((scene, i) => (
            <div
              key={scene.id}
              data-scene
              className="absolute inset-0 will-change-transform"
              style={{ zIndex: i + 1 }}
            >
              {/* Far plate — slow parallax */}
              <div
                data-layer="bg"
                className="absolute inset-[-14%] will-change-transform"
              >
                <Image
                  src={scene.image}
                  alt=""
                  fill
                  className={`object-cover ${scene.objectPos}`}
                  sizes="100vw"
                  priority={i === 0}
                />
              </div>

              {/* Atmosphere wash */}
              <div
                data-layer="mid"
                className="absolute inset-0 will-change-transform"
                style={{ background: scene.midTint }}
              />

              {/* Near plate — same photo, lower crop, faster travel */}
              <div
                data-layer="fg"
                className="absolute inset-x-[-8%] bottom-[-10%] top-[32%] will-change-transform"
              >
                <Image
                  src={scene.image}
                  alt=""
                  fill
                  className={`object-cover ${scene.fgPos} [mask-image:linear-gradient(to_top,black_40%,transparent_100%)]`}
                  sizes="100vw"
                />
              </div>

              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse 78% 68% at 50% 40%, transparent 12%, ${scene.tint} 100%)`,
                }}
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-espresso/80 to-transparent" />
            </div>
          ))}
        </div>

        <div className="relative z-20 flex h-full flex-col justify-between px-5 pb-[4.5rem] pt-24 sm:px-10 sm:pb-24 sm:pt-28">
          <div className="mx-auto w-full max-w-6xl">
            <p className="font-eyebrow text-[15px] tracking-wide text-gold-soft">
              Soundscapes
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-[clamp(1.9rem,5.5vw,3.75rem)] leading-[1.08] tracking-tight text-paper">
              {COPY.soundscapesTitle}
            </h2>
            <p className="font-accent mt-4 max-w-md text-base leading-relaxed text-paper/75 sm:text-lg">
              {COPY.soundscapesBody}
            </p>
            <ul className="font-accent mt-5 max-w-lg space-y-2 text-sm leading-relaxed text-paper/65 sm:text-base">
              {COPY.soundscapesBullets.map((bullet) => (
                <li key={bullet} className="flex gap-2.5">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-soft" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-xl border-l border-gold-soft/40 pl-5 sm:pl-6">
              <p
                ref={titleRef}
                className="font-eyebrow text-[15px] tracking-wide text-gold-soft"
              />
              <p
                ref={trackRef}
                className="mt-1.5 font-serif text-2xl text-paper sm:text-3xl"
              />
              <p
                ref={captionRef}
                className="font-accent mt-2 text-base leading-relaxed text-paper/70 sm:text-lg"
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-30 overflow-hidden border-t border-paper/10 bg-espresso/55 py-3 backdrop-blur-sm sm:py-3.5">
          <div className="marquee-track flex w-max gap-8 whitespace-nowrap px-4 font-eyebrow text-[13px] tracking-wide text-paper/55 sm:gap-10">
            {[...GENRES, ...GENRES].map((g, i) => (
              <span
                key={`${g}-${i}`}
                className="flex items-center gap-8 sm:gap-10"
              >
                {g}
                <span className="text-gold-soft">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
