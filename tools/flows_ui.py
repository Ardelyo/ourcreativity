"""Uji alur login, guard admin, aksi admin, unggah avatar dan publikasi Studio terhadap build (dist/).

Supabase di-mock dengan state; tidak ada request ke layanan produksi. Mock Storage menegakkan aturan
yang SAMA dengan policy produksi (supabase/migrations/20261128*.sql), jadi jika kode mengunggah ke path
yang akan ditolak RLS, tes ini gagal (kontrol negatif membuktikannya).

Pakai: python flows_ui.py <path_ke_repo>   (butuh `dist/` hasil vite build dengan
VITE_SUPABASE_URL=https://dummy.supabase.co dan VITE_SUPABASE_ANON_KEY=dummy)
"""
import base64, http.server, json, mimetypes, os, re, socketserver, struct, sys, threading, time, zlib
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from playwright.sync_api import sync_playwright

root = Path(sys.argv[1]) / "dist"
# Kunci sesi supabase-js di localStorage = sb-<subdomain URL>-auth-token. Cocokkan dengan VITE_SUPABASE_URL saat build
# (lokal: https://dummy.supabase.co; CI: https://example.supabase.co -> TEST_SUPABASE_REF=example).
REF = os.environ.get("TEST_SUPABASE_REF", "dummy")
fails = []


def check(name, ok, detail=""):
    print(f"[{'OK ' if ok else 'GAGAL'}] {name} {detail}")
    if not ok:
        fails.append(name)


# ------------------------------------------------------------------ server statis (SPA)
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


# ------------------------------------------------------------------ data uji
def b64u(b):
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode()


def jwt(uid, role="authenticated"):
    h = b64u(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    p = b64u(json.dumps({"sub": uid, "role": role, "exp": int(time.time()) + 3600, "aud": "authenticated"}).encode())
    return f"{h}.{p}.{b64u(b'sig')}"


def make_png(w=64, h=64):
    raw = b"".join(b"\x00" + bytes([200, 60, 90]) * w for _ in range(h))
    def chunk(t, d):
        c = struct.pack(">I", len(d)) + t + d
        return c + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw)) + chunk(b"IEND", b""))


PNG = make_png()
MEMBER_ID = "11111111-1111-4111-8111-111111111111"
ADMIN_ID = "22222222-2222-4222-8222-222222222222"
PENDING_ID = "33333333-3333-4333-8333-333333333333"


def new_state(policy="current"):
    return {
        "login_ok": True,
        "login_as": MEMBER_ID,
        "policy": policy,  # "current" = produksi sekarang, "old" = versi pertama 20261128 (regresi)
        "profiles": {
            MEMBER_ID: {"id": MEMBER_ID, "username": "member_uji", "avatar_url": "", "is_approved": True, "role": "member", "bio": "", "website": "", "updated_at": "2026-01-01T00:00:00Z"},
            ADMIN_ID: {"id": ADMIN_ID, "username": "admin_uji", "avatar_url": "", "is_approved": True, "role": "admin", "bio": "", "website": "", "updated_at": "2026-01-02T00:00:00Z"},
            PENDING_ID: {"id": PENDING_ID, "username": "pending_uji", "avatar_url": "", "is_approved": False, "role": "member", "bio": "", "website": "", "updated_at": "2026-01-03T00:00:00Z"},
        },
        "calls": [],
    }


def storage_allowed(state, bucket, path, uid):
    """Cermin policy storage produksi (20261128 + 20261128b)."""
    if not uid:
        return False  # anon tidak boleh upload
    parts = path.split("/")
    folder1 = parts[0] if len(parts) > 1 else None
    if bucket == "works":
        allowed = {uid} if state["policy"] == "old" else {uid, "images", "videos"}
        return folder1 is None or folder1 in allowed
    if bucket == "avatars":
        return path.startswith(uid + "-")
    return False


CORS = {"access-control-allow-origin": "*", "access-control-allow-headers": "*",
        "access-control-allow-methods": "*", "access-control-expose-headers": "content-range"}


def json_resp(route, status, body, extra=None):
    h = dict(CORS)
    h.update(extra or {})
    route.fulfill(status=status, content_type="application/json", body=json.dumps(body), headers=h)


