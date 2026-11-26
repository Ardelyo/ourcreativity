// Uji unit generateCodePreview (lib/codePreview.ts). Jalankan: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateCodePreview } from '../lib/codePreview';

const FILES = [
  { id: 'a', name: 'index.html', content: '<html><head></head><body><h1>Halo</h1></body></html>', language: 'html', isMain: false },
  { id: 'b', name: 'style.css', content: 'h1{color:red}', language: 'css', isMain: false },
  { id: 'c', name: 'main.js', content: 'console.log("x")', language: 'javascript', isMain: true },
];

test('konten kosong menghasilkan string kosong', () => {
  assert.equal(generateCodePreview('', 'html'), '');
  assert.equal(generateCodePreview(null, 'html'), '');
  assert.equal(generateCodePreview(undefined, 'html'), '');
});

test('multi-file (string JSON dari Studio): HTML jadi basis, CSS di head, JS di akhir body', () => {
  const out = generateCodePreview(JSON.stringify(FILES), 'javascript');
  assert.ok(out.includes('<h1>Halo</h1>'), 'isi HTML harus ada');
  assert.ok(out.includes('<style>h1{color:red}</style></head>'), 'CSS disisipkan sebelum </head>');
  assert.ok(out.includes('<script>console.log("x")'), 'JS disisipkan sebagai script');
  assert.ok(!out.includes('"id":"a"'), 'JSON mentah tidak boleh bocor ke dokumen (regresi pratinjau Profil)');
});

test('multi-file: array yang sudah di-parse berperilaku sama dengan string JSON', () => {
  assert.equal(generateCodePreview(FILES, 'javascript'), generateCodePreview(JSON.stringify(FILES), 'javascript'));
});

test('multi-file tanpa HTML: p5.js terdeteksi dan memuat pustaka p5', () => {
  const out = generateCodePreview(JSON.stringify([{ id: 'x', name: 'sketch.js', content: 'function setup(){createCanvas(100,100)}', isMain: true }]), 'p5js');
  assert.ok(out.includes('p5@1.9.4/lib/p5.min.js'));
  assert.ok(out.includes('createCanvas'));
});

test('multi-file tanpa HTML: JS biasa dibungkus try/catch dengan #app', () => {
  const out = generateCodePreview(JSON.stringify([{ id: 'x', name: 'a.js', content: 'var a = 1', isMain: true }]), 'javascript');
  assert.ok(out.includes('<div id="app"></div>'));
  assert.ok(out.includes('try{var a = 1}'));
  assert.ok(!out.includes('p5.min.js'));
});

test('</script> di dalam kode pengguna di-escape agar tidak menutup tag pembungkus', () => {
  const files = [
    { id: 'a', name: 'index.html', content: '<html><head></head><body></body></html>' },
    { id: 'c', name: 'main.js', content: 'var s = "</script><img src=x onerror=alert(1)>"', isMain: true },
  ];
  const out = generateCodePreview(JSON.stringify(files), 'javascript');
  assert.ok(out.includes('<\\/script>'), '</script> harus di-escape');
  // hanya satu pasang tag script pembungkus yang sah
  assert.equal((out.match(/<\/script>/gi) || []).length, 1);
});

test('format lama (string biasa): p5js, javascript, html, dan default', () => {
  assert.ok(generateCodePreview('function draw(){}', 'p5js').includes('p5@1.9.4'));
  assert.ok(generateCodePreview('alert(1)', 'javascript').includes('try{alert(1)}'));
  assert.equal(generateCodePreview('<p>x</p>', 'html'), '<p>x</p>');
  assert.ok(generateCodePreview('<p>x</p>', 'lainnya').includes('<body><p>x</p></body>'));
});

test('JSON rusak jatuh ke format lama tanpa melempar galat', () => {
  const origError = console.error;
  console.error = () => {};
  try {
    assert.equal(generateCodePreview('[bukan json', 'html'), '[bukan json');
  } finally {
    console.error = origError;
  }
});
