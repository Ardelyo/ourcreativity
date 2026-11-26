"""Uji asap keamanan XSS (jalan di Edge headless).

1. DOMPurify dengan konfigurasi persis lib/sanitize.ts harus membuang payload.
2. iframe srcDoc dengan sandbox="allow-scripts" tidak boleh bisa membaca localStorage
   origin induk. Kontrol positif: dengan allow-same-origin token HARUS terbaca,
   supaya terbukti tes ini memang bisa mendeteksi kerentanan.

Pakai: python xss_smoke.py <path_ke_base>
"""
import os, http.server, json, socketserver, sys, threading
from pathlib import Path
from playwright.sync_api import sync_playwright

base = Path(sys.argv[1])
purify = (base / "node_modules/dompurify/dist/purify.min.js").read_text(encoding="utf-8")

PAYLOADS = {
    "img_onerror": '<img src=x onerror="window.__pwn=1">',
    "script_tag": '<script>window.__pwn=1</script>',
    "svg_onload": '<svg onload="window.__pwn=1"></svg>',
    "js_href": '<a href="javascript:window.__pwn=1">x</a>',
    "iframe_srcdoc": '<iframe srcdoc="<script>parent.__pwn=1</script>"></iframe>',
    "style_expr": '<p style="background:url(javascript:window.__pwn=1)">x</p>',
    "form_action": '<form action="javascript:window.__pwn=1"><button>x</button></form>',
}
BENIGN = '<p>Halo <strong>dunia</strong> <a href="https://example.com">tautan</a></p>'

PAGE = "<!doctype html><title>t</title><body></body>"


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_GET(self):
        body = PAGE.encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


srv = socketserver.TCPServer(("127.0.0.1", 0), Quiet)
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()

failures = []
with sync_playwright() as p:
    b = p.chromium.launch(channel=(os.environ.get("PW_CHANNEL", "msedge") or None), headless=True)
    pg = b.new_context().new_page()
    pg.goto(f"http://127.0.0.1:{port}/")
    pg.add_script_tag(content=purify)

    # --- 1. DOMPurify ---
    for name, html in PAYLOADS.items():
        r = pg.evaluate(
            """(html) => {
                window.__pwn = 0;
                const clean = DOMPurify.sanitize(html, {
                    USE_PROFILES: { html: true },
                    FORBID_TAGS: ['form', 'input', 'textarea', 'select', 'button', 'option'],
                });
                const d = document.createElement('div');
                d.innerHTML = clean;            // sama seperti dangerouslySetInnerHTML
                document.body.appendChild(d);
                // javascript: di dalam atribut style tidak dieksekusi browser modern;
                // yang diukur adalah eksekusi nyata (__pwn) dan tag/atribut berbahaya.
                return { clean, pwn: window.__pwn,
                         bad: /<script|\\bon\\w+=|href="javascript:|<iframe|<form|<input|<button/i.test(clean) };
            }""",
            html,
        )
        ok = r["pwn"] == 0 and not r["bad"]
        print(f"[{'OK ' if ok else 'GAGAL'}] sanitize {name:14} -> {r['clean']!r}")
        if not ok:
            failures.append(f"sanitize {name}")
    r = pg.evaluate("(h) => DOMPurify.sanitize(h, { USE_PROFILES: { html: true } })", BENIGN)
    ok = "<strong>dunia</strong>" in r and 'href="https://example.com"' in r
    print(f"[{'OK ' if ok else 'GAGAL'}] konten wajar tetap utuh -> {r!r}")
    if not ok:
        failures.append("benign")

    # --- 2. Sandbox iframe ---
    pg.evaluate("localStorage.setItem('sb-token','RAHASIA-123')")
    probe = (
        "<script>"
        "var o={};"
        "try{o.ls=localStorage.getItem('sb-token')}catch(e){o.ls='ERR:'+e.name}"
        "try{o.parent=String(parent.document.title)}catch(e){o.parent='ERR:'+e.name}"
        "parent.postMessage(JSON.stringify(o),'*');"
        "</script>"
    )
    def run(sandbox):
        return pg.evaluate(
            """([probe, sandbox]) => new Promise(res => {
                const f = document.createElement('iframe');
                f.setAttribute('sandbox', sandbox);
                f.srcdoc = probe;
                window.addEventListener('message', e => res(JSON.parse(e.data)), { once: true });
                document.body.appendChild(f);
                setTimeout(() => res({ timeout: true }), 5000);
            })""",
            [probe, sandbox],
        )

    fixed = run("allow-scripts")
    ok = str(fixed.get("ls", "")).startswith("ERR:") and str(fixed.get("parent", "")).startswith("ERR:")
    print(f"[{'OK ' if ok else 'GAGAL'}] sandbox='allow-scripts'            -> {fixed}")
    if not ok:
        failures.append("sandbox fixed")

    vuln = run("allow-scripts allow-same-origin")
    leaked = vuln.get("ls") == "RAHASIA-123"
    print(f"[{'OK ' if leaked else 'GAGAL'}] kontrol: +allow-same-origin     -> {vuln}  (token HARUS bocor di sini)")
    if not leaked:
        failures.append("control did not detect vulnerability")
    b.close()

srv.shutdown()
print("\nHASIL:", "LOLOS" if not failures else "GAGAL: " + ", ".join(failures))
sys.exit(1 if failures else 0)