def supa_handler(state):
    def handler(route):
        req = route.request
        u = urlparse(req.url)
        path, q, method = u.path, parse_qs(u.query), req.method
        if method == "OPTIONS":
            return route.fulfill(status=204, headers=CORS)
        try:
            body = req.post_data or ""
        except UnicodeDecodeError:  # unggahan file = badan biner
            body = ""
        auth =req.headers.get("authorization", "")
        m = re.search(r"Bearer\s+[^.]+\.([^.]+)\.", auth)
        uid = None
        if m:
            try:
                claims = json.loads(base64.urlsafe_b64decode(m.group(1) + "=" * (-len(m.group(1)) % 4)))
                uid = claims.get("sub")
            except Exception:
                uid = None
        state["calls"].append({"method": method, "path": path, "q": q, "body": body, "uid": uid})

        # ---- auth
        if path == "/auth/v1/token" and method == "POST":
            if not state["login_ok"]:
                return json_resp(route, 400, {"code": 400, "error_code": "invalid_credentials", "msg": "Invalid login credentials"})
            uid_ = state["login_as"]
            user = {"id": uid_, "aud": "authenticated", "role": "authenticated", "email": "uji@example.invalid", "app_metadata": {}, "user_metadata": {}, "created_at": "2026-01-01T00:00:00Z"}
            return json_resp(route, 200, {"access_token": jwt(uid_), "token_type": "bearer", "expires_in": 3600,
                                         "expires_at": int(time.time()) + 3600, "refresh_token": "r", "user": user})
        if path == "/auth/v1/user":
            return json_resp(route, 200, {"id": uid or MEMBER_ID, "aud": "authenticated", "email": "uji@example.invalid", "app_metadata": {}, "user_metadata": {}, "created_at": "2026-01-01T00:00:00Z"})
        if path == "/auth/v1/logout":
            return route.fulfill(status=204, headers=CORS)

        # ---- storage
        if path.startswith("/storage/v1/object/public/"):
            return route.fulfill(status=200, content_type="image/png", body=PNG, headers=CORS)
        if path.startswith("/storage/v1/object/") and method in ("POST", "PUT"):
            rest = path[len("/storage/v1/object/"):]
            bucket, _, objpath = rest.partition("/")
            if not storage_allowed(state, bucket, objpath, uid):
                return json_resp(route, 403, {"statusCode": "403", "error": "Unauthorized", "message": "new row violates row-level security policy"})
            return json_resp(route, 200, {"Key": rest, "Id": "obj"})

        # ---- rest
        if path.startswith("/rest/v1/"):
            table = path[len("/rest/v1/"):]
            if table == "profiles":
                idq = (q.get("id") or [""])[0]
                target = idq[3:] if idq.startswith("eq.") else None
                if method == "GET":
                    rows = list(state["profiles"].values())
                    if target:
                        rows = [r for r in rows if r["id"] == target]
                    if "eq.false" in (q.get("is_approved") or []):
                        rows = [r for r in rows if not r["is_approved"]]
                    if "eq.admin" in (q.get("role") or []):
                        rows = [r for r in rows if r["role"] == "admin"]
                    if "application/vnd.pgrst.object" in req.headers.get("accept", ""):
                        if not rows:
                            return json_resp(route, 406, {"code": "PGRST116", "message": "no rows"})
                        return json_resp(route, 200, rows[0])
                    return json_resp(route, 200, rows, {"content-range": f"0-{max(len(rows)-1,0)}/{len(rows)}"})
                if method == "PATCH" and target:
                    state["profiles"][target].update(json.loads(body or "{}"))
                    return route.fulfill(status=204, headers=CORS)
                if method == "POST":  # upsert dari Settings
                    data = json.loads(body or "{}")
                    if isinstance(data, list):
                        data = data[0]
                    state["profiles"].setdefault(data["id"], {}).update(data)
                    return route.fulfill(status=204, headers=CORS)
            if method == "POST":
                return route.fulfill(status=201, headers=CORS, content_type="application/json", body="[]")
            return json_resp(route, 200, [], {"content-range": "0-0/0"})

        return json_resp(route, 200, [])
    return handler


