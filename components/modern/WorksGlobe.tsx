import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { PublicWork } from '../../lib/works';
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
}

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
  { items, mode, onOpen, captureWheel = true, autoRotate = true, className = '', radiusScale = 0.4, offsetX = 0, offsetY = 0, onProgress },
  ref,
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live = useRef({ items, mode, onOpen, autoRotate, radiusScale, offsetX, offsetY, captureWheel, onProgress });
  live.current = { items, mode, onOpen, autoRotate, radiusScale, offsetX, offsetY, captureWheel, onProgress };
  const api = useRef<{ sync: () => void; shuffle: () => void; kick: (v: number) => void } | null>(null);

  useImperativeHandle(ref, () => ({ shuffle: () => api.current?.shuffle(), kick: (v: number) => api.current?.kick(v) }), []);

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
            vt: pts[i], gx: 0, gy: 0, img: null, state: 'idle', ratio: 0.8, vis: 0, visT: 1, hv: 0,
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
      if (t.state !== 'idle' || loading >= 8) return;
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
        t.sx = cx + P.x * sc;
        t.sy = cy - P.y * sc;
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
          ctx.drawImage(t.img, x, y, w, h);
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
      }

      // Label karya yang disorot.
      if (hovered && hovered.hv > 0.3) {
        const t = hovered;
        const label = `@${t.work.username ?? t.work.author}`;
        ctx.globalAlpha = clamp(t.hv, 0, 1);
        ctx.font = FONT_MONO;
        const tw = ctx.measureText(label).width + 14;
        const lx = clamp(t.sx - tw / 2, 6, W - tw - 6);
        const ly = Math.min(H - 26, t.sy + (t.sh * (1 + 0.45 * t.hv)) / 2 + 8);
        ctx.fillStyle = '#0E0E0F';
        ctx.fillRect(lx, ly, tw, 20);
        ctx.fillStyle = '#EDEDEB';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, lx + 7, ly + 10.5);
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
    const onDown = (e: PointerEvent) => {
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
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = 'grab';
      if (moved < 6) {
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
      if (live.current.mode === 'wall') {
        yaw += (e.deltaX + e.deltaY * 0.6) * 0.0016;
      } else {
        zoom = clamp(zoom * Math.exp(-e.deltaY * 0.0012), 0.7, 1.7);
        yaw += e.deltaX * 0.0016;
        relayoutWall();
      }
      lastInteract = (performance.now() - t0) / 1000;
    };
    const onKey = (e: KeyboardEvent) => {
      const step = 0.12;
      if (e.key === 'ArrowLeft') vyaw -= step;
      else if (e.key === 'ArrowRight') vyaw += step;
      else if (e.key === 'ArrowUp') vpitch -= step;
      else if (e.key === 'ArrowDown') vpitch += step;
      else if (e.key === '+' || e.key === '=') zoom = clamp(zoom * 1.1, 0.7, 1.7);
      else if (e.key === '-') zoom = clamp(zoom / 1.1, 0.7, 1.7);
      else return;
      e.preventDefault();
      lastInteract = (performance.now() - t0) / 1000;
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onLeave);
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
    </div>
  );
});
