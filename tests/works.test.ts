import test from 'node:test';
import assert from 'node:assert/strict';
import { pickImage, isVideoUrl, toPublicWork, ratioFor, formatNo, hashString } from '../lib/works';

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
  assert.equal(w.full, null);
  assert.equal(w.edisi, 'grafis');
});

test('ratioFor stabil per id dan hashString deterministik', () => {
  assert.equal(ratioFor('abc'), ratioFor('abc'));
  assert.equal(hashString('abc'), hashString('abc'));
  assert.equal(formatNo(7), '007');
});
