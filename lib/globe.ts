// Matematika untuk galeri globe: sebaran titik di bola, rotasi, perspektif, dan "peta" datar tempat
// bola itu bisa dibentangkan. Semua fungsi murni supaya bisa diuji tanpa canvas.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** n titik yang tersebar rata di bola satuan (spiral Fibonacci). y positif = atas. */
export function fibonacciSphere(n: number): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = i * GOLDEN_ANGLE;
    pts.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r });
  }
  return pts;
}

/** Putar vektor terhadap sumbu Y sebesar yaw, lalu sumbu X sebesar pitch. */
export function rotateYX(v: Vec3, yaw: number, pitch: number): Vec3 {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = v.x * cy + v.z * sy;
  const z1 = -v.x * sy + v.z * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return { x: x1, y: v.y * cp - z1 * sp, z: v.y * sp + z1 * cp };
}

export function normalize(v: Vec3): Vec3 {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
}

export function lonLat(v: Vec3): { lon: number; lat: number } {
  return { lon: Math.atan2(v.x, v.z), lat: Math.asin(Math.max(-1, Math.min(1, v.y))) };
}

/** Skala perspektif: benda yang mendekat ke kamera (z positif) tampil lebih besar. */
export function perspective(z: number, cameraDistance: number): number {
  return cameraDistance / Math.max(1e-3, cameraDistance - z);
}

/** Bungkus x ke rentang [-period/2, period/2). */
export function wrap(x: number, period: number): number {
  const m = (((x + period / 2) % period) + period) % period;
  return m - period / 2;
}

export const clamp = (x: number, a: number, b: number): number => Math.max(a, Math.min(b, x));

export const smoothstep = (a: number, b: number, x: number): number => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - clamp(t, 0, 1), 3);

export const easeInOut = (t: number): number => {
  const c = clamp(t, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

export const easeOutBack = (t: number): number => {
  const c = clamp(t, 0, 1);
  const k = 1.70158;
  return 1 + (k + 1) * Math.pow(c - 1, 3) + k * Math.pow(c - 1, 2);
};

export interface WallSlot {
  gx: number;
  gy: number;
}

/**
 * Bentangkan bola menjadi dinding: tiap titik diberi petak (baris, kolom) sehingga titik yang di utara
 * jadi baris atas dan yang di barat jadi kolom kiri. Hasilnya, saat bola "dibuka", tiap karya bergerak
 * ke petak yang masuk akal dan tidak saling menimpa.
 */
export function wallSlots(points: Vec3[], cols: number, cellW: number, cellH: number): WallSlot[] {
  const n = points.length;
  if (n === 0) return [];
  const c = Math.max(1, Math.min(cols, n));
  const rows = Math.ceil(n / c);
  const info = points.map((p, i) => ({ i, ...lonLat(p) }));
  info.sort((a, b) => b.lat - a.lat);
  const slots: WallSlot[] = new Array(n);
  for (let r = 0; r < rows; r++) {
    const row = info.slice(r * c, r * c + c).sort((a, b) => a.lon - b.lon);
    row.forEach((it, k) => {
      slots[it.i] = { gx: (k - (row.length - 1) / 2) * cellW, gy: ((rows - 1) / 2 - r) * cellH };
    });
  }
  return slots;
}
