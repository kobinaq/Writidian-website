"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSound } from "@/components/sound-context";
import {
  createCoastAmbience,
  createForestNightAmbience,
  createNightDeskAmbience,
  type AmbientHandle,
} from "@/lib/ambient-audio";

export type SoundscapeSceneId =
  | "romance"
  | "horror"
  | "scifi"
  | "fantasy"
  | "literary";

const ALL_IDS: SoundscapeSceneId[] = [
  "romance",
  "horror",
  "scifi",
  "fantasy",
  "literary",
];

export function useSoundscapeAudio() {
  const { muted, unlockAudio } = useSound();
  const bedsRef = useRef<Partial<Record<SoundscapeSceneId, AmbientHandle>>>(
    {},
  );
  const activeRef = useRef<SoundscapeSceneId | null>(null);
  const mutedRef = useRef(muted);
  const inSectionRef = useRef(false);

  useEffect(() => {
    mutedRef.current = muted;
    const beds = bedsRef.current;
    (Object.keys(beds) as SoundscapeSceneId[]).forEach((id) => {
      if (muted || !inSectionRef.current) {
        beds[id]?.setTargetVolume(0, 0.3);
      } else if (id === activeRef.current) {
        beds[id]?.setTargetVolume(1, 0.4);
      }
    });
  }, [muted]);

  useEffect(() => {
    return () => {
      Object.values(bedsRef.current).forEach((bed) => bed?.stop());
      bedsRef.current = {};
    };
  }, []);

  const ensureBeds = useCallback(async () => {
    const ctx = await unlockAudio();
    if (!ctx) return null;
    // Map genres onto existing ambient beds (distinct enough for scrub cues)
    if (!bedsRef.current.romance) {
      bedsRef.current.romance = createCalmLike(ctx, "coast");
    }
    if (!bedsRef.current.horror) {
      bedsRef.current.horror = createCalmLike(ctx, "night");
    }
    if (!bedsRef.current.scifi) {
      bedsRef.current.scifi = createCalmLike(ctx, "forest");
    }
    if (!bedsRef.current.fantasy) {
      bedsRef.current.fantasy = createCalmLike(ctx, "coast");
    }
    if (!bedsRef.current.literary) {
      bedsRef.current.literary = createCalmLike(ctx, "night");
    }
    await Promise.all(
      Object.values(bedsRef.current).map((b) => b?.resume()),
    );
    return bedsRef.current;
  }, [unlockAudio]);

  const setScene = useCallback(
    async (scene: SoundscapeSceneId | null) => {
      if (
        scene === activeRef.current &&
        inSectionRef.current === (scene !== null)
      ) {
        return;
      }
      const beds = await ensureBeds();
      if (!beds) return;
      activeRef.current = scene;
      inSectionRef.current = scene !== null;
      ALL_IDS.forEach((id) => {
        const target =
          !mutedRef.current && scene === id && inSectionRef.current ? 1 : 0;
        beds[id]?.setTargetVolume(target, 0.55);
      });
    },
    [ensureBeds],
  );

  const fadeOutSection = useCallback(() => {
    if (!inSectionRef.current && activeRef.current === null) return;
    inSectionRef.current = false;
    activeRef.current = null;
    Object.values(bedsRef.current).forEach((bed) => {
      bed?.setTargetVolume(0, 0.7);
    });
  }, []);

  return { setScene, fadeOutSection, ensureBeds };
}

function createCalmLike(
  ctx: AudioContext,
  kind: "forest" | "coast" | "night",
): AmbientHandle {
  if (kind === "forest") return createForestNightAmbience(ctx);
  if (kind === "coast") return createCoastAmbience(ctx);
  return createNightDeskAmbience(ctx);
}
