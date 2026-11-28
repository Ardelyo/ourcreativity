import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Reveal } from '../components/modern/Reveal';
import { Arrow, Em, LinkButton, LoadingMark, PageHeader, PAGE_X, SectionRule } from '../components/modern/ui';

// --- Tipe Data ---
interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface GitHubIssue {
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  title: string;
  number: number;
  state: string;
}

interface ContributorStats {
  author: {
    login: string;
  };
  total: number;
  weeks: { a: number; d: number; c: number }[];
}

interface BioData {
  bio: string;
  twitter?: string;
  website?: string;
}

interface ReporterData {
  login: string;
  avatar_url: string;
  html_url: string;
  issueTitle: string;
  issueCount: number;
}

interface EnhancedContributor extends Contributor {
  totalAdditions: number;
  totalDeletions: number;
  bio?: string;
  socials?: {
    twitter?: string;
    website?: string;
  };
}

const OWNER_LOGIN = 'Ardelyo';
const REPO_OWNER = 'Ardelyo';
const REPO_NAME = 'OurCreativity';

const BIO_MAPPING: Record<string, BioData> = {
  'Ardelyo': {
    bio: "Founder OurCreativity Edisi Coding, Website Developer 3 Years Experience.",
    website: "https://ardelyo.com"
  },
  'mrmambu': {
    bio: "Penyihir Desain & Ahli Frontend. Menciptakan pengalaman pixel-perfect.",
  },
  'Kira262': {
    bio: "Kontributor inti yang berfokus pada arsitektur sistem dan performa.",
  },
  'fk0u': {
    bio: "Al-Ghani Desta Setyawan. Pengembang Full-Stack & Flutter. Meningkatkan fitur dan stabilitas platform dengan logika dan kreativitas.",
    website: "https://kou.it.com"
  }
};

// Cache untuk mengurangi API calls
const CACHE_KEY = 'ourcreativity_contributors_v6_cache'; // Version 6: Fix fk0u contribution count to 2
const CACHE_DURATION = 15 * 60 * 1000; // 15 menit

// Fallback data dengan kontributor asli dari repo OurCreativity
const FALLBACK_CONTRIBUTORS: Contributor[] = [
  {
    login: 'Ardelyo',
    avatar_url: 'https://avatars.githubusercontent.com/u/117548799?v=4',
    html_url: 'https://github.com/Ardelyo',
    contributions: 13
  },
  {
    login: 'mrmambu',
    avatar_url: 'https://avatars.githubusercontent.com/u/12300000?v=4',
    html_url: 'https://github.com/mrmambu',
    contributions: 5
  },
  {
    login: 'Kira262',
    avatar_url: 'https://avatars.githubusercontent.com/u/96334657?v=4',
    html_url: 'https://github.com/Kira262',
    contributions: 3
  },
  {
    login: 'fk0u',
    avatar_url: 'https://avatars.githubusercontent.com/u/142812925?v=4',
    html_url: 'https://github.com/fk0u',
    contributions: 2
  }
];

