"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSound } from "@/components/sound-context";

const MAX_GAIN = 0.28;

function createSanctuaryPad(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 480;
  filter.Q.value = 0.7;
  filter.connect(master);

  const freqs = [110, 164.81, 220, 329.63];
  const oscillators = freqs.map((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = i % 2 === 0 ? "sine" : "triangle";
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.value = i === 0 ? 0.35 : 0.12;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.08 + i * 0.03;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 4 + i;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(gain);
    gain.connect(filter);
    osc.start();
    lfo.start();

    return { osc, lfo, gain };
  });

  return {
    master,
    setTargetVolume(level: number, ramp = 0.35) {
      const now = ctx.currentTime;
      const clamped = Math.max(0, Math.min(1, level)) * MAX_GAIN;
      master.gain.cancelScheduledValues(now);
      master.gain.setTargetAtTime(clamped, now, ramp);
    },
    async resume() {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
    },
    stop() {
      oscillators.forEach(({ osc, lfo }) => {
        try {
          osc.stop();
          lfo.stop();
        } catch {
          /* already stopped */
        }
      });
      void ctx.close();
    },
  };
}

type Pad = ReturnType<typeof createSanctuaryPad>;

export function useHeroSanctuaryAudio() {
  const { muted, unlocked, markUnlocked } = useSound();
  const padRef = useRef<Pad | null>(null);
  const volumeRef = useRef(0);
  const mutedRef = useRef(muted);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    mutedRef.current = muted;
    if (!padRef.current) return;
    if (muted || reducedMotionRef.current) {
      padRef.current.setTargetVolume(0, 0.2);
    } else {
      padRef.current.setTargetVolume(volumeRef.current, 0.25);
    }
  }, [muted]);

  useEffect(() => {
    return () => {
      padRef.current?.stop();
      padRef.current = null;
    };
  }, []);

  const unlock = useCallback(async () => {
    if (reducedMotionRef.current) return;
    if (!padRef.current) {
      const ctx = new AudioContext();
      padRef.current = createSanctuaryPad(ctx);
    }
    await padRef.current.resume();
    markUnlocked();
  }, [markUnlocked]);

  const setSanctuaryVolume = useCallback((level: number) => {
    volumeRef.current = level;
    if (!padRef.current || mutedRef.current || reducedMotionRef.current) return;
    padRef.current.setTargetVolume(level, level > 0.05 ? 0.4 : 0.55);
  }, []);

  const fadeOutPastHero = useCallback(() => {
    volumeRef.current = 0;
    padRef.current?.setTargetVolume(0, 0.75);
  }, []);

  return {
    unlocked,
    muted,
    unlock,
    setSanctuaryVolume,
    fadeOutPastHero,
  };
}