def new_page(b, state, seed_user=None, viewport=(1440, 900)):
    ctx = b.new_context(viewport={"width": viewport[0], "height": viewport[1]})
    if seed_user:
        sess = {"access_token": jwt(seed_user), "token_type": "bearer", "expires_in": 3600,
                "expires_at": int(time.time()) + 3600, "refresh_token": "r",
                "user": {"id": seed_user, "aud": "authenticated", "role": "authenticated", "email": "uji@example.invalid",
                         "app_metadata": {}, "user_metadata": {}, "created_at": "2026-01-01T00:00:00Z"}}
        ctx.add_init_script(f"localStorage.setItem('sb-{REF}-auth-token', {json.dumps(json.dumps(sess))})")
    pg = ctx.new_page()
    pg.errors, pg.dialogs = [], []
    pg.on("pageerror", lambda e: pg.errors.append(str(e)))

    def on_dialog(d):
        pg.dialogs.append(d.message)
        d.dismiss()
    pg.on("dialog", on_dialog)
    pg.route("**/*.supabase.co/**", supa_handler(state))
    pg.route("https://api.github.com/**", lambda r: r.abort())
    pg.route("https://fonts.googleapis.com/**", lambda r: r.fulfill(status=200, content_type="text/css", body=""))
    pg.route("https://fonts.gstatic.com/**", lambda r: r.abort())
    pg.route("https://*.vercel-scripts.com/**", lambda r: r.abort())
    pg.route("https://cdn.jsdelivr.net/**", lambda r: r.abort())
    pg.route("**/_vercel/**", lambda r: r.fulfill(status=200, content_type="application/javascript", body=""))
    return ctx, pg


def calls(state, method=None, prefix=None):
    return [c for c in state["calls"] if (method is None or c["method"] == method) and (prefix is None or c["path"].startswith(prefix))]


