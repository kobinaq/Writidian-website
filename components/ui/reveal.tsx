"use client";

import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";

registerGsap();

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 64,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        gsap.set(el, { opacity: 1, y: 0, clearProps: "all" });
        return;
      }

      gsap.fromTo(
        el,
        { opacity: 0, y, rotateX: 4 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1.15,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        },
      );
    },
    { dependencies: [delay, y] },
  );

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
