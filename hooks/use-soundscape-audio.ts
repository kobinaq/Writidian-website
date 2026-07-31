"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSound } from "@/components/sound-context";
import {
  createAmberDriftAmbience,
  createBasementDoorAjarAmbience,
  createBubblyReflectionAmbience,
  createDustyPhotoFrameAmbience,
  createRainBirdsongAmbience,
  type AmbientHandle,
} from "@/lib/ambient-audio";

export type SoundscapeSceneId =
  | "journaling"
  | "literary-fiction"
  | "romance"
  | "horror"
  | "non-binaural";

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
    if (!bedsRef.current.journaling) {
      bedsRef.current.journaling = createBubblyReflectionAmbience(ctx);
    }
    if (!bedsRef.current["literary-fiction"]) {
      bedsRef.current["literary-fiction"] = createDustyPhotoFrameAmbience(ctx);
    }
    if (!bedsRef.current.romance) {
      bedsRef.current.romance = createAmberDriftAmbience(ctx);
    }
    if (!bedsRef.current.horror) {
      bedsRef.current.horror = createBasementDoorAjarAmbience(ctx);
    }
    if (!bedsRef.current["non-binaural"]) {
      bedsRef.current["non-binaural"] = createRainBirdsongAmbience(ctx);
    }
    await Promise.all(
      Object.values(bedsRef.current).map((b) => b?.resume()),
    );
    return bedsRef.current;
  }, [unlockAudio]);

  const setScene = useCallback(
    async (scene: SoundscapeSceneId | null) => {
      if (scene === activeRef.current && inSectionRef.current === (scene !== null)) {
        return;
      }
      const beds = await ensureBeds();
      if (!beds) return;
      activeRef.current = scene;
      inSectionRef.current = scene !== null;
      ([
        "journaling",
        "literary-fiction",
        "romance",
        "horror",
        "non-binaural",
      ] as SoundscapeSceneId[]).forEach((id) => {
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
