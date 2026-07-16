"use client";

import { JournalMesh } from "@/components/hero/journal-mesh";
import { ContactShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

function Lights() {
  return (
    <>
      <ambientLight intensity={0.75} color="#f7f0e4" />
      <directionalLight
        position={[3.2, 5.2, 4.2]}
        intensity={1.6}
        color="#fff6e8"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-3.4, 2.2, -1.8]}
        intensity={0.5}
        color="#c7a873"
      />
      <directionalLight
        position={[0.2, 1.5, 3.8]}
        intensity={0.4}
        color="#ffe8c8"
      />
    </>
  );
}

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <Lights />
      <group position={[0, -0.05, 0]} scale={1.05}>
        <JournalMesh reducedMotion={reducedMotion} />
      </group>
      <ContactShadows
        position={[0, -1.1, 0]}
        opacity={0.32}
        scale={9}
        blur={2.8}
        far={4}
        color="#1a1612"
      />
    </>
  );
}

export function HeroJournal() {
  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <div className="relative h-full w-full">
      <Canvas
        className="h-full w-full touch-none"
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [1.35, 0.7, 3.35], fov: 30, near: 0.1, far: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
        }}
      >
        <Suspense fallback={null}>
          <Scene reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}
