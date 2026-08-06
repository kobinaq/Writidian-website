"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSound } from "@/components/sound-context";
import {
  createSampleAmbience,
  SOUNDSCAPE_AUDIO_URLS,
  type AmbientHandle,
} from "@/lib/ambient-audio";

export type SoundscapeSceneId =
  | "journaling"
  | "literary-fiction"
  | "romance"
  | "horror"
  | "non-binaural";

const SCENE_IDS = Object.keys(
  SOUNDSCAPE_AUDIO_URLS,
) as SoundscapeSceneId[];

export function useSoundscapeAudio() {
  const { muted, unlockAudio } = useSound();
  const bedsRef = useRef<Partial<Record<SoundscapeSceneId, AmbientHandle>>>(
    {},
  );
  const loadingRef = useRef<Promise<typeof bedsRef.current> | null>(null);
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

    if (bedsRef.current.journaling) {
      await Promise.all(
        Object.values(bedsRef.current).map((b) => b?.resume()),
      );
      return bedsRef.current;
    }

    if (!loadingRef.current) {
      loadingRef.current = (async () => {
        const loaded = await Promise.all(
          SCENE_IDS.map(async (id) => {
            const bed = await createSampleAmbience(
              ctx,
              SOUNDSCAPE_AUDIO_URLS[id],
            );
            return [id, bed] as const;
          }),
        );
        for (const [id, bed] of loaded) {
          bedsRef.current[id] = bed;
        }
        await Promise.all(
          Object.values(bedsRef.current).map((b) => b?.resume()),
        );
        return bedsRef.current;
      })().finally(() => {
        loadingRef.current = null;
      });
    }

    return loadingRef.current;
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
      SCENE_IDS.forEach((id) => {
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
