"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SoundContextValue = {
  muted: boolean;
  unlocked: boolean;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
  unlockAudio: () => Promise<AudioContext | null>;
  getAudioContext: () => AudioContext | null;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const toggleMuted = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  const unlockAudio = useCallback(async () => {
    if (typeof window === "undefined") return null;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return null;
    }
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      await ctxRef.current.resume();
    }
    setUnlocked(true);
    return ctxRef.current;
  }, []);

  const getAudioContext = useCallback(() => ctxRef.current, []);

  const value = useMemo(
    () => ({
      muted,
      unlocked,
      setMuted,
      toggleMuted,
      unlockAudio,
      getAudioContext,
    }),
    [muted, unlocked, toggleMuted, unlockAudio, getAudioContext],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error("useSound must be used within SoundProvider");
  }
  return ctx;
}
