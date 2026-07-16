"use client";

/* Three.js scene graphs are mutated in place by GSAP timelines. */
/* eslint-disable react-hooks/immutability */

import { createInkTexture } from "@/components/hero/ink-texture";
import { createLeatherTexture } from "@/components/hero/leather-texture";
import { gsap, registerGsap } from "@/lib/gsap";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

registerGsap();

const MODEL_PATH = "/models/journal.glb";

const CLOSED_LEFT = 0.04;
const CLOSED_RIGHT = Math.PI - 0.04;
const OPEN_LEFT = -0.98;
const OPEN_RIGHT = 0.98;

type PreparedJournal = {
  root: THREE.Group;
  coverLeft: THREE.Object3D;
  coverRight: THREE.Object3D;
  inkMaterial: THREE.MeshStandardMaterial | null;
};

function prepareJournal(
  scene: THREE.Group,
  inkMap: THREE.CanvasTexture,
  leatherMap: THREE.CanvasTexture,
): PreparedJournal {
  const root = scene.clone(true) as THREE.Group;
  let inkMaterial: THREE.MeshStandardMaterial | null = null;

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const sourceMats = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];

    const nextMats = sourceMats.map((mat) => {
      const std = mat as THREE.MeshStandardMaterial;
      if (!std?.isMeshStandardMaterial) return mat;

      const unique = std.clone();
      const name = (unique.name || mesh.name || "").toLowerCase();

      if (name.includes("leather")) {
        unique.map = leatherMap;
        unique.color.set("#ffffff");
        unique.roughness = 0.68;
        unique.metalness = 0.1;
        unique.envMapIntensity = 0.85;
      } else if (name.includes("paper")) {
        unique.color.set("#f4efe4");
        unique.roughness = 0.95;
        unique.metalness = 0;
        unique.envMapIntensity = 0.35;
      } else if (name.includes("gold")) {
        unique.color.set("#c7a873");
        unique.roughness = 0.3;
        unique.metalness = 0.9;
        unique.envMapIntensity = 1.2;
      } else if (
        name.includes("ink") ||
        mesh.name === "InkPlane" ||
        unique.name === "InkSurface"
      ) {
        unique.map = inkMap;
        unique.color.set("#ffffff");
        unique.transparent = true;
        unique.roughness = 1;
        unique.metalness = 0;
        unique.depthWrite = false;
        inkMaterial = unique;
      }

      return unique;
    });

    mesh.material = Array.isArray(mesh.material) ? nextMats : nextMats[0];
  });

  const coverLeft = root.getObjectByName("CoverLeft");
  const coverRight = root.getObjectByName("CoverRight");
  if (!coverLeft || !coverRight) {
    throw new Error("Journal GLB missing CoverLeft / CoverRight hinges");
  }

  return { root, coverLeft, coverRight, inkMaterial };
}

/** Warm studio lighting + sequence: spin once → open → ink. */
function JournalModel({ reducedMotion }: { reducedMotion: boolean }) {
  const { scene } = useGLTF(MODEL_PATH);
  const pivotRef = useRef<THREE.Group>(null);
  const inkApi = useMemo(() => createInkTexture(), []);
  const leatherMap = useMemo(() => createLeatherTexture(), []);
  const { invalidate } = useThree();

  const journal = useMemo(
    () =>
      prepareJournal(scene as THREE.Group, inkApi.texture, leatherMap),
    [scene, inkApi.texture, leatherMap],
  );

  useEffect(() => {
    return () => {
      inkApi.texture.dispose();
      leatherMap.dispose();
    };
  }, [inkApi, leatherMap]);

  useGSAP(
    () => {
      const pivot = pivotRef.current;
      if (!pivot) return;

      const { coverLeft, coverRight, inkMaterial } = journal;
      const state = { ink: 0 };

      const applyInk = (v: number) => {
        inkApi.draw(v);
        if (inkMaterial) inkMaterial.needsUpdate = true;
        invalidate();
      };

      if (reducedMotion) {
        pivot.rotation.set(-0.52, 0.35, 0.06);
        gsap.set(coverLeft.rotation, { y: OPEN_LEFT });
        gsap.set(coverRight.rotation, { y: OPEN_RIGHT });
        applyInk(1);
        return;
      }

      pivot.rotation.set(-0.52, 0.2, 0.06);
      gsap.set(coverLeft.rotation, { y: CLOSED_LEFT });
      gsap.set(coverRight.rotation, { y: CLOSED_RIGHT });
      applyInk(0);
      gsap.set(pivot.scale, { x: 0.92, y: 0.92, z: 0.92 });
      gsap.set(pivot.position, { y: -0.08 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onUpdate: () => invalidate(),
      });

      tl.to(
        pivot.scale,
        { x: 1, y: 1, z: 1, duration: 0.45, ease: "power3.out" },
        0,
      );
      tl.to(pivot.position, { y: 0, duration: 0.45, ease: "power3.out" }, 0);

      // One full revolution, settle on a flattering 3/4 open-ready angle
      tl.to(
        pivot.rotation,
        {
          y: 0.2 + Math.PI * 2,
          duration: 5.2,
          ease: "power1.inOut",
        },
        0.15,
      );

      tl.to(
        coverLeft.rotation,
        { y: OPEN_LEFT, duration: 1.55, ease: "power2.inOut" },
        "+=0.25",
      );
      tl.to(
        coverRight.rotation,
        { y: OPEN_RIGHT, duration: 1.55, ease: "power2.inOut" },
        "<",
      );

      // Slight settle toward camera as pages open
      tl.to(
        pivot.rotation,
        { x: -0.48, z: 0.02, duration: 1.55, ease: "power2.inOut" },
        "<",
      );

      tl.to(
        state,
        {
          ink: 1,
          duration: 2.6,
          ease: "none",
          onUpdate: () => applyInk(state.ink),
        },
        "+=0.15",
      );
    },
    { dependencies: [journal, reducedMotion] },
  );

  return (
    <group ref={pivotRef} dispose={null}>
      <primitive object={journal.root} />
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#f7f0e4" />
      <directionalLight
        position={[3.5, 5.5, 4]}
        intensity={1.35}
        color="#fff6e8"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.35}
        color="#c7a873"
      />
      <Environment preset="warehouse" environmentIntensity={0.45} />
    </>
  );
}

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <Lights />
      <JournalModel reducedMotion={reducedMotion} />
      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.35}
        scale={8}
        blur={2.6}
        far={3.5}
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
        camera={{ position: [0.15, 0.55, 3.55], fov: 32, near: 0.1, far: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop="demand"
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Suspense fallback={null}>
          <Scene reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_PATH);
