// Laporan kontributor event: PR merge, reward, bug yang dilaporkan.
// Pakai: GITHUB_TOKEN=... node scripts/event-report.mjs --since 2026-11-01 --until 2026-11-30 [--out event/report]
// Opsional: GITHUB_REPO (default OurCreativity/ourcreativity), GITHUB_API (untuk tes).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const arg = (name, fallback) => {
    const i = process.argv.indexOf(`--${name}`);
    return i > -1 ? process.argv[i + 1] : fallback;
};
const repo = process.env.GITHUB_REPO || 'OurCreativity/ourcreativity';
const api = process.env.GITHUB_API || 'https://api.github.com';
const since = arg('since');
const until = arg('until', new Date().toISOString().slice(0, 10));
const out = arg('out', 'event/report');
if (!since) { console.error('Wajib: --since YYYY-MM-DD'); process.exit(1); }

const cfg = JSON.parse(readFileSync(new URL('../event/rewards.json', import.meta.url), 'utf8'));
const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

const get = async (path) => {
    const res = await fetch(`${api}${path}`, { headers });
    if (!res.ok) throw new Error(`${res.status} ${path}: ${await res.text()}`);
    return res.json();
};
const searchAll = async (q) => {
    const items = [];
    for (let page = 1; page <= 10; page++) {
        const data = await get(`/search/issues?q=${encodeURIComponent(q)}&per_page=100&page=${page}`);
        items.push(...data.items);
        if (data.items.length < 100) break;
    }
    return items;
};

const issueCache = new Map();
const issueLabels = async (n) => {
    if (!issueCache.has(n)) {
        try { issueCache.set(n, (await get(`/repos/${repo}/issues/${n}`)).labels.map((l) => l.name)); }
        catch { issueCache.set(n, []); }
    }
    return issueCache.get(n);
};
const rewardFor = (labels) => Math.max(0, ...labels.map((l) => cfg.labels[l] ?? 0));
const closing = (body = '') =>
    [...body.matchAll(/\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#(\d+)/gi)].map((m) => Number(m[1]));

const excluded = new Set(cfg.excludeUsers.map((u) => u.toLowerCase()));
const users = new Map();
const user = (login) => {
    if (!users.has(login)) users.set(login, { login, merged: 0, reward: 0, reports: 0, prs: [] });
    return users.get(login);
};

const prs = await searchAll(`repo:${repo} is:pr is:merged merged:${since}..${until}`);
for (const pr of prs) {
    const login = pr.user.login;
    if (pr.user.type === 'Bot' || excluded.has(login.toLowerCase())) continue;
    const labels = new Set(pr.labels.map((l) => l.name));
    for (const n of closing(pr.body)) (await issueLabels(n)).forEach((l) => labels.add(l));
    const reward = rewardFor([...labels]);
    const u = user(login);
    u.merged += 1;
    u.reward += reward;
    u.prs.push(`#${pr.number}`);
}

const bugs = await searchAll(`repo:${repo} is:issue label:bug created:${since}..${until}`);
for (const issue of bugs) {
    const login = issue.user.login;
    if (issue.user.type === 'Bot' || excluded.has(login.toLowerCase())) continue;
    user(login).reports += 1;
}

const rows = [...users.values()]
    .map((u) => ({ ...u, capped: Math.min(u.reward, cfg.maxPerUser) }))
    .sort((a, b) => b.capped - a.capped || b.merged - a.merged);

const csv = ['github,pr_merged,bug_reports,reward_rp,reward_setelah_batas,pr'].concat(
    rows.map((r) => [r.login, r.merged, r.reports, r.reward, r.capped, `"${r.prs.join(' ')}"`].join(',')),
).join('\n');
const total = rows.reduce((s, r) => s + r.capped, 0);
const md = [
    `# Laporan Event ${since} s/d ${until}`,
    '',
    `Repo: ${repo} | PR merge: ${prs.length} | Kontributor: ${rows.length} | Total reward: Rp ${total.toLocaleString('id-ID')}`,
    '',
    '| # | GitHub | PR merge | Laporan bug | Reward (Rp) |',
    '|---|--------|----------|-------------|-------------|',
    ...rows.map((r, i) => `| ${i + 1} | @${r.login} | ${r.merged} | ${r.reports} | ${r.capped.toLocaleString('id-ID')} |`),
    '',
    'Catatan: reward hanya perkiraan dari label. Host menentukan final dan memeriksa duplikat sebelum payout.',
].join('\n');

mkdirSync(new URL('../event/', import.meta.url), { recursive: true });
writeFileSync(`${out}.csv`, csv + '\n');
writeFileSync(`${out}.md`, md + '\n');
console.log(md);
