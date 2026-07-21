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

      const syncScene = (index: number) => {
        if (index === lastIndexRef.current) return;
        lastIndexRef.current = index;
        const scene = SOUNDSCAPE_SCENES[index];
        if (!scene) return;
        titleEl.textContent = scene.title;
        trackEl.textContent = scene.track;
        caption.textContent = scene.line;
        void setScene(SCENE_IDS[index]);
      };

      if (reduced) {
        gsap.set(cards, { opacity: 0 });
        gsap.set(cards[0], { opacity: 1 });
        titleEl.textContent = SOUNDSCAPE_SCENES[0].title;
        trackEl.textContent = SOUNDSCAPE_SCENES[0].track;
        caption.textContent = SOUNDSCAPE_SCENES[0].line;
        return;
      }

      gsap.set(cards, { opacity: 0 });
      gsap.set(cards[0], { opacity: 1 });
      cards.forEach((card) => {
        const layers = card.querySelectorAll<HTMLElement>("[data-layer]");
        gsap.set(layers, { y: 0 });
      });
      titleEl.textContent = SOUNDSCAPE_SCENES[0].title;
      trackEl.textContent = SOUNDSCAPE_SCENES[0].track;
      caption.textContent = SOUNDSCAPE_SCENES[0].line;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
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
            cards.forEach((card) => {
              const layers = card.querySelectorAll<HTMLElement>("[data-layer]");
              layers.forEach((layer, li) => {
                const depth = (li + 1) * 18;
                gsap.set(layer, {
                  y: self.progress * depth * (li % 2 === 0 ? -1 : 1),
                });
              });
            });
          },
        },
      });

      SOUNDSCAPE_SCENES.forEach((scene, i) => {
        if (i === 0) return;
        const prev = cards[i - 1];
        const next = cards[i];
        const at = (i / SOUNDSCAPE_SCENES.length) * 0.92;
        tl.to(prev, { opacity: 0, duration: 0.18 }, at);
        tl.to(next, { opacity: 1, duration: 0.18 }, at);
        tl.call(
          () => {
            titleEl.textContent = scene.title;
            trackEl.textContent = scene.track;
            caption.textContent = scene.line;
          },
          undefined,
          at + 0.04,
        );
      });
    },
    { dependencies: [setScene, fadeOutSection, ensureBeds, unlockAudio] },
  );

  return (
    <section
      id="soundscapes"
      ref={rootRef}
      className="relative h-[280vh] bg-espresso md:h-[360vh]"
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
              <div
                data-layer
                className="absolute inset-[-8%] will-change-transform"
              >
                <Image
                  src={scene.image}
                  alt=""
                  fill
                  className="object-cover scale-110"
                  sizes="100vw"
                  priority={i === 0}
                />
              </div>
              <div
                data-layer
                className="absolute inset-0 will-change-transform"
                style={{ background: scene.midTint }}
              />
              <div
                data-layer
                className="absolute inset-0 will-change-transform"
                style={{
                  background: `radial-gradient(ellipse 70% 60% at 50% 45%, transparent 20%, ${scene.tint} 100%)`,
                }}
              />
            </div>
          ))}
        </div>

        <div className="relative z-20 flex h-full flex-col justify-between px-5 py-20 sm:px-10 sm:py-24">
          <div className="mx-auto w-full max-w-6xl">
            <p className="font-eyebrow text-[15px] tracking-wide text-gold-soft">
              Soundscapes
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-[clamp(1.85rem,5.5vw,3.75rem)] leading-[1.08] tracking-tight text-paper">
              {COPY.soundscapesTitle}
            </h2>
            <p className="font-accent mt-4 max-w-md text-base leading-relaxed text-paper/70 sm:text-lg">
              {COPY.soundscapesBody}
            </p>
          </div>

          <div className="mx-auto w-full max-w-6xl">
            <p
              ref={titleRef}
              className="font-eyebrow text-[15px] tracking-wide text-gold-soft"
            />
            <p
              ref={trackRef}
              className="mt-1 font-serif text-2xl text-paper sm:text-3xl"
            />
            <p
              ref={captionRef}
              className="font-accent mt-2 max-w-lg text-base leading-relaxed text-paper/70 sm:text-lg"
            />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-30 overflow-hidden border-t border-paper/10 bg-espresso/50 py-3 backdrop-blur-sm sm:py-4">
          <div className="marquee-track flex w-max gap-8 whitespace-nowrap px-4 font-eyebrow text-[13px] tracking-wide text-paper/55 sm:gap-10 sm:text-sm">
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
