// Tata letak kanvas Karya: grid longgar bergeser (terinspirasi galeri kanvas yang bisa digeser).
// Fungsi murni supaya bisa diuji tanpa DOM.
import { hashString } from './works';

export interface LayoutItem {
  id: string;
  /** lebar / tinggi */
  ratio: number;
}

export interface Placed {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CanvasLayout {
  placed: Record<string, Placed>;
  width: number;
  height: number;
}

const OFFSETS = [0, 70, 28, 100, 14, 56];

export const CAPTION_HEIGHT = 24;

export function layoutCanvas(items: LayoutItem[], viewportWidth: number): CanvasLayout {
  const small = viewportWidth < 700;
  const cols = small ? 5 : Math.max(6, Math.min(12, Math.round(Math.sqrt(items.length * 1.6))));
  const cellW = small ? 150 : 236;
  const rowH = small ? 300 : 420;
  const pad = small ? 40 : 90;
  const maxTile = small ? 190 : 250;
  const top = 56;

  const placed: Record<string, Placed> = {};
  let maxX = 0;
  let maxY = 0;

  items.forEach((it, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const variation = hashString(it.id) % 5;
    const base = small ? 96 + variation * 12 : 120 + variation * 22;
    const w = Math.min(base, maxTile * it.ratio);
    const h = w / it.ratio;
    const x = pad + col * cellW + (row % 2 ? cellW * 0.28 : 0);
    const y = pad + row * rowH + OFFSETS[(col + row) % OFFSETS.length] * (small ? 0.6 : 1) + top;
    placed[it.id] = { x, y, w, h };
    maxX = Math.max(maxX, x + w);
    maxY = Math.max(maxY, y + h + CAPTION_HEIGHT);
  });

  return { placed, width: maxX + pad, height: maxY + pad };
}

/** Batasi geseran supaya kanvas tidak keluar dari layar. */
export function clampPan(
  px: number,
  py: number,
  viewW: number,
  viewH: number,
  contentW: number,
  contentH: number,
): { x: number; y: number } {
  const minX = Math.min(0, viewW - contentW);
  const minY = Math.min(0, viewH - contentH);
  return { x: Math.max(minX, Math.min(0, px)), y: Math.max(minY, Math.min(0, py)) };
}

/** Posisi awal: kanvas digeser setengah dari kelebihan lebarnya supaya terasa di tengah-tengah. */
export function initialPan(viewW: number, contentW: number): number {
  const shift = Math.max(0, (contentW - viewW) / 2) * 0.5;
  return shift === 0 ? 0 : -shift;
}
