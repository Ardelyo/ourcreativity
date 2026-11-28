import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { formatNo, type PublicWork } from '../../lib/works';
import { EDISI } from '../../lib/edisi';
import {
  clamp,
  easeInOut,
  easeOutBack,
  fibonacciSphere,
  lonLat,
  normalize,
  perspective,
  rotateYX,
  smoothstep,
  wallSlots,
  wrap,
  type Vec3,
} from '../../lib/globe';

export type GlobeMode = 'globe' | 'wall';

export interface GlobeHandle {
  /** Acak penempatan karya di bola dan beri dorongan putar. */
  shuffle: () => void;
  /** Beri dorongan putar (positif = ke kanan). Dipakai untuk menautkan putaran dengan gulir halaman. */
  kick: (impulse: number) => void;
  /** Perbesar (>1) atau perkecil (<1) dengan halus. */
  zoomBy: (factor: number) => void;
  /** Kembalikan zoom ke ukuran awal. */
  resetZoom: () => void;
}

interface Props {
  items: PublicWork[];
  mode: GlobeMode;
  onOpen: (id: string) => void;
  /** Roda mouse memutar atau memperbesar bola. Matikan di landing agar halaman tetap bisa digulir. */
  captureWheel?: boolean;
  autoRotate?: boolean;
  className?: string;
  /** Skala ukuran bola terhadap kanvas (0.3 sampai 0.5). */
  radiusScale?: number;
  /** Geser pusat bola secara horizontal, dalam fraksi lebar (mis. 0.18 = ke kanan). */
  offsetX?: number;
  /** Geser pusat bola secara vertikal, dalam fraksi tinggi (positif = ke bawah). */
  offsetY?: number;
  /** Dilaporkan saat gambar selesai dimuat: (sudah, total). Dipakai untuk penghitung intro. */
  onProgress?: (done: number, total: number) => void;
  /** Nomor urut karya, ditampilkan sebagai keterangan saat zoom dekat dan saat hover. */
  numbers?: Map<string, number>;
  /** Tampilkan tombol zoom dan penunjuk skala. */
  controls?: boolean;
}

const ZMIN = 0.55;
const ZMAX = 3.2;
const EDISI_COLOR = new Map(EDISI.map((e) => [e.key, e.warna === '#161616' ? '#8A8A8F' : e.warna] as [string, string]));

interface Tile {
  id: string;
  work: PublicWork;
  v: Vec3;
  vt: Vec3;
  gx: number;
  gy: number;
  img: HTMLImageElement | null;
  state: 'idle' | 'loading' | 'ready' | 'failed';
  ratio: number;
  vis: number;
  visT: number;
  hv: number;
  face: number;
  hi: HTMLImageElement | null;
  hiState: 'idle' | 'loading' | 'ready';
  delay: number;
  born: number;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  alpha: number;
  z: number;
}

const FONT_MONO = '500 11px "JetBrains Mono", ui-monospace, monospace';

