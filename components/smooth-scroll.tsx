"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

registerGsap();

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

function isCoarsePointer() {
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches
  );
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    const onHashChange = () => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    window.addEventListener("hashchange", onHashChange);

    // Touch / coarse pointers: native scroll only (Lenis fights pin+scrub on iOS)
    if (reduced || isCoarsePointer()) {
      const onScroll = () => ScrollTrigger.update();
      window.addEventListener("scroll", onScroll, { passive: true });
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("hashchange", onHashChange);
        window.removeEventListener("scroll", onScroll);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.1,
    });

    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("hashchange", onHashChange);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
