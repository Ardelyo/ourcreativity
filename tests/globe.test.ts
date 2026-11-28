import test from 'node:test';
import assert from 'node:assert/strict';
import { fibonacciSphere, rotateYX, normalize, lonLat, perspective, wrap, wallSlots, easeInOut, smoothstep } from '../lib/globe';

test('fibonacciSphere menghasilkan titik satuan yang unik dan menyebar rata', () => {
  const pts = fibonacciSphere(120);
  assert.equal(pts.length, 120);
  for (const p of pts) assert.ok(Math.abs(Math.hypot(p.x, p.y, p.z) - 1) < 1e-9);
  const keys = new Set(pts.map((p) => `${p.x.toFixed(4)},${p.y.toFixed(4)},${p.z.toFixed(4)}`));
  assert.equal(keys.size, 120);
  const meanY = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  assert.ok(Math.abs(meanY) < 0.02);
  assert.equal(fibonacciSphere(0).length, 0);
  assert.equal(fibonacciSphere(1).length, 1);
});

test('rotateYX menjaga panjang vektor dan bisa dibalik', () => {
  const v = normalize({ x: 0.3, y: -0.5, z: 0.8 });
  const r = rotateYX(v, 1.1, -0.4);
  assert.ok(Math.abs(Math.hypot(r.x, r.y, r.z) - 1) < 1e-9);
  const same = rotateYX(v, 0, 0);
  assert.ok(Math.abs(same.x - v.x) < 1e-12 && Math.abs(same.y - v.y) < 1e-12 && Math.abs(same.z - v.z) < 1e-12);
});

test('lonLat konsisten dengan arah: z positif = lon 0, y positif = lat positif', () => {
  const front = lonLat({ x: 0, y: 0, z: 1 });
  assert.ok(Math.abs(front.lon) < 1e-9 && Math.abs(front.lat) < 1e-9);
  assert.ok(lonLat({ x: 0, y: 1, z: 0 }).lat > 1.5);
  assert.ok(lonLat({ x: 1, y: 0, z: 0 }).lon > 1.5);
});

test('perspective membesarkan yang dekat dan mengecilkan yang jauh', () => {
  assert.ok(perspective(100, 500) > perspective(0, 500));
  assert.ok(perspective(-100, 500) < perspective(0, 500));
  assert.equal(perspective(0, 500), 1);
});

test('wrap memetakan ke rentang setengah periode', () => {
  for (const x of [-1234, -10, 0, 10, 999, 5000]) {
    const w = wrap(x, 300);
    assert.ok(w >= -150 && w < 150, `${x} -> ${w}`);
  }
  assert.equal(wrap(150, 300), -150);
});

test('wallSlots memberi petak unik untuk tiap titik dan menaruh utara di atas', () => {
  const pts = fibonacciSphere(97);
  const slots = wallSlots(pts, 12, 90, 110);
  assert.equal(slots.length, 97);
  const keys = new Set(slots.map((s) => `${s.gx.toFixed(2)},${s.gy.toFixed(2)}`));
  assert.equal(keys.size, 97);
  const north = pts.map((p, i) => ({ y: p.y, gy: slots[i].gy })).sort((a, b) => b.y - a.y);
  assert.ok(north[0].gy >= north[north.length - 1].gy);
  assert.deepEqual(wallSlots([], 5, 10, 10), []);
});

test('easing dan smoothstep berada di 0..1', () => {
  for (const t of [-1, 0, 0.25, 0.5, 1, 2]) {
    const e = easeInOut(t);
    assert.ok(e >= 0 && e <= 1);
    const s = smoothstep(0, 1, t);
    assert.ok(s >= 0 && s <= 1);
  }
});
