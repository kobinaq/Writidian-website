import * as THREE from "three";

const INK = "#1a1612";
const LINE = "the craft still matters";

/**
 * Canvas texture that reveals handwritten ink left-to-right as progress goes 0→1.
 */
export function createInkTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 420;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create ink canvas context");
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const draw = (progress: number) => {
    const p = Math.min(1, Math.max(0, progress));
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (p <= 0.001) {
      texture.needsUpdate = true;
      return;
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width * p, canvas.height);
    ctx.clip();

    // Soft ruling lines (barely there)
    ctx.strokeStyle = "rgba(163, 138, 94, 0.18)";
    ctx.lineWidth = 1.5;
    for (let y = 120; y < canvas.height - 40; y += 52) {
      ctx.beginPath();
      ctx.moveTo(48, y);
      ctx.bezierCurveTo(300, y - 2, 700, y + 3, 976, y - 1);
      ctx.stroke();
    }

    // Handwritten-style line — slight wobble per glyph cluster
    ctx.fillStyle = INK;
    ctx.textBaseline = "middle";
    ctx.font = "italic 78px Georgia, 'Times New Roman', serif";

    const words = LINE.split(" ");
    let x = 56;
    const baseY = 200;

    words.forEach((word, i) => {
      const wobble = Math.sin(i * 1.7) * 4;
      const rot = (Math.sin(i * 2.1) * 2.2 * Math.PI) / 180;
      ctx.save();
      ctx.translate(x, baseY + wobble);
      ctx.rotate(rot);
      // Double-pass for slightly uneven ink
      ctx.globalAlpha = 0.88;
      ctx.fillText(word, 0.8, 0.6);
      ctx.globalAlpha = 1;
      ctx.fillText(word, 0, 0);
      const w = ctx.measureText(word).width;
      ctx.restore();
      x += w + 22;
    });

    // Small underline flourish at the end once mostly written
    if (p > 0.85) {
      const flourish = (p - 0.85) / 0.15;
      ctx.strokeStyle = INK;
      ctx.globalAlpha = 0.55 * flourish;
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(64, 268);
      ctx.bezierCurveTo(
        220,
        278,
        480,
        258,
        64 + 520 * flourish,
        272 + Math.sin(flourish * 4) * 3,
      );
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
    texture.needsUpdate = true;
  };

  draw(0);

  return { texture, draw, canvas };
}