with sync_playwright() as p:
    b = p.chromium.launch(channel=(os.environ.get("PW_CHANNEL", "msedge") or None), headless=True)

    # ============================================================ 1. LOGIN
    st = new_state()
    ctx, pg = new_page(b, st)
    pg.goto(BASE + "/login", wait_until="load")
    pg.fill("input[type=email]", "uji@example.invalid")
    pg.fill("input[type=password]", "rahasia-uji")
    pg.click("button[type=submit]")
    pg.wait_for_timeout(2500)
    tok = calls(st, "POST", "/auth/v1/token")
    body = json.loads(tok[0]["body"]) if tok else {}
    check("login: kredensial dikirim ke endpoint auth", bool(tok) and body.get("email") == "uji@example.invalid" and body.get("password") == "rahasia-uji")
    check("login: berhasil -> pindah ke beranda", pg.url.rstrip("/") == BASE, pg.url)
    check("login: sesi tersimpan", pg.evaluate(f"!!localStorage.getItem('sb-{REF}-auth-token')"))
    check("login: profil diambil setelah masuk", bool(calls(st, "GET", "/rest/v1/profiles")))
    check("login: tanpa pageerror", not pg.errors, str(pg.errors[:1]))
    ctx.close()

    st = new_state()
    st["login_ok"] = False
    ctx, pg = new_page(b, st)
    pg.goto(BASE + "/login", wait_until="load")
    pg.fill("input[type=email]", "uji@example.invalid")
    pg.fill("input[type=password]", "salah")
    pg.click("button[type=submit]")
    pg.wait_for_timeout(1500)
    check("login gagal: pesan galat tampil, tetap di /login",
          "Invalid login credentials" in pg.inner_text("body") and pg.url.endswith("/login"), pg.url)
    check("login gagal: tidak ada sesi tersimpan", not pg.evaluate(f"!!localStorage.getItem('sb-{REF}-auth-token')"))
    ctx.close()

    # ============================================================ 2. GUARD ADMIN
    st = new_state()
    ctx, pg = new_page(b, st)
    pg.goto(BASE + "/admin", wait_until="load")
    pg.wait_for_timeout(2000)
    check("admin: tanpa login dialihkan ke beranda", pg.url.rstrip("/") == BASE, pg.url)
    ctx.close()

    st = new_state()
    ctx, pg = new_page(b, st, seed_user=MEMBER_ID)
    pg.goto(BASE + "/admin/users", wait_until="load")
    pg.wait_for_timeout(2500)
    check("admin: member biasa dialihkan ke beranda", pg.url.rstrip("/") == BASE, pg.url)
    check("admin: member biasa tidak melihat panel pengguna", "Manajemen Pengguna" not in pg.inner_text("body"))
    ctx.close()

    # ============================================================ 3. AKSI ADMIN
    st = new_state()
    ctx, pg = new_page(b, st, seed_user=ADMIN_ID)
    pg.goto(BASE + "/admin/users", wait_until="load")
    pg.wait_for_selector("text=Manajemen Pengguna", timeout=8000)
    pg.wait_for_selector("text=pending_uji", timeout=8000)
    check("admin: panel pengguna tampil untuk admin", pg.url.endswith("/admin/users"), pg.url)
    check("admin: daftar pengguna dari server tampil", all(n in pg.inner_text("body") for n in ("member_uji", "admin_uji", "pending_uji")))
    row = pg.locator("tr", has_text="pending_uji")
    row.locator("button[title='Setujui']").click(force=True)
    pg.wait_for_timeout(1500)
    patch = [c for c in calls(st, "PATCH", "/rest/v1/profiles") if f"eq.{PENDING_ID}" in c["q"].get("id", [""])[0]]
    check("admin: Setujui mengirim PATCH is_approved=true hanya untuk user itu",
          len(patch) == 1 and json.loads(patch[0]["body"]) == {"is_approved": True}, str([c["body"] for c in patch]))
    check("admin: state server berubah", st["profiles"][PENDING_ID]["is_approved"] is True)
    row = pg.locator("tr", has_text="member_uji")
    row.locator("button[title='Jadikan Admin']").click(force=True)
    pg.wait_for_timeout(1200)
    patch = [c for c in calls(st, "PATCH", "/rest/v1/profiles") if f"eq.{MEMBER_ID}" in c["q"].get("id", [""])[0]]
    check("admin: Jadikan Admin mengirim PATCH role=admin", len(patch) == 1 and json.loads(patch[0]["body"]) == {"role": "admin"})
    check("admin: tanpa pageerror", not pg.errors, str(pg.errors[:1]))
    ctx.close()

    # ============================================================ 4. UNGGAH AVATAR (Settings)
    st = new_state()
    ctx, pg = new_page(b, st, seed_user=MEMBER_ID)
    pg.goto(BASE + "/settings", wait_until="load")
    pg.wait_for_selector("input[type=file]", state="attached", timeout=8000)
    pg.locator("input[type=file]").set_input_files({"name": "a.png", "mimeType": "image/png", "buffer": PNG})
    pg.fill("textarea", "bio dari tes")
    pg.get_by_role("button", name=re.compile("Simpan Perubahan")).click()
    pg.wait_for_timeout(2500)
    up = [c for c in calls(st, "POST", "/storage/v1/object/avatars/")]
    check("avatar: diunggah ke avatars/<user_id>-<ts>.png",
          len(up) == 1 and re.fullmatch(rf"/storage/v1/object/avatars/{MEMBER_ID}-\d+\.png", up[0]["path"]) is not None,
          str([c["path"] for c in up]))
    ups = [c for c in calls(st, "POST", "/rest/v1/profiles")]
    pl = json.loads(ups[0]["body"]) if ups else {}
    if isinstance(pl, list):
        pl = pl[0]
    check("avatar: profil disimpan tanpa role/is_approved (aman terhadap trigger anti-eskalasi)",
          bool(ups) and "role" not in pl and "is_approved" not in pl and pl.get("id") == MEMBER_ID and pl.get("bio") == "bio dari tes", str(sorted(pl)))
    check("avatar: URL publik avatars tersimpan di profil", f"{REF}.supabase.co/storage/v1/object/public/avatars/" in pl.get("avatar_url", ""), pl.get("avatar_url", ""))
    check("avatar: notifikasi berhasil tampil", "Profil berhasil diperbarui" in pg.inner_text("body"))
    check("avatar: tanpa pageerror", not pg.errors, str(pg.errors[:1]))
    ctx.close()

    # ============================================================ 5. PUBLIKASI STUDIO (mode gambar)
    DRAFT = [{"id": "d1", "title": "Karya Uji", "mode": "image", "content": "", "division": "graphics",
              "lastSaved": "2026-01-01T00:00:00.000Z"}]

    def publish(policy):
        st_ = new_state(policy)
        ctx_, pg_ = new_page(b, st_, seed_user=MEMBER_ID)
        pg_.add_init_script(f"localStorage.setItem('oc_studio_v2_drafts', {json.dumps(json.dumps(DRAFT))})")
        pg_.goto(BASE + "/studio", wait_until="load")
        pg_.wait_for_selector("button[title='Pengaturan']", timeout=10000)
        # Pada layout mode gambar tombol berada di luar viewport; kirim event klik langsung.
        pg_.locator("button[title='Pengaturan']").dispatch_event("click")
        pg_.wait_for_selector("text=Detail Draft", timeout=5000)
        # Input cover milik panel pengaturan dirender paling akhir; yang pertama milik VisualBuilder (slide).
        pg_.locator("input[type=file][accept='image/*']").last.set_input_files({"name": "karya.png", "mimeType": "image/png", "buffer": PNG})
        pg_.get_by_role("button", name=re.compile("Publikasikan Proyek")).click()
        pg_.wait_for_timeout(6000)
        return st_, ctx_, pg_

    st, ctx, pg = publish("current")
    ups = [c["path"] for c in calls(st, "POST", "/storage/v1/object/works/")]
    check("studio: gambar diunggah ke works/images/*.webp", any(re.fullmatch(r"/storage/v1/object/works/images/\d+_\w+\.webp", u) for u in ups), str(ups))
    check("studio: thumbnail diunggah ke works/images/thumbnails/", any("/works/images/thumbnails/" in u for u in ups), str(ups))
    works = calls(st, "POST", "/rest/v1/works")
    wb = json.loads(works[0]["body"])[0] if works else {}
    check("studio: karya disimpan dengan author_id = user login, type=image",
          bool(works) and wb.get("author_id") == MEMBER_ID and wb.get("type") == "image" and wb.get("title") == "Karya Uji", str({k: wb.get(k) for k in ("author_id", "type", "title")}))
    check("studio: image_url mengarah ke works/images", "/storage/v1/object/public/works/images/" in (wb.get("image_url") or ""), str(wb.get("image_url")))
    check("studio: setelah publikasi pindah ke /karya", pg.url.endswith("/karya"), pg.url)
    check("studio: tanpa dialog galat", not [d for d in pg.dialogs if "Gagal" in d], str(pg.dialogs))
    check("studio: tanpa pageerror", not pg.errors, str(pg.errors[:1]))
    ctx.close()

    # kontrol negatif: policy versi pertama 20261128 (hanya <uid>/ dan root) HARUS membuat publikasi gagal
    st, ctx, pg = publish("old")
    check("kontrol negatif: policy lama menolak images/ -> publikasi gagal (tes ini memang mendeteksi regresi)",
          any("Gagal" in d for d in pg.dialogs) and not calls(st, "POST", "/rest/v1/works"), str(pg.dialogs))
    ctx.close()

    # ============================================================ 6. EDITOR STUDIO TIDAK CRASH (mode teks bawaan)
    # Regresi nyata: editor Tiptap yang di-destroy setelah effect disambung ulang membuat seluruh /studio crash.
    st = new_state()
    ctx, pg = new_page(b, st, seed_user=MEMBER_ID)
    pg.goto(BASE + "/studio", wait_until="load")
    pg.wait_for_timeout(3500)
    check("studio: halaman tidak crash (tanpa ErrorBoundary)", "Terjadi Kesalahan" not in pg.inner_text("body"), pg.inner_text("body")[:120].replace("\n", " "))
    check("studio: editor teks tampil", pg.locator(".ProseMirror").count() == 1)
    if pg.locator(".ProseMirror").count():
        pg.locator(".ProseMirror").first.click()
        pg.keyboard.type("halo dunia")
        pg.wait_for_timeout(400)
        check("studio: editor bisa diketik", "halo dunia" in pg.locator(".ProseMirror").first.inner_text())
    check("studio: tanpa pageerror", not pg.errors, str(pg.errors[:1]))
    ctx.close()

    # ============================================================ 7. ADMIN: REFRESH LANGSUNG DI /admin TIDAK MELEMPAR ADMIN KELUAR
    # Regresi nyata: loading dimatikan sebelum profil (role) selesai diambil; AdminGuard mengalihkan admin sah.
    st = new_state()
    ctx, pg = new_page(b, st, seed_user=ADMIN_ID)
    pg.goto(BASE + "/admin", wait_until="load")
    pg.wait_for_timeout(2500)
    check("admin: refresh langsung di /admin tetap di /admin", pg.url.rstrip("/").endswith("/admin"), pg.url)
    ctx.close()

    b.close()

srv.shutdown()
print("\nHASIL:", "LOLOS" if not fails else "GAGAL: " + "; ".join(fails))
sys.exit(1 if fails else 0)
