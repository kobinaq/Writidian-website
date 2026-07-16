import * as THREE from "three";

/** Soft procedural leather grain for cover materials. */
export function createLeatherTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create leather canvas");

  const base = ctx.createLinearGradient(0, 0, size, size);
  base.addColorStop(0, "#4a3222");
  base.addColorStop(0.45, "#3d2a1c");
  base.addColorStop(1, "#2e1f14");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  // Fine grain noise
  const image = ctx.getImageData(0, 0, size, size);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 28;
    data[i] = Math.min(255, Math.max(0, data[i] + n));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n * 0.85));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n * 0.65));
  }
  ctx.putImageData(image, 0, 0);

  // Subtle pore speckles
  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.4;
    ctx.fillStyle = `rgba(20,12,8,${0.04 + Math.random() * 0.08})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.2, 2.8);
  texture.anisotropy = 8;
  return texture;
}
