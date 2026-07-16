"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

registerGsap();

/** Fixed nav clearance so hash targets aren't tucked under the bar. */
const ANCHOR_OFFSET = -88;

function scrollToHash(
  hash: string,
  lenis: Lenis | null,
  immediate = false,
) {
  if (!hash || hash === "#") return;
  const id = decodeURIComponent(hash.slice(1));
  const el = document.getElementById(id);
  if (!el) return;

  ScrollTrigger.refresh();

  if (lenis) {
    lenis.scrollTo(el, {
      offset: ANCHOR_OFFSET,
      immediate,
      duration: 1.15,
    });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + ANCHOR_OFFSET;
    window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let lenis: Lenis | null = null;

    if (!reduced) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.1,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const ticker = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);

      requestAnimationFrame(() => ScrollTrigger.refresh());

      const onClick = (event: MouseEvent) => {
        const target = (event.target as Element | null)?.closest(
          'a[href^="#"]',
        ) as HTMLAnchorElement | null;
        if (!target) return;
        const href = target.getAttribute("href");
        if (!href || href === "#") return;
        const url = new URL(href, window.location.href);
        if (url.pathname !== window.location.pathname) return;
        if (!document.getElementById(decodeURIComponent(url.hash.slice(1)))) {
          return;
        }
        event.preventDefault();
        history.pushState(null, "", url.hash);
        scrollToHash(url.hash, lenis);
      };

      document.addEventListener("click", onClick);

      if (window.location.hash) {
        requestAnimationFrame(() => {
          scrollToHash(window.location.hash, lenis, true);
        });
      }

      return () => {
        document.removeEventListener("click", onClick);
        window.removeEventListener("resize", onResize);
        gsap.ticker.remove(ticker);
        lenis?.destroy();
      };
    }

    // Reduced motion: native scroll with the same offset for hash links
    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || href === "#") return;
      const url = new URL(href, window.location.href);
      if (url.pathname !== window.location.pathname) return;
      if (!document.getElementById(decodeURIComponent(url.hash.slice(1)))) {
        return;
      }
      event.preventDefault();
      history.pushState(null, "", url.hash);
      scrollToHash(url.hash, null);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <>{children}</>;
}
