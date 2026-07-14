"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSound } from "@/components/sound-context";
import {
  createCalmStudioAmbience,
  type AmbientHandle,
} from "@/lib/ambient-audio";

export function useHeroSanctuaryAudio() {
  const { muted, unlocked, unlockAudio } = useSound();
  const padRef = useRef<AmbientHandle | null>(null);
  const volumeRef = useRef(0);
  const mutedRef = useRef(muted);

  useEffect(() => {
    mutedRef.current = muted;
    if (!padRef.current) return;
    if (muted) {
      padRef.current.setTargetVolume(0, 0.25);
    } else {
      padRef.current.setTargetVolume(volumeRef.current, 0.35);
    }
  }, [muted]);

  useEffect(() => {
    return () => {
      padRef.current?.stop();
      padRef.current = null;
    };
  }, []);

  const unlock = useCallback(async () => {
    const ctx = await unlockAudio();
    if (!ctx) return;
    if (!padRef.current) {
      padRef.current = createCalmStudioAmbience(ctx);
    }
    await padRef.current.resume();
  }, [unlockAudio]);

  const setSanctuaryVolume = useCallback((level: number) => {
    volumeRef.current = level;
    if (!padRef.current || mutedRef.current) return;
    padRef.current.setTargetVolume(level, level > 0.05 ? 0.5 : 0.7);
  }, []);

  const fadeOutPastHero = useCallback(() => {
    volumeRef.current = 0;
    padRef.current?.setTargetVolume(0, 0.9);
  }, []);

  return {
    unlocked,
    muted,
    unlock,
    setSanctuaryVolume,
    fadeOutPastHero,
  };
}
