import test from 'node:test';
import assert from 'node:assert/strict';
import { pickImage, isVideoUrl, toPublicWork, ratioFor, formatNo, hashString } from '../lib/works';
import { layoutCanvas, clampPan, initialPan } from '../lib/karyaLayout';

test('pickImage memilih thumbnail, lalu image_url, dan menolak berkas video', () => {
  assert.equal(pickImage({ thumbnail_url: 'https://x/t.jpg', image_url: 'https://x/a.jpg' }), 'https://x/t.jpg');
  assert.equal(pickImage({ thumbnail_url: null, image_url: 'https://x/a.png' }), 'https://x/a.png');
  assert.equal(pickImage({ thumbnail_url: null, image_url: 'https://x/clip.mp4?token=1' }), null);
  assert.equal(pickImage({ thumbnail_url: 'https://x/clip.webm', image_url: 'https://x/a.jpg' }), 'https://x/a.jpg');
  assert.equal(pickImage({ thumbnail_url: ' ', image_url: '' }), null);
});

test('isVideoUrl mengenali ekstensi video dengan query string', () => {
  assert.ok(isVideoUrl('https://x/a.MOV'));
  assert.ok(isVideoUrl('https://x/a.mp4?x=1'));
  assert.ok(!isVideoUrl('https://x/a.jpg'));
  assert.ok(!isVideoUrl(null));
});

test('toPublicWork mengisi nilai bawaan yang masuk akal', () => {
  const w = toPublicWork(
    { id: '1', title: null, author: null, author_id: null, division: null, type: null, image_url: null, thumbnail_url: null, created_at: '2026-11-28' },
    'rina',
  );
  assert.equal(w.title, 'Tanpa judul');
  assert.equal(w.author, 'rina');
  assert.equal(w.division, 'graphics');
  assert.equal(w.image, null);
  assert.equal(w.video, null);
});

test('ratioFor stabil per id dan hashString deterministik', () => {
  assert.equal(ratioFor('abc'), ratioFor('abc'));
  assert.equal(hashString('abc'), hashString('abc'));
  assert.equal(formatNo(7), '007');
});

test('layoutCanvas tidak membuat dua karya saling menimpa di desktop dan ponsel', () => {
  const items = Array.from({ length: 60 }, (_, i) => ({ id: `w-${i}`, ratio: ratioFor(`w-${i}`) }));
  for (const vw of [1440, 390]) {
    const { placed } = layoutCanvas(items, vw);
    const rects = Object.values(placed);
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i];
        const b = rects[j];
        const overlap = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
        assert.ok(!overlap, `tumpang tindih pada lebar ${vw}: ${i} dan ${j}`);
      }
    }
  }
});

test('clampPan menahan geseran di dalam batas dan initialPan tidak positif', () => {
  assert.deepEqual(clampPan(50, 50, 1000, 800, 3000, 2000), { x: 0, y: 0 });
  assert.deepEqual(clampPan(-5000, -5000, 1000, 800, 3000, 2000), { x: -2000, y: -1200 });
  assert.deepEqual(clampPan(10, 10, 1000, 800, 500, 400), { x: 0, y: 0 });
  assert.ok(initialPan(1000, 3000) <= 0);
  assert.equal(initialPan(1000, 800), 0);
});
