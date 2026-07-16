/**
 * Builds public/models/journal.glb — leather journal with hinged covers + pages.
 * Closed: CoverRight folded over (rotation.y ≈ π). Open: covers spread.
 * Run: node scripts/build-journal-glb.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "models");
const outFile = path.join(outDir, "journal.glb");

if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    constructor() {
      this.result = null;
      this.onload = null;
      this.onloadend = null;
      this.onerror = null;
    }
    readAsArrayBuffer(blob) {
      Promise.resolve(blob.arrayBuffer())
        .then((buf) => {
          this.result = buf;
          this.onload?.({ target: this });
          this.onloadend?.({ target: this });
        })
        .catch((err) => this.onerror?.(err));
    }
    readAsDataURL(blob) {
      Promise.resolve(blob.arrayBuffer())
        .then((buf) => {
          const b64 = Buffer.from(buf).toString("base64");
          this.result = `data:${blob.type || "application/octet-stream"};base64,${b64}`;
          this.onload?.({ target: this });
          this.onloadend?.({ target: this });
        })
        .catch((err) => this.onerror?.(err));
    }
  };
}

const PAGE_W = 1.05;
const PAGE_H = 1.45;
const COVER_T = 0.04;
const SPINE_W = 0.09;

function mat(hex, roughness, metalness, name) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    roughness,
    metalness,
    name,
  });
}

function roundedPanel(width, height, depth) {
  const shape = new THREE.Shape();
  const r = 0.045;
  const hw = width / 2;
  const hh = height / 2;
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.005,
    bevelSegments: 2,
    curveSegments: 10,
  });
  // Center depth on Z=0, panel lies in XY (open-book plane)
  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

function buildJournal() {
  const root = new THREE.Group();
  root.name = "Journal";

  const leather = mat("#3d2a1c", 0.7, 0.08, "Leather");
  const leatherDark = mat("#24160e", 0.78, 0.05, "LeatherDark");
  const paper = mat("#f4efe4", 0.94, 0, "Paper");
  const paperWarm = mat("#ebe4d4", 0.94, 0, "PaperWarm");
  const gold = mat("#c7a873", 0.32, 0.88, "Gold");

  const spine = new THREE.Mesh(
    new THREE.BoxGeometry(SPINE_W, PAGE_H + 0.05, 0.12),
    leatherDark,
  );
  spine.name = "Spine";
  spine.castShadow = true;
  spine.receiveShadow = true;
  root.add(spine);

  // --- Left cover (hinge at spine) ---
  const coverLeft = new THREE.Group();
  coverLeft.name = "CoverLeft";
  coverLeft.position.set(-SPINE_W * 0.35, 0, 0);

  const leftPanel = new THREE.Mesh(
    roundedPanel(PAGE_W, PAGE_H + 0.06, COVER_T),
    leather,
  );
  leftPanel.name = "CoverLeftMesh";
  leftPanel.position.set(-PAGE_W / 2, 0, 0);
  leftPanel.castShadow = true;
  leftPanel.receiveShadow = true;
  coverLeft.add(leftPanel);

  const foil = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.09), gold);
  foil.name = "GoldFoil";
  foil.position.set(-PAGE_W / 2, 0.38, -COVER_T / 2 - 0.002);
  foil.rotation.y = Math.PI;
  coverLeft.add(foil);

  const pageLeft = new THREE.Mesh(
    new THREE.BoxGeometry(PAGE_W - 0.07, PAGE_H - 0.05, 0.035),
    paperWarm,
  );
  pageLeft.name = "PageLeftMesh";
  pageLeft.position.set(-(PAGE_W - 0.07) / 2 - 0.012, 0, COVER_T * 0.35);
  pageLeft.castShadow = true;
  pageLeft.receiveShadow = true;
  coverLeft.add(pageLeft);

  root.add(coverLeft);

  // --- Right cover (hinge at spine) ---
  const coverRight = new THREE.Group();
  coverRight.name = "CoverRight";
  coverRight.position.set(SPINE_W * 0.35, 0, 0);

  const rightPanel = new THREE.Mesh(
    roundedPanel(PAGE_W, PAGE_H + 0.06, COVER_T),
    leather,
  );
  rightPanel.name = "CoverRightMesh";
  rightPanel.position.set(PAGE_W / 2, 0, 0);
  rightPanel.castShadow = true;
  rightPanel.receiveShadow = true;
  coverRight.add(rightPanel);

  const pageRight = new THREE.Mesh(
    new THREE.BoxGeometry(PAGE_W - 0.07, PAGE_H - 0.05, 0.035),
    paper,
  );
  pageRight.name = "PageRightMesh";
  pageRight.position.set((PAGE_W - 0.07) / 2 + 0.012, 0, COVER_T * 0.35);
  pageRight.castShadow = true;
  pageRight.receiveShadow = true;
  coverRight.add(pageRight);

  // Ink surface on the inner face of the right page (+Z)
  const inkPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(PAGE_W * 0.72, PAGE_H * 0.28),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      roughness: 1,
      metalness: 0,
      name: "InkSurface",
      side: THREE.DoubleSide,
    }),
  );
  inkPlane.name = "InkPlane";
  inkPlane.position.set(
    (PAGE_W - 0.07) / 2 + 0.012,
    0.18,
    COVER_T * 0.35 + 0.02,
  );
  coverRight.add(inkPlane);

  root.add(coverRight);

  // Closed pose — right cover folded over the left
  coverLeft.rotation.y = 0.04;
  coverRight.rotation.y = Math.PI - 0.04;

  root.updateMatrixWorld(true);
  return root;
}

async function main() {
  const scene = new THREE.Scene();
  scene.add(buildJournal());

  const exporter = new GLTFExporter();
  const ab = await exporter.parseAsync(scene, {
    binary: true,
    onlyVisible: true,
  });

  fs.mkdirSync(outDir, { recursive: true });
  const buf = Buffer.from(ab);
  fs.writeFileSync(outFile, buf);
  console.log(`Wrote ${outFile} (${buf.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