export const Tim = () => {
  const [contributors, setContributors] = useState<EnhancedContributor[]>([]);
  const [reporters, setReporters] = useState<ReporterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => { // Ambil data dari GitHub API
    try {
      setLoading(true);
      setError(null);

      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { contributors: cData, reporters: rData, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setContributors(cData);
          setReporters(rData);
          setLoading(false);
          return;
        }
      }

      // 1. Ambil Kontributor
      const contribRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors`);
      if (!contribRes.ok) throw new Error(`GitHub API Error: ${contribRes.status}`);
      const contribData: Contributor[] = await contribRes.json();

      // 2. Ambil Masalah (Issues) buat cari pelapor bug
      const issuesRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=all&per_page=100`);
      const reportersMap: Record<string, ReporterData> = {};

      if (issuesRes.ok) {
        const issuesData: GitHubIssue[] = await issuesRes.json();
        issuesData.forEach(issue => {
          const login = issue.user.login;
          // Exclude core contributors and fk0u from reporters list
          if (!contribData.some(c => c.login === login) && login !== 'fk0u') {
            if (!reportersMap[login]) {
              reportersMap[login] = {
                login: login,
                avatar_url: issue.user.avatar_url,
                html_url: issue.user.html_url,
                issueTitle: issue.title,
                issueCount: 1
              };
            } else {
              reportersMap[login].issueCount += 1;
            }
          }
        });
      }

      // Ensure fk0u is in contributors if found in reporters or elsewhere
      if (!contribData.some(c => c.login === 'fk0u')) {
        // Find fk0u in reporters or use fallback
        const fk0uInReporters = reportersMap['fk0u'];
        contribData.push({
          login: 'fk0u',
          avatar_url: fk0uInReporters?.avatar_url || 'https://avatars.githubusercontent.com/u/142812925?v=4',
          html_url: fk0uInReporters?.html_url || 'https://github.com/fk0u',
          contributions: 2
        });
        delete reportersMap['fk0u'];
      }

      // Ambil data dari database team_members (misalnya untuk menambahkan rfypych)
      const { data: dbTeamMembers, error: dbError } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true);

      if (!dbError && dbTeamMembers) {
        dbTeamMembers.forEach(member => {
          if (member.division?.toLowerCase().includes('security') || member.role?.toLowerCase().includes('reporter')) {
            if (!reportersMap[member.name]) {
              reportersMap[member.name] = {
                login: member.name,
                avatar_url: member.avatar_url || '',
                html_url: member.social_links?.github || `https://github.com/${member.name}`,
                issueTitle: member.bio || member.role,
                issueCount: 1
              };
            }
          } else {
            if (!contribData.some(c => c.login === member.name)) {
              contribData.push({
                login: member.name,
                avatar_url: member.avatar_url || '',
                html_url: member.social_links?.github || `https://github.com/${member.name}`,
                contributions: 1
              });
            }
            BIO_MAPPING[member.name] = {
              bio: member.bio || '',
              twitter: member.social_links?.twitter,
              website: member.social_links?.website
            };
          }
        });
      }

      // 3. Fetch Bio for contributors (individual profile calls needed but let's use mapping + fallback)
      const enhancedContributors: EnhancedContributor[] = contribData.map(c => {
        const mappedBio = BIO_MAPPING[c.login];
        return {
          ...c,
          totalAdditions: 0,
          totalDeletions: 0,
          bio: mappedBio?.bio || "Kontributor di OurCreativity.",
          socials: {
            twitter: mappedBio?.twitter,
            website: mappedBio?.website
          }
        };
      });

      const sortedContribs = enhancedContributors.filter(c => !/\[bot\]$/i.test(c.login)).sort((a, b) => {
        if (a.login === OWNER_LOGIN) return -1;
        if (b.login === OWNER_LOGIN) return 1;
        return b.contributions - a.contributions;
      });

      const sortedReporters = Object.values(reportersMap)
        .filter(r => r.login !== 'fk0u') // Double check exclusion
        .sort((a, b) => b.issueCount - a.issueCount);

      setContributors(sortedContribs);
      setReporters(sortedReporters);

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        contributors: sortedContribs,
        reporters: sortedReporters,
        timestamp: Date.now()
      }));

      console.log('✅ Data berhasil dimuat');

    } catch (err: any) {
      console.error("❌ Error:", err);
      // Bentuk cache = { contributors, reporters, timestamp } (lihat setItem di atas).
      let restored = false;
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed?.contributors) && parsed.contributors.length > 0) {
            setContributors(parsed.contributors);
            setReporters(Array.isArray(parsed.reporters) ? parsed.reporters : []);
            restored = true;
          }
        }
      } catch {
        // cache rusak: abaikan dan pakai data fallback
      }
      if (restored) {
        console.log('Menggunakan cache lama');
      } else {
        const fallbackEnhanced: EnhancedContributor[] = FALLBACK_CONTRIBUTORS.map(c => {
          const mappedBio = BIO_MAPPING[c.login];
          return {
            ...c,
            totalAdditions: 0,
            totalDeletions: 0,
            bio: mappedBio?.bio || "Kontributor OurCreativity.",
            socials: {
              twitter: mappedBio?.twitter,
              website: mappedBio?.website
            }
          };
        });
        setContributors(fallbackEnhanced);
      }
      setError('Terjadi kesalahan saat memuat data kontributor. Menampilkan data fallback atau cache.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <PageHeader
        label="(Tim) Orang di balik katalog"
        title={<>Dibuat bersama, <Em>terbuka</Em> untuk siapa saja.</>}
        lede="Situs ini dikerjakan sukarela oleh anggota komunitas. Kodenya terbuka di GitHub: setiap kontribusi, dari kode sampai laporan bug, tercatat di sini."
      />

      {error && !loading && (
        <div className={`${PAGE_X} pb-6`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border border-[#0E0E0F]/30 px-4 py-3 font-mono text-[11px]" role="status">
            <span>{error}</span>
            <button type="button" onClick={fetchData} className="oc-link border-b border-[#0E0E0F]">
              Coba lagi
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingMark label="Menyinkronkan data tim" />
      ) : (
        <>
          <section className={`${PAGE_X} pb-[clamp(36px,6vw,80px)]`}>
            <SectionRule label="(Kontributor kode)" aside={`${contributors.length} orang`} />
            <ul>
              {contributors.map((c, i) => (
                <Reveal as="li" key={c.login} delay={Math.min(i, 6) * 40} className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 border-b border-[#0E0E0F]/15 py-5 md:grid-cols-[3rem_4.5rem_minmax(0,1fr)_minmax(0,1.3fr)_auto] md:gap-x-8">
                  <span className="hidden font-mono text-[11px] text-[#8A8A8F] md:block">{String(i + 1).padStart(2, '0')}</span>
                  {c.avatar_url ? (
                    <img src={c.avatar_url} alt="" width={72} height={72} loading="lazy" className="h-14 w-14 object-cover grayscale transition-[filter] duration-500 hover:grayscale-0 md:h-[4.5rem] md:w-[4.5rem]" />
                  ) : (
                    <span className="grid h-14 w-14 place-content-center bg-[#0E0E0F] font-display text-xl font-bold text-[#EDEDEB] md:h-[4.5rem] md:w-[4.5rem]">{c.login.slice(0, 1).toUpperCase()}</span>
                  )}
                  <span className="min-w-0 md:col-auto">
                    <span className="block font-display text-[clamp(1.5rem,3vw,2.4rem)] font-bold leading-none tracking-[-0.04em]">{c.login}</span>
                    <span className="mt-1 block font-mono text-[11px] text-[#55555A]">
                      {c.login === OWNER_LOGIN ? 'Pendiri · ' : ''}
                      {c.contributions} kontribusi
                    </span>
                  </span>
                  <p className="col-span-2 text-[15px] leading-relaxed text-[#2B2B2E] md:col-span-1">{c.bio}</p>
                  <span className="col-span-2 flex flex-wrap gap-x-5 gap-y-1 md:col-span-1 md:justify-end">
                    <LinkButton href={c.html_url || `https://github.com/${c.login}`}>
                      GitHub <Arrow />
                    </LinkButton>
                    {c.socials?.website && (
                      <LinkButton href={c.socials.website}>
                        Situs <Arrow />
                      </LinkButton>
                    )}
                  </span>
                </Reveal>
              ))}
            </ul>
          </section>

          {reporters.length > 0 && (
            <section className={`${PAGE_X} pb-[clamp(36px,6vw,80px)]`}>
              <SectionRule label="(Pelapor masalah)" aside="Laporan yang menjaga situs tetap sehat" />
              <ul className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
                {reporters.map((r) => (
                  <li key={r.login} className="flex items-center gap-3 border-b border-[#0E0E0F]/15 py-3">
                    {r.avatar_url ? (
                      <img src={r.avatar_url} alt="" width={36} height={36} loading="lazy" className="h-9 w-9 object-cover grayscale" />
                    ) : (
                      <span className="grid h-9 w-9 place-content-center bg-[#0E0E0F] font-mono text-xs text-[#EDEDEB]">{r.login.slice(0, 1).toUpperCase()}</span>
                    )}
                    <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 truncate font-display font-semibold tracking-tight hover:underline">
                      {r.login}
                    </a>
                    <span className="font-mono text-[11px] text-[#55555A]">{r.issueCount} laporan</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className={`${PAGE_X} pb-[clamp(48px,8vw,120px)]`}>
            <div className="border-t-2 border-[#0E0E0F] pt-6">
              <h2 className="max-w-[18ch] text-balance font-display text-[clamp(2rem,5vw,4.6rem)] font-bold leading-[0.92] tracking-[-0.05em]">
                Mau ikut <Em>membangun</Em>?
              </h2>
              <p className="mt-4 max-w-[52ch] text-[#2B2B2E]">Setiap baris kode atau laporan bug membawa katalog ini selangkah lebih matang. Bukan pemrogram pun bisa ikut lewat edisi yang kamu suka.</p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                <LinkButton href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`} cursor="Buka">
                  Mulai berkontribusi di GitHub <Arrow />
                </LinkButton>
                <LinkButton to="/gabung">Gabung komunitas</LinkButton>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};
