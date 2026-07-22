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

const SCENE_IDS: SoundscapeSceneId[] = ["forest", "coast", "night"];

export function Soundscapes() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const scenesRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
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
      if (!root || !pin || !scenes || !caption || !titleEl) return;

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
        caption.textContent = scene.line;
        void setScene(SCENE_IDS[index]);
      };

      if (reduced) {
        gsap.set(cards, { opacity: 0 });
        gsap.set(cards[0], { opacity: 1 });
        titleEl.textContent = SOUNDSCAPE_SCENES[0].title;
        caption.textContent = SOUNDSCAPE_SCENES[0].line;
        return;
      }

      gsap.set(cards, { opacity: 0, scale: 1.04 });
      gsap.set(cards[0], { opacity: 1, scale: 1 });
      titleEl.textContent = SOUNDSCAPE_SCENES[0].title;
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
          },
        },
      });

      SOUNDSCAPE_SCENES.forEach((scene, i) => {
        if (i === 0) return;
        const prev = cards[i - 1];
        const next = cards[i];
        const at = i * 0.32;
        tl.to(prev, { opacity: 0, scale: 0.97, duration: 0.22 }, at);
        tl.to(next, { opacity: 1, scale: 1, duration: 0.22 }, at);
        tl.call(
          () => {
            titleEl.textContent = scene.title;
            caption.textContent = scene.line;
          },
          undefined,
          at + 0.05,
        );
      });
    },
    { dependencies: [setScene, fadeOutSection, ensureBeds, unlockAudio] },
  );

  return (
    <section
      id="soundscapes"
      ref={rootRef}
      className="relative h-[220vh] md:h-[280vh] bg-paper"
    >
      <div ref={pinRef} className="flex h-[100dvh] flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-6xl min-h-0 flex-1 flex-col justify-center gap-5 px-5 py-16 sm:gap-8 sm:px-8 sm:py-20 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-center lg:gap-14 lg:py-16">
          <div className="shrink-0">
            <h2 className="font-serif text-[clamp(1.85rem,6vw,3.75rem)] leading-[1.08] tracking-tight text-ink">
              {COPY.soundscapesTitle}
            </h2>
            <p className="font-accent mt-3 max-w-md text-sm leading-relaxed text-ink-muted sm:mt-6 sm:text-lg">
              {COPY.soundscapesBody}
            </p>
            <p className="font-accent mt-3 hidden max-w-md text-sm leading-relaxed text-ink md:block">
              {COPY.binaurals}
            </p>
            <p className="font-accent mt-1 hidden text-sm italic text-ink-muted md:block">
              {COPY.binauralsTip}
            </p>
          </div>

          <div className="flex min-h-0 w-full flex-1 flex-col lg:flex-none">
            <div
              ref={scenesRef}
              className="relative min-h-[32vh] w-full flex-1 overflow-hidden rounded-2xl bg-surface shadow-[0_30px_60px_-35px_rgba(14,12,9,0.45)] sm:rounded-[1.75rem] lg:aspect-[4/3] lg:min-h-0 lg:flex-none"
            >
              {SOUNDSCAPE_SCENES.map((scene, i) => (
                <div
                  key={scene.id}
                  data-scene
                  className="absolute inset-0 will-change-transform"
                  style={{ zIndex: i + 1 }}
                >
                  <Image
                    src={scene.image}
                    alt={`${scene.title} soundscape`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 min-h-[3.25rem] shrink-0 sm:mt-5 sm:min-h-[4.5rem]">
              <p
                ref={titleRef}
                className="font-eyebrow text-[10px] uppercase tracking-[0.22em] text-gold sm:text-xs"
              />
              <p
                ref={captionRef}
                className="font-accent mt-1.5 text-sm leading-relaxed text-ink-muted sm:mt-2 sm:text-base"
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 overflow-hidden border-t border-ink/5 bg-surface/80 py-3 sm:py-4">
          <div className="marquee-track font-eyebrow flex w-max gap-8 whitespace-nowrap px-4 text-[11px] uppercase tracking-[0.2em] text-ink-muted sm:gap-10 sm:text-sm">
            {[...GENRES, ...GENRES].map((g, i) => (
              <span key={`${g}-${i}`} className="flex items-center gap-8 sm:gap-10">
                {g}
                <span className="text-gold">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
