"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type SoundContextValue = {
  muted: boolean;
  unlocked: boolean;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
  markUnlocked: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const toggleMuted = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  const markUnlocked = useCallback(() => {
    setUnlocked(true);
  }, []);

  const value = useMemo(
    () => ({ muted, unlocked, setMuted, toggleMuted, markUnlocked }),
    [muted, unlocked, toggleMuted, markUnlocked],
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
