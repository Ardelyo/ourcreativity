"""Uji asap UI di Edge headless terhadap build (dist/). Semua panggilan Supabase dan
GitHub di-mock; tidak ada request ke layanan produksi.

Pakai: python smoke_ui.py <path_ke_repo>   (butuh `dist/` hasil vite build)
"""
import os, http.server, json, mimetypes, socketserver, sys, threading
from pathlib import Path
from playwright.sync_api import sync_playwright

root = Path(sys.argv[1]) / "dist"
CACHE_KEY = "ourcreativity_contributors_v6_cache"
fails = []


def check(name, ok, detail=""):
    print(f"[{'OK ' if ok else 'GAGAL'}] {name} {detail}")
    if not ok:
        fails.append(name)


class SPA(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_GET(self):
        p = self.path.split("?")[0]
        f = root / p.lstrip("/")
        if p != "/" and f.is_file():
            data, ctype = f.read_bytes(), mimetypes.guess_type(str(f))[0] or "application/octet-stream"
        else:
            data, ctype = (root / "index.html").read_bytes(), "text/html"
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


srv = socketserver.ThreadingTCPServer(("127.0.0.1", 0), SPA)
srv.daemon_threads = True
BASE = f"http://127.0.0.1:{srv.server_address[1]}"
threading.Thread(target=srv.serve_forever, daemon=True).start()


def new_page(ctx, errors, requests_seen, github_fail=True):
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: errors.append(str(e)))
    pg.on("request", lambda r: requests_seen.append(r.url))

    def supa(route):
        if route.request.method == "OPTIONS":
            route.fulfill(status=204, headers={"access-control-allow-origin": "*", "access-control-allow-headers": "*"})
        else:
            route.fulfill(status=200, content_type="application/json", body="[]",
                          headers={"access-control-allow-origin": "*", "content-range": "0-0/0"})

    pg.route("**/*.supabase.co/**", supa)
    if github_fail:
        pg.route("https://api.github.com/**", lambda r: r.abort())
    pg.route("https://fonts.googleapis.com/**", lambda r: r.fulfill(status=200, content_type="text/css", body=""))
    pg.route("https://fonts.gstatic.com/**", lambda r: r.abort())
    pg.route("https://*.vercel-scripts.com/**", lambda r: r.abort())
    # Skrip analytics Vercel hanya ada di platform Vercel; di server tes jawab JS kosong.
    pg.route("**/_vercel/**", lambda r: r.fulfill(status=200, content_type="application/javascript", body=""))
    return pg


with sync_playwright() as p:
    b = p.chromium.launch(channel=(os.environ.get("PW_CHANNEL", "msedge") or None), headless=True)

    # 1. Beranda: tanpa error, favicon ada, tanpa avatar palsu, angka anggota konsisten
    ctx = b.new_context(viewport={"width": 1440, "height": 900})
    errs, reqs = [], []
    pg = new_page(ctx, errs, reqs)
    pg.goto(BASE + "/", wait_until="load")
    pg.wait_for_timeout(3500)
    body = pg.inner_text("body")
    check("beranda: tanpa pageerror", not errs, str(errs[:2]))
    check("beranda: tanpa avatar pravatar.cc", not any("pravatar" in u for u in reqs))
    check("beranda: menampilkan angka anggota terpusat", "3.000+" in body and "3.2k" not in body)
    href = pg.get_attribute("link[rel=icon]", "href")
    r = pg.request.get(BASE + href)
    check("favicon bisa dimuat sebagai gambar", r.ok and "image" in r.headers.get("content-type", ""), f"{href} -> {r.status} {r.headers.get('content-type')}")
    check("<head> eksplisit + og:title", pg.locator("head > meta[property='og:title']").count() == 1)

    # 2. robots.txt dan sitemap.xml bukan HTML aplikasi
    for f, ct in (("robots.txt", "text/plain"), ("sitemap.xml", "xml")):
        r = pg.request.get(f"{BASE}/{f}")
        check(f"/{f} berisi file asli, bukan SPA", r.ok and ct in r.headers.get("content-type", "") and "<html" not in r.text().lower(),
              r.headers.get("content-type", ""))

    # 3. Tautan share /karya?id=... membuka halaman Karya tanpa crash
    pg2 = new_page(ctx, errs2 := [], [])
    pg2.goto(BASE + "/karya?id=00000000-0000-0000-0000-000000000000", wait_until="load")
    pg2.wait_for_timeout(2500)
    check("tautan share /karya?id=... tidak crash", not errs2 and pg2.url.endswith("/karya?id=00000000-0000-0000-0000-000000000000"), pg2.url)

    # 4. Halaman Tim: GitHub gagal + cache valid (bentuk baru) -> tidak crash
    def tim(cache_value, label):
        errs3 = []
        c = b.new_context(viewport={"width": 1280, "height": 900})
        pg3 = new_page(c, errs3, [])
        pg3.add_init_script(f"localStorage.setItem({json.dumps(CACHE_KEY)}, {json.dumps(cache_value)})") if cache_value is not None else None
        pg3.goto(BASE + "/tim", wait_until="load")
        pg3.wait_for_timeout(3500)
        txt = pg3.inner_text("body")
        crashed = bool(errs3) or "Something went wrong" in txt
        check(f"/tim saat GitHub gagal, {label}: tidak crash", not crashed, str(errs3[:1]))
        check(f"/tim {label}: konten tetap tampil", len(txt.strip()) > 200)
        c.close()

    valid = json.dumps({"contributors": [{"login": "Ardelyo", "avatar_url": "", "html_url": "", "contributions": 5,
                        "totalAdditions": 0, "totalDeletions": 0, "bio": "x", "socials": {}}],
                        "reporters": [], "timestamp": 1})
    tim(valid, "cache valid")
    tim("{bukan json", "cache rusak")
    tim(None, "tanpa cache")
    b.close()

srv.shutdown()
print("\nHASIL:", "LOLOS" if not fails else "GAGAL: " + "; ".join(fails))
sys.exit(1 if fails else 0)
