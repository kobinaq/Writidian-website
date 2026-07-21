"use client";

import { COPY } from "@/lib/constants";
import { gsap, registerGsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { useMemo, useRef } from "react";

registerGsap();

const ARTIFACTS = [
  {
    x: "6%",
    y: "14%",
    rot: -7,
    kind: "tabs" as const,
    label: "12 tabs open",
  },
  {
    x: "74%",
    y: "18%",
    rot: 5,
    kind: "ping" as const,
    label: "ping",
  },
  {
    x: "10%",
    y: "66%",
    rot: -4,
    kind: "wire" as const,
    label: "rewrite?",
  },
  {
    x: "68%",
    y: "60%",
    rot: 6,
    kind: "clock" as const,
    label: "standup in 5",
  },
  {
    x: "40%",
    y: "78%",
    rot: -3,
    kind: "scroll" as const,
    label: "keep scrolling",
  },
] as const;

function ArtifactGlyph({ kind }: { kind: (typeof ARTIFACTS)[number]["kind"] }) {
  if (kind === "tabs") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 5v4M13 5v4" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === "ping") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 4a6 6 0 0 1 6 6v3.2l1.4 2.1a1 1 0 0 1-.85 1.55H5.45a1 1 0 0 1-.85-1.55L6 13.2V10a6 6 0 0 1 6-6Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M10 18a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === "wire") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 8c4 8 12-4 16 4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path d="M7 17 17 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "clock") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
        <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 7h12M6 12h12M6 17h8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="m15 15 3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Problem() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const leadWords = useMemo(() => COPY.problemLead.split(" "), []);
  const purposeWords = useMemo(() => COPY.problemPurpose.split(" "), []);

  useGSAP(
    () => {
      const root = rootRef.current;
      const pin = pinRef.current;
      if (!root || !pin) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const spans = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll("[data-word]"),
      );
      const bridge = pin.querySelector<HTMLElement>("[data-bridge]");
      const artifacts = gsap.utils.toArray<HTMLElement>(
        pin.querySelectorAll("[data-artifact]"),
      );

      if (reduced) {
        gsap.set(spans, { opacity: 1, y: 0 });
        if (bridge) gsap.set(bridge, { opacity: 1, y: 0 });
        gsap.set(artifacts, { opacity: 0.3 });
        return;
      }

      gsap.set(spans, { opacity: 0.1, y: 22 });
      if (bridge) gsap.set(bridge, { opacity: 0, y: 20 });
      gsap.set(artifacts, { opacity: 0, y: 32, scale: 0.88 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: pin,
          anticipatePin: 1,
        },
      });

      tl.to(
        artifacts,
        { opacity: 0.95, y: 0, scale: 1, stagger: 0.06, duration: 0.35 },
        0,
      );
      tl.to(
        spans,
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.55, ease: "none" },
        0.1,
      );
      if (bridge) {
        tl.to(bridge, { opacity: 1, y: 0, duration: 0.25 }, 0.55);
      }
      tl.to(
        artifacts,
        {
          opacity: 0.05,
          y: -48,
          scale: 1.1,
          rotate: "+=10",
          stagger: 0.04,
          duration: 0.45,
        },
        0.6,
      );
    },
    { dependencies: [leadWords.length, purposeWords.length] },
  );

  return (
    <section
      id="problem"
      ref={rootRef}
      data-nav-theme="dark"
      className="relative h-[170vh] bg-espresso text-paper md:h-[220vh]"
    >
      <div
        ref={pinRef}
        className="relative flex h-[100dvh] items-center justify-center overflow-hidden px-5 sm:px-8"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #c7a873 0%, transparent 35%), radial-gradient(circle at 80% 70%, #a38a5e 0%, transparent 30%)",
          }}
        />

        {ARTIFACTS.map((a) => (
          <div
            key={a.label}
            data-artifact
            className="pointer-events-none absolute will-change-transform"
            style={{
              left: a.x,
              top: a.y,
              transform: `rotate(${a.rot}deg)`,
            }}
          >
            <div className="flex items-center gap-2.5 rounded-xl border border-paper/15 bg-paper/[0.08] px-3.5 py-2.5 text-paper/75 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.55)] backdrop-blur-[2px]">
              <span className="text-gold-soft">
                <ArtifactGlyph kind={a.kind} />
              </span>
              <span className="font-accent text-sm">{a.label}</span>
            </div>
          </div>
        ))}

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="font-serif text-[clamp(1.25rem,4.2vw,2.65rem)] leading-[1.35] tracking-tight">
            {leadWords.map((word, i) => (
              <span
                key={`lead-${word}-${i}`}
                data-word
                className="mr-[0.28em] inline-block will-change-transform"
              >
                {word}
              </span>
            ))}
          </p>
          <p className="mt-8 font-serif text-[clamp(1.15rem,3.6vw,2.15rem)] leading-[1.35] tracking-tight text-paper/90">
            {purposeWords.map((word, i) => (
              <span
                key={`purpose-${word}-${i}`}
                data-word
                className="mr-[0.28em] inline-block will-change-transform"
              >
                {word}
              </span>
            ))}
          </p>
          <p
            data-bridge
            className="font-accent mt-10 text-lg tracking-wide text-gold-soft sm:text-xl"
          >
            {COPY.problemBridge}
          </p>
        </div>
      </div>
    </section>
  );
}