export const WorksGlobe = forwardRef<GlobeHandle, Props>(function WorksGlobe(
  { items, mode, onOpen, captureWheel = true, autoRotate = true, className = '', radiusScale = 0.4, offsetX = 0, offsetY = 0, onProgress, numbers, controls = false },
  ref,
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live = useRef({ items, mode, onOpen, autoRotate, radiusScale, offsetX, offsetY, captureWheel, onProgress, numbers });
  live.current = { items, mode, onOpen, autoRotate, radiusScale, offsetX, offsetY, captureWheel, onProgress, numbers };
  const hudRef = useRef<HTMLSpanElement>(null);
  const api = useRef<{ sync: () => void; shuffle: () => void; kick: (v: number) => void; zoomBy: (f: number) => void; reset: () => void } | null>(null);

  useImperativeHandle(
    ref,
    () => ({ shuffle: () => api.current?.shuffle(), kick: (v: number) => api.current?.kick(v), zoomBy: (f: number) => api.current?.zoomBy(f), resetZoom: () => api.current?.reset() }),
    [],
  );

  // Sinkronkan tile setiap kali kumpulan karya berubah.
  useEffect(() => {
    api.current?.sync();
  }, [items]);

  useEffect(() => {
    const host = wrapRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tiles = new Map<string, Tile>();
    let order: Tile[] = [];
    let W = 0;
    let H = 0;
    let dpr = 1;
    let yaw = 0.4;
    let pitch = -0.18;
    let vyaw = 0;
    let vpitch = 0;
    let zoom = 1;
    let zoomT = 1;
    let lastLayoutZoom = 1;
    let lastHud = '';
    let ppx = 0;
    let ppy = 0;
    let pinchD = 0;
    let hiLoading = 0;
    const touches = new Map<number, { x: number; y: number }>();
    const pulses: { x: number; y: number; t: number }[] = [];
    // Garis lintang-bujur untuk bola: detail halus yang makin terlihat saat zoom menjauh.
    const grid: Vec3[][] = [];
    for (let lon = 0; lon < 360; lon += 30) {
      const line: Vec3[] = [];
      for (let lat = -80; lat <= 80; lat += 10) {
        const la = (lat * Math.PI) / 180;
        const lo = (lon * Math.PI) / 180;
        line.push({ x: Math.cos(la) * Math.sin(lo), y: Math.sin(la), z: Math.cos(la) * Math.cos(lo) });
      }
      grid.push(line);
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const line: Vec3[] = [];
      for (let lon = 0; lon <= 360; lon += 10) {
        const la = (lat * Math.PI) / 180;
        const lo = (lon * Math.PI) / 180;
        line.push({ x: Math.cos(la) * Math.sin(lo), y: Math.sin(la), z: Math.cos(la) * Math.cos(lo) });
      }
      grid.push(line);
    }
    let u = live.current.mode === 'wall' ? 1 : 0;
    let lastInteract = -10;
    let dragging = false;
    let moved = 0;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let pointer: { x: number; y: number } | null = null;
    let hovered: Tile | null = null;
    let visible = true;
    let raf = 0;
    let loading = 0;
    let lastT = performance.now();
    const t0 = performance.now();

    // Ukuran dan posisi bola menyesuaikan diri dengan mulus (dipakai untuk transisi intro ke header).
    let sRadius = live.current.radiusScale;
    let sOffX = live.current.offsetX;
    let sOffY = live.current.offsetY;
    let lastProgress = '';
    const R = () => Math.min(W, H) * sRadius * zoom;
    // Batas atas ikut radius supaya katalog yang masih sedikit tidak menghasilkan tile raksasa.
    const tileBase = (n: number) => clamp(Math.sqrt((4 * Math.PI * Math.pow(R(), 2)) / Math.max(1, n)) * 0.85, 40, Math.min(170, R() * 0.3));

    const sync = () => {
      const list = live.current.items;
      const ids = new Set(list.map((w) => w.id));
      tiles.forEach((t) => {
        if (!ids.has(t.id)) t.visT = 0;
      });
      const pts = fibonacciSphere(list.length);
      const now = performance.now();
      list.forEach((w, i) => {
        let t = tiles.get(w.id);
        if (!t) {
          t = {
            id: w.id, work: w, v: normalize({ x: Math.random() - 0.5, y: Math.random() - 0.5, z: Math.random() - 0.5 }),
            vt: pts[i], gx: 0, gy: 0, img: null, state: 'idle', ratio: 0.8, vis: 0, visT: 1, hv: 0, face: 0, hi: null, hiState: 'idle',
            delay: (i / Math.max(1, list.length)) * 0.9, born: now, sx: -999, sy: -999, sw: 0, sh: 0, alpha: 0, z: 0,
          };
          tiles.set(w.id, t);
        } else {
          t.work = w;
          t.vt = pts[i];
          t.visT = 1;
        }
      });
      order = [...tiles.values()];
      relayoutWall();
    };

    const relayoutWall = () => {
      const active = order.filter((t) => t.visT > 0);
      if (!active.length) return;
      const cols = Math.max(4, Math.round(Math.sqrt(active.length * 2.2)));
      const base = tileBase(active.length);
      const slots = wallSlots(active.map((t) => t.vt), cols, base * 1.75, base * 1.95);
      active.forEach((t, i) => {
        t.gx = slots[i].gx;
        t.gy = slots[i].gy;
      });
    };

    const load = (t: Tile) => {
      if (t.state !== 'idle' || loading >= 16) return;
      const src = t.work.image;
      if (!src) {
        t.state = 'failed';
        return;
      }
      t.state = 'loading';
      loading++;
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        t.img = img;
        t.ratio = clamp(img.naturalWidth / Math.max(1, img.naturalHeight), 0.55, 1.9);
        t.state = 'ready';
        loading--;
      };
      img.onerror = () => {
        t.state = 'failed';
        loading--;
      };
      img.src = src;
    };

    const resize = () => {
      const r = host.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      relayoutWall();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    api.current = {
      sync,
      kick: (v: number) => {
        vyaw += v;
      },
      zoomBy: (f: number) => {
        zoomT = clamp(zoomT * f, ZMIN, ZMAX);
        lastInteract = (performance.now() - t0) / 1000;
      },
      reset: () => {
        zoomT = 1;
        lastInteract = (performance.now() - t0) / 1000;
      },
      shuffle: () => {
        const active = order.filter((t) => t.visT > 0);
        const pts = fibonacciSphere(active.length);
        for (let i = pts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pts[i], pts[j]] = [pts[j], pts[i]];
        }
        active.forEach((t, i) => {
          t.vt = pts[i];
          t.delay = Math.random() * 0.3;
        });
        relayoutWall();
        vyaw += 0.09;
        lastInteract = (performance.now() - t0) / 1000;
      },
    };
    sync();

    const hit = (): Tile | null => {
      if (!pointer) return null;
      for (let i = order.length - 1; i >= 0; i--) {
        const t = order[i];
        if (t.alpha < 0.5 || t.vis < 0.5) continue;
        const grow = 1 + 0.45 * t.hv;
        const hw = (t.sw * grow) / 2;
        const hh = (t.sh * grow) / 2;
        if (Math.abs(pointer.x - t.sx) <= hw && Math.abs(pointer.y - t.sy) <= hh) return t;
      }
      return null;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) {
        lastT = now;
        return;
      }
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      const time = (now - t0) / 1000;
      const L = live.current;
      const wallMode = L.mode === 'wall';
      const sk = reduceMotion ? 1 : 0.06;
      sRadius += (L.radiusScale - sRadius) * sk;
      sOffX += (L.offsetX - sOffX) * sk;
      sOffY += (L.offsetY - sOffY) * sk;
      zoom += (zoomT - zoom) * (reduceMotion ? 1 : 0.13);
      if (Math.abs(zoom - lastLayoutZoom) > 0.008) {
        lastLayoutZoom = zoom;
        relayoutWall();
      }
      const zt = zoom.toFixed(1);
      if (zt !== lastHud && hudRef.current) {
        lastHud = zt;
        hudRef.current.textContent = `×${zt}`;
      }
      // Tingkat detail mengikuti zoom: jauh = kerangka bola, dekat = keterangan dan gambar penuh.
      const far = 1 - smoothstep(0.6, 0.98, zoom);
      const near = smoothstep(1.45, 2.3, zoom);
      ppx += ((pointer ? pointer.x / W - 0.5 : 0) - ppx) * 0.06;
      ppy += ((pointer ? pointer.y / H - 0.5 : 0) - ppy) * 0.06;

      // Fisika masukan.
      if (!dragging) {
        yaw += vyaw;
        pitch += vpitch;
        vyaw *= 0.94;
        vpitch *= 0.94;
        if (L.autoRotate && !reduceMotion && time - lastInteract > 2.2 && !hovered) {
          vyaw += (0.0017 * (wallMode ? 0.5 : 1) - vyaw) * 0.02;
        }
      }
      pitch = clamp(pitch, wallMode ? -0.8 : -1.15, wallMode ? 0.8 : 1.15);
      u += ((wallMode ? 1 : 0) - u) * (reduceMotion ? 1 : 0.075);
      const ue = easeInOut(u);

      const r = R();
      const cam = r * 3.6;
      const cx = W / 2 + sOffX * W;
      const cy = H / 2 + sOffY * H;
      const n = order.filter((t) => t.visT > 0).length;
      const base = tileBase(n);
      const period = Math.max(1, Math.round(Math.sqrt(Math.max(1, n) * 2.2))) * base * 1.75;

      // Hover.
      const prevHover = hovered;
      hovered = dragging ? null : hit();
      if (hovered !== prevHover) canvas.style.cursor = hovered ? 'pointer' : dragging ? 'grabbing' : 'grab';
      host.dataset.cursor = hovered ? 'Buka' : 'Putar';

      // Perbarui tile.
      for (const t of order) {
        t.v = normalize({
          x: t.v.x + (t.vt.x - t.v.x) * 0.08,
          y: t.v.y + (t.vt.y - t.v.y) * 0.08,
          z: t.v.z + (t.vt.z - t.v.z) * 0.08,
        });
        t.vis += (t.visT - t.vis) * 0.12;
        const target = hovered === t ? 1 : 0;
        t.hv += (target - t.hv) * (reduceMotion ? 1 : 0.18);
        if (t.vis > 0.05) load(t);
        // Zoom dekat: tile besar yang menghadap kita dimuat ulang dengan gambar resolusi penuh.
        const full = t.work.full;
        if (zoom > 1.4 && full && full !== t.work.image && t.hiState === 'idle' && hiLoading < 2 && t.sw * dpr > 230 && t.alpha > 0.6) {
          t.hiState = 'loading';
          hiLoading++;
          const im = new Image();
          im.decoding = 'async';
          im.onload = () => {
            t.hi = im;
            t.hiState = 'ready';
            hiLoading--;
          };
          im.onerror = () => {
            t.hiState = 'ready';
            hiLoading--;
          };
          im.src = full;
        }
      }

      // Laporkan kemajuan pemuatan gambar (untuk penghitung intro).
      if (L.onProgress) {
        let done = 0;
        let total = 0;
        for (const t of order) {
          if (t.visT === 0) continue;
          total++;
          if (t.state === 'ready' || t.state === 'failed') done++;
        }
        const key = `${done}/${total}`;
        if (key !== lastProgress) {
          lastProgress = key;
          L.onProgress(done, total);
        }
      }

      // Posisi dan ukuran di layar.
      for (const t of order) {
        const intro = reduceMotion ? 1 : easeOutBack(((now - t.born) / 1000 - t.delay) / 1.25);
        const introClamped = clamp(intro, 0, 1.08);
        const p = rotateYX(t.v, yaw, pitch);
        const ps = { x: p.x * r, y: p.y * r, z: p.z * r };
        const wx = wrap(t.gx + yaw * r * 1.15, period);
        const wy = t.gy + pitch * r * 0.9;
        const P = {
          x: (ps.x + (wx - ps.x) * ue) * introClamped,
          y: (ps.y + (wy - ps.y) * ue) * introClamped,
          z: ps.z * (1 - ue) * introClamped,
        };
        const sc = perspective(P.z, cam);
        const facing = P.z / r;
        const faceAlpha = 0.16 + 0.84 * smoothstep(-0.3, 0.35, facing);
        const a = (faceAlpha * (1 - ue) + ue) * clamp(intro, 0, 1) * clamp(t.vis, 0, 1);
        const h = base * sc * (0.35 + 0.65 * clamp(t.vis, 0, 1));
        t.sh = h;
        t.sw = Math.min(h * t.ratio, base * sc * 1.7);
        t.face = facing;
        const depth = (P.z / Math.max(1, r)) * (1 - ue);
        const breathe = reduceMotion ? 0 : Math.sin(time * 0.9 + t.delay * 23) * 1.3 * (1 - ue);
        t.sx = cx + P.x * sc - ppx * 20 * depth;
        t.sy = cy - P.y * sc - ppy * 20 * depth + breathe;
        t.alpha = a;
        t.z = P.z + (t === hovered ? 1e6 : 0);
      }

      // Dorongan tetangga saat hover (riak magnetik).
      if (hovered && !reduceMotion) {
        const hx = hovered.sx;
        const hy = hovered.sy;
        for (const t of order) {
          if (t === hovered) continue;
          const dx = t.sx - hx;
          const dy = t.sy - hy;
          const d = Math.hypot(dx, dy) || 1;
          const push = hovered.hv * 26 * Math.exp(-Math.pow(d / (base * 1.6), 2));
          t.sx += (dx / d) * push;
          t.sy += (dy / d) * push;
        }
      }

      order.sort((a, b) => a.z - b.z);

      // Gambar.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';

      if (ue < 0.6) {
        const ga = (0.06 + 0.16 * far) * (1 - ue / 0.6);
        ctx.strokeStyle = '#0E0E0F';
        ctx.lineWidth = 0.6;
        ctx.globalAlpha = ga;
        ctx.beginPath();
        for (const line of grid) {
          let on = false;
          for (const v of line) {
            const q = rotateYX(v, yaw, pitch);
            if (q.z < 0.02) {
              on = false;
              continue;
            }
            const gs = perspective(q.z * r, cam);
            const gx = cx + q.x * r * gs;
            const gy = cy - q.y * r * gs;
            if (on) ctx.lineTo(gx, gy);
            else {
              ctx.moveTo(gx, gy);
              on = true;
            }
          }
        }
        ctx.stroke();
        ctx.globalAlpha = ga * 0.9;
        ctx.beginPath();
        ctx.arc(cx, cy, r * perspective(0, cam), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Peta: penggaris di tepi yang ikut bergeser, seperti koordinat pada peta.
      if (ue > 0.4) {
        ctx.globalAlpha = (0.38 * (ue - 0.4)) / 0.6;
        ctx.strokeStyle = '#0E0E0F';
        ctx.fillStyle = '#0E0E0F';
        ctx.font = '500 8px "JetBrains Mono", ui-monospace, monospace';
        ctx.textBaseline = 'alphabetic';
        const step = 26 * Math.max(0.6, zoom);
        const ox = yaw * r * 1.15;
        const oy = pitch * r * 0.9;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const ix = Math.floor(ox / step);
        for (let i = 0; i * step - (ox - ix * step) < W + step; i++) {
          const x = i * step - (ox - ix * step);
          const major = (((i + ix) % 5) + 5) % 5 === 0;
          ctx.moveTo(x, H);
          ctx.lineTo(x, H - (major ? 9 : 4));
          if (major) ctx.fillText(String((((i + ix) % 1000) + 1000) % 1000).padStart(3, '0'), x + 3, H - 11);
        }
        const iy = Math.floor(oy / step);
        for (let j = 0; j * step - (oy - iy * step) < H + step; j++) {
          const y = j * step - (oy - iy * step);
          const major = (((j + iy) % 5) + 5) % 5 === 0;
          ctx.moveTo(0, y);
          ctx.lineTo(major ? 9 : 4, y);
        }
        ctx.stroke();
      }
      for (const t of order) {
        if (t.alpha < 0.01 || t.vis < 0.02) continue;
        const grow = 1 + 0.45 * t.hv;
        const w = t.sw * grow;
        const h = t.sh * grow;
        const x = t.sx - w / 2;
        const y = t.sy - h / 2;
        if (x > W || y > H || x + w < 0 || y + h < 0) continue;
        ctx.globalAlpha = t.alpha;
        if (t.hv > 0.02) {
          ctx.shadowColor = 'rgba(0,0,0,0.35)';
          ctx.shadowBlur = 26 * t.hv;
          ctx.shadowOffsetY = 10 * t.hv;
        }
        if (t.state === 'ready' && t.img) {
          ctx.drawImage(t.hi && t.hiState === 'ready' ? t.hi : t.img, x, y, w, h);
        } else {
          ctx.fillStyle = t.state === 'failed' ? '#0E0E0F' : '#D2D2CF';
          ctx.fillRect(x, y, w, h);
        }
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        if (t.hv > 0.02) {
          ctx.globalAlpha = t.alpha;
          ctx.strokeStyle = '#0E0E0F';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);
        }

        const fv = (1 - ue) * smoothstep(0.1, 0.5, t.face) + ue;
        // Zoom jauh: titik warna edisi di sudut tile.
        if (far > 0.05 && fv > 0.3) {
          ctx.globalAlpha = t.alpha * far;
          ctx.fillStyle = EDISI_COLOR.get(t.work.edisi) ?? '#0E0E0F';
          ctx.fillRect(x + 2, y + 2, 5, 5);
        }
        // Zoom dekat: tanda sudut seperti lembar kontak dan keterangan nomor serta kreator.
        if (near > 0.03 && t.sw > 58 && fv > 0.3) {
          ctx.globalAlpha = near * t.alpha * fv;
          ctx.strokeStyle = '#0E0E0F';
          ctx.lineWidth = 1;
          const k = 6;
          const g = 4;
          ctx.beginPath();
          ctx.moveTo(x - g, y - g + k); ctx.lineTo(x - g, y - g); ctx.lineTo(x - g + k, y - g);
          ctx.moveTo(x + w + g - k, y - g); ctx.lineTo(x + w + g, y - g); ctx.lineTo(x + w + g, y - g + k);
          ctx.moveTo(x - g, y + h + g - k); ctx.lineTo(x - g, y + h + g); ctx.lineTo(x - g + k, y + h + g);
          ctx.moveTo(x + w + g - k, y + h + g); ctx.lineTo(x + w + g, y + h + g); ctx.lineTo(x + w + g, y + h + g - k);
          ctx.stroke();
          const num = L.numbers?.get(t.id);
          ctx.font = '500 9px "JetBrains Mono", ui-monospace, monospace';
          ctx.fillStyle = '#0E0E0F';
          ctx.textBaseline = 'alphabetic';
          ctx.fillText(`${num ? formatNo(num) : '···'}  @${t.work.username ?? t.work.author}`.slice(0, 26), x - g, y + h + g + 12);
        }
      }

      // Label karya yang disorot.
      if (hovered && hovered.hv > 0.3) {
        const t = hovered;
        const num = L.numbers?.get(t.id);
        const label = `${num ? formatNo(num) + '  ' : ''}@${t.work.username ?? t.work.author}`;
        const hh = clamp(t.hv, 0, 1);
        ctx.globalAlpha = hh;
        ctx.font = FONT_MONO;
        const tw = ctx.measureText(label).width + 26;
        const lx = clamp(t.sx - tw / 2, 6, W - tw - 6);
        const ly = Math.min(H - 26, t.sy + (t.sh * (1 + 0.45 * t.hv)) / 2 + 8 + (1 - hh) * 6);
        ctx.fillStyle = '#0E0E0F';
        ctx.fillRect(lx, ly, tw, 20);
        ctx.fillStyle = EDISI_COLOR.get(t.work.edisi) ?? '#EDEDEB';
        ctx.beginPath();
        ctx.arc(lx + 10, ly + 10, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#EDEDEB';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, lx + 19, ly + 10.5);
      }

      // Riak klik.
      for (let i = pulses.length - 1; i >= 0; i--) {
        const age = (now - pulses[i].t) / 650;
        if (age >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = (1 - age) * 0.5;
        ctx.strokeStyle = '#0E0E0F';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(pulses[i].x, pulses[i].y, 6 + 44 * (1 - Math.pow(1 - age, 3)), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Buang tile yang sudah menghilang.
      if (order.some((t) => t.visT === 0 && t.vis < 0.02)) {
        order = order.filter((t) => {
          const dead = t.visT === 0 && t.vis < 0.02;
          if (dead) tiles.delete(t.id);
          return !dead;
        });
      }
    };

    // Masukan pointer.
    const local = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      return { x: e.clientX - b.left, y: e.clientY - b.top };
    };
    const dist2 = () => {
      const [a, b] = [...touches.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        touches.set(e.pointerId, local(e));
        if (touches.size === 2 && live.current.captureWheel) {
          pinchD = dist2();
          moved = 99;
          return;
        }
      }
      dragging = true;
      moved = 0;
      const p = local(e);
      startX = lastX = p.x;
      startY = lastY = p.y;
      pointer = p;
      vyaw = 0;
      vpitch = 0;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      pointer = p;
      if (touches.has(e.pointerId)) touches.set(e.pointerId, p);
      if (touches.size === 2 && pinchD > 0) {
        const d = dist2();
        zoomT = clamp(zoomT * (d / pinchD), ZMIN, ZMAX);
        pinchD = d;
        moved = 99;
        return;
      }
      if (!dragging) return;
      const dx = p.x - lastX;
      const dy = p.y - lastY;
      lastX = p.x;
      lastY = p.y;
      moved = Math.max(moved, Math.hypot(p.x - startX, p.y - startY));
      const k = 1 / Math.max(120, R());
      yaw += dx * k * 1.6;
      pitch += dy * k * 1.6;
      vyaw = dx * k * 1.6;
      vpitch = dy * k * 1.6;
      lastInteract = (performance.now() - t0) / 1000;
    };
    const onUp = (e: PointerEvent) => {
      touches.delete(e.pointerId);
      if (touches.size < 2) pinchD = 0;
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = 'grab';
      if (moved < 6) {
        pulses.push({ x: pointer?.x ?? lastX, y: pointer?.y ?? lastY, t: performance.now() });
        const t = hit();
        if (t) live.current.onOpen(t.id);
      }
      if (e.pointerType !== 'mouse') pointer = null;
      if (reduceMotion) {
        vyaw = 0;
        vpitch = 0;
      }
      lastInteract = (performance.now() - t0) / 1000;
    };
    const onLeave = () => {
      if (!dragging) pointer = null;
    };
    const onWheel = (e: WheelEvent) => {
      if (!live.current.captureWheel) return;
      e.preventDefault();
      if (live.current.mode === 'wall' && !e.ctrlKey) {
        yaw += (e.deltaX + e.deltaY * 0.6) * 0.0016;
      } else {
        zoomT = clamp(zoomT * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0014)), ZMIN, ZMAX);
        yaw += e.deltaX * 0.0016;
      }
      lastInteract = (performance.now() - t0) / 1000;
    };
    const onKey = (e: KeyboardEvent) => {
      const step = 0.12;
      if (e.key === 'ArrowLeft') vyaw -= step;
      else if (e.key === 'ArrowRight') vyaw += step;
      else if (e.key === 'ArrowUp') vpitch -= step;
      else if (e.key === 'ArrowDown') vpitch += step;
      else if (e.key === '+' || e.key === '=') zoomT = clamp(zoomT * 1.18, ZMIN, ZMAX);
      else if (e.key === '-') zoomT = clamp(zoomT / 1.18, ZMIN, ZMAX);
      else if (e.key === '0') zoomT = 1;
      else return;
      e.preventDefault();
      lastInteract = (performance.now() - t0) / 1000;
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onLeave);
    const onDbl = () => {
      if (!live.current.captureWheel || hit()) return;
      zoomT = zoomT > 2.1 ? 1 : clamp(zoomT * 1.8, ZMIN, ZMAX);
    };
    canvas.addEventListener('dblclick', onDbl);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('keydown', onKey);
    canvas.style.cursor = 'grab';

    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    });
    io.observe(host);

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('dblclick', onDbl);
      canvas.removeEventListener('keydown', onKey);
      api.current = null;
    };
  }, []);

  return (
    <div ref={wrapRef} data-cursor="Putar" className={`oc-globe select-none ${className}`}>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="img"
        aria-label={`Bola berisi ${items.length} karya. Seret untuk memutar, klik karya untuk membuka, panah untuk memutar lewat keyboard. Untuk menjelajah dengan pembaca layar, pakai tampilan Daftar.`}
        className={`block outline-none focus-visible:ring-2 focus-visible:ring-[#0E0E0F] ${captureWheel ? 'touch-none' : 'touch-pan-y'}`}
      />
      {controls && (
        <div className="absolute bottom-12 right-4 flex items-center gap-px font-mono text-[11px] md:bottom-4" data-cursor="">
          {([['−', 1 / 1.35, 'Perkecil'], ['+', 1.35, 'Perbesar']] as const).map(([label, f, name]) => (
            <button key={name} type="button" aria-label={name} onClick={() => api.current?.zoomBy(f)} className="grid h-7 w-7 place-items-center border border-[#0E0E0F]/25 bg-[#EDEDEB]/80 backdrop-blur transition-colors hover:bg-[#0E0E0F] hover:text-[#EDEDEB] active:scale-95">
              {label}
            </button>
          ))}
          <button type="button" aria-label="Setel ulang zoom" onClick={() => api.current?.reset()} className="grid h-7 min-w-[3.1rem] place-items-center border border-[#0E0E0F]/25 bg-[#EDEDEB]/80 px-1.5 backdrop-blur transition-colors hover:bg-[#0E0E0F] hover:text-[#EDEDEB] active:scale-95">
            <span ref={hudRef}>×1.0</span>
          </button>
        </div>
      )}
    </div>
  );
});
