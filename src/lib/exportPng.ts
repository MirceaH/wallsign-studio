import { FONTS, WALLS, isPunctuation, type SignConfig } from './config';
import { ASCENT, LINE1_CQW, LINE2_CQW, PADDING_CQW, PUNCT_SCALE, WALL_ASPECT } from './layout';
import { MATERIALS, type MaterialId } from './materials';

type Ctx = CanvasRenderingContext2D;

function fontString(fontId: keyof typeof FONTS, size: number): string {
  const f = FONTS[fontId];
  return `${f.weight} ${size}px "${f.family}", sans-serif`;
}

/** Fill `text` with the material's gradient plus the same three shadows the live preview uses. */
function drawMetal(
  ctx: Ctx,
  text: string,
  x: number,
  baseline: number,
  size: number,
  material: MaterialId,
  unit: number,
  depthK: number,
): void {
  const m = MATERIALS[material];
  const gradient = ctx.createLinearGradient(0, baseline - size * ASCENT, 0, baseline + size * 0.2);
  for (const [at, color] of m.stops) gradient.addColorStop(at / 100, color);

  const passes: { color: string; blur: number; dx: number; dy: number }[] = [
    { color: m.glow, blur: 1.6 * unit, dx: 0, dy: 0 },
    { color: 'rgba(0,0,0,0.4)', blur: 0.5 * unit * depthK, dx: 0.4 * unit * depthK, dy: 0.6 * unit * depthK },
    { color: 'rgba(0,0,0,0.75)', blur: 0.1 * unit * depthK, dx: 0.15 * unit * depthK, dy: 0.25 * unit * depthK },
  ];
  ctx.fillStyle = gradient;
  for (const p of passes) {
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.blur;
    ctx.shadowOffsetX = p.dx;
    ctx.shadowOffsetY = p.dy;
    ctx.fillText(text, x, baseline);
  }
  ctx.shadowColor = 'transparent';
  ctx.fillText(text, x, baseline);
}

function startX(align: SignConfig['align'], canvasWidth: number, pad: number, textWidth: number): number {
  if (align === 'left') return pad;
  if (align === 'center') return (canvasWidth - textWidth) / 2;
  return canvasWidth - pad - textWidth;
}

/** Render the sign to a PNG. Draws directly on a canvas so the result does not depend on CSS effects. */
export async function renderPng(config: SignConfig, width = 2000): Promise<Blob> {
  const height = Math.round(width / WALL_ASPECT);
  const unit = width / 100;
  const depthK = config.depth / 50;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');

  // Make sure the web fonts are ready (silently fall back if they cannot load).
  await Promise.all(
    [config.font1, config.font2].map((id) =>
      document.fonts.load(fontString(id, 100), config.line1 + config.line2).catch(() => []),
    ),
  );

  const wall = WALLS[config.wall].canvas;
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, wall[0]);
  bg.addColorStop(1, wall[1]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const size1 = LINE1_CQW * unit * (config.size1 / 100);
  const size2 = LINE2_CQW * unit * (config.size2 / 100);
  const pad = PADDING_CQW * unit;
  const top = (height - (size1 + size2)) / 2;
  ctx.textBaseline = 'alphabetic';

  // Line 1: letters at full size, punctuation smaller and vertically centred.
  const chars = [...config.line1];
  const sizeOf = (c: string) => (isPunctuation(c) ? size1 * PUNCT_SCALE : size1);
  const widths = chars.map((c) => {
    ctx.font = fontString(config.font1, sizeOf(c));
    return ctx.measureText(c).width;
  });
  const total1 = widths.reduce((a, b) => a + b, 0);
  let x = startX(config.align, width, pad, total1);
  chars.forEach((c, i) => {
    const s = sizeOf(c);
    ctx.font = fontString(config.font1, s);
    const baseline = isPunctuation(c)
      ? top + size1 / 2 - s / 2 + ASCENT * s
      : top + ASCENT * size1;
    drawMetal(ctx, c, x, baseline, s, config.mat1, unit, depthK);
    x += widths[i];
  });

  // Line 2
  const line2 = config.uppercase2 ? config.line2.toUpperCase() : config.line2;
  ctx.font = fontString(config.font2, size2);
  const spacing = (config.spacing / 100) * size2;
  ctx.letterSpacing = `${spacing}px`;
  const total2 = ctx.measureText(line2).width - spacing; // drop the trailing gap
  drawMetal(
    ctx,
    line2,
    startX(config.align, width, pad, total2),
    top + size1 + ASCENT * size2,
    size2,
    config.mat2,
    unit,
    depthK,
  );

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG export failed'))), 'image/png'),
  );
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
