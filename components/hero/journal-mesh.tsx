"use client";

/* eslint-disable react-hooks/immutability */

import { createInkTexture } from "@/components/hero/ink-texture";
import { createLeatherTexture } from "@/components/hero/leather-texture";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/** Front cover angle: 0 = closed (faces camera), OPEN = swung open. */
const COVER_CLOSED = 0;
const COVER_OPEN = -2.15;

const T = {
  spinStart: 0.15,
  spinDur: 5.0,
  openDelay: 0.3,
  openDur: 1.65,
  inkDelay: 0.2,
  inkDur: 2.55,
} as const;

function easeInOut(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function JournalMesh({ reducedMotion }: { reducedMotion: boolean }) {
  const pivotRef = useRef<THREE.Group>(null);
  const coverRef = useRef<THREE.Group>(null);
  const inkMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const startRef = useRef<number | null>(null);
  const lastInk = useRef(-1);

  const leatherMap = useMemo(() => createLeatherTexture(), []);
  const inkApi = useMemo(() => createInkTexture(), []);

  useEffect(() => {
    return () => {
      leatherMap.dispose();
      inkApi.texture.dispose();
    };
  }, [leatherMap, inkApi]);

  useFrame(({ clock }) => {
    const pivot = pivotRef.current;
    const cover = coverRef.current;
    if (!pivot || !cover) return;

    if (startRef.current === null) startRef.current = clock.elapsedTime;
    const t = clock.elapsedTime - startRef.current;

    if (reducedMotion) {
      pivot.rotation.set(0.12, 0.4, 0);
      pivot.scale.setScalar(1);
      cover.rotation.y = COVER_OPEN;
      if (lastInk.current !== 1) {
        inkApi.draw(1);
        lastInk.current = 1;
        if (inkMatRef.current) inkMatRef.current.needsUpdate = true;
      }
      return;
    }

    const enter = Math.min(1, t / 0.4);
    const easeEnter = 1 - Math.pow(1 - enter, 3);
    pivot.scale.setScalar(0.9 + 0.1 * easeEnter);
    pivot.position.y = -0.1 * (1 - easeEnter);

    const spinP = easeInOut((t - T.spinStart) / T.spinDur);
    pivot.rotation.y = 0.4 + Math.PI * 2 * spinP;
    pivot.rotation.x = 0.12;

    const openT0 = T.spinStart + T.spinDur + T.openDelay;
    const openP = easeInOut((t - openT0) / T.openDur);
    cover.rotation.y = COVER_CLOSED + (COVER_OPEN - COVER_CLOSED) * openP;
    pivot.rotation.x = 0.12 - 0.04 * openP;

    const inkT0 = openT0 + T.openDur + T.inkDelay;
    const inkP = Math.min(1, Math.max(0, (t - inkT0) / T.inkDur));
    if (inkP !== lastInk.current) {
      inkApi.draw(inkP);
      lastInk.current = inkP;
      if (inkMatRef.current) inkMatRef.current.needsUpdate = true;
    }
  });

  const pageW = 1.2;
  const pageH = 1.6;
  const coverT = 0.055;
  const blockT = 0.12;

  return (
    <group ref={pivotRef}>
      {/* Back cover */}
      <mesh position={[0, 0, -blockT / 2 - coverT / 2]} castShadow receiveShadow>
        <boxGeometry args={[pageW + 0.04, pageH + 0.04, coverT]} />
        <meshStandardMaterial
          color="#3a2618"
          map={leatherMap}
          roughness={0.66}
          metalness={0.1}
        />
      </mesh>

      {/* Spine */}
      <mesh position={[-(pageW + 0.04) / 2 - 0.02, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.08, pageH + 0.04, blockT + coverT * 2]} />
        <meshStandardMaterial color="#1a100a" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Page block (faces +Z) */}
      <mesh position={[0.01, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[pageW - 0.06, pageH - 0.06, blockT]} />
        <meshStandardMaterial color="#f3ede0" roughness={0.95} />
      </mesh>

      {/* Readable page face */}
      <mesh position={[0.01, 0, blockT / 2 + 0.001]} receiveShadow>
        <planeGeometry args={[pageW - 0.12, pageH - 0.12]} />
        <meshStandardMaterial color="#f8f3e9" roughness={0.98} />
      </mesh>

      {/* Ink on the open page */}
      <mesh position={[0.01, 0.22, blockT / 2 + 0.002]}>
        <planeGeometry args={[0.88, 0.42]} />
        <meshStandardMaterial
          ref={inkMatRef}
          map={inkApi.texture}
          transparent
          roughness={1}
          metalness={0}
          depthWrite={false}
        />
      </mesh>

      {/* Front cover — hinged at left (spine) */}
      <group
        ref={coverRef}
        position={[-(pageW + 0.04) / 2, 0, blockT / 2 + coverT / 2]}
        rotation={[0, COVER_CLOSED, 0]}
      >
        <mesh
          position={[(pageW + 0.04) / 2, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[pageW + 0.04, pageH + 0.04, coverT]} />
          <meshStandardMaterial
            color="#3a2618"
            map={leatherMap}
            roughness={0.66}
            metalness={0.1}
          />
        </mesh>

        {/* Gold foil on front */}
        <mesh
          position={[(pageW + 0.04) / 2, 0.4, coverT / 2 + 0.001]}
        >
          <planeGeometry args={[0.32, 0.09]} />
          <meshStandardMaterial
            color="#c7a873"
            roughness={0.28}
            metalness={0.9}
          />
        </mesh>
      </group>
    </group>
  );
}
