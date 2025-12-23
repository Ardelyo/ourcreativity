import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrutalistCard } from '../components/BrutalistCard';
import { ContributorModal } from '../components/ContributorModal';
import { FetchErrorState } from '../components/FetchErrorState';
import { Users, AlertCircle, Github } from 'lucide-react';

// --- Types ---
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
    bio: "Pencetus OurCreativity, pengembang utama, dan desainer. Berfokus pada visi jangka panjang platform.",
    website: "https://ardelyo.com"
  },
  'mrmambu': {
    bio: "Design Sorcerer & Frontend Extraordinaire. Crafting pixel-perfect experiences.",
  },
  'Kira262': {
    bio: "Core contributor focused on system architecture and performance.",
  }
};

// Cache untuk mengurangi API calls
const CACHE_KEY = 'ourcreativity_contributors_v3_cache';
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
    avatar_url: 'https://avatars.githubusercontent.com/u/87600000?v=4',
    html_url: 'https://github.com/Kira262',
    contributions: 3
  }
];

export const Tim = () => {
  const [contributors, setContributors] = useState<EnhancedContributor[]>([]);
  const [reporters, setReporters] = useState<ReporterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContributor, setSelectedContributor] = useState<EnhancedContributor | null>(null);

  const fetchData = async () => {
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

      // 1. Fetch Contributors
      const contribRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors`);
      if (!contribRes.ok) throw new Error(`GitHub API Error: ${contribRes.status}`);
      const contribData: Contributor[] = await contribRes.json();

      // 2. Fetch Issues to find reporters
      const issuesRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?state=all&per_page=100`);
      let reportersMap: Record<string, ReporterData> = {};

      if (issuesRes.ok) {
        const issuesData: GitHubIssue[] = await issuesRes.json();
        issuesData.forEach(issue => {
          const login = issue.user.login;
          // Exclude core contributors from reporters list for clarity
          if (!contribData.some(c => c.login === login)) {
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

      const sortedContribs = enhancedContributors.sort((a, b) => {
        if (a.login === OWNER_LOGIN) return -1;
        if (b.login === OWNER_LOGIN) return 1;
        return b.contributions - a.contributions;
      });

      const sortedReporters = Object.values(reportersMap).sort((a, b) => b.issueCount - a.issueCount);

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
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        setContributors(data);
        console.log('⚠️ Menggunakan cache lama');
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
    <div className="pt-36 pb-20 px-4 max-w-7xl mx-auto min-h-screen text-white font-sans relative">
      {/* Background Blobs (Shadow Glows) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-rose-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-24 relative z-10"
      >
        <div className="flex items-center gap-2 mb-6 font-mono text-sm text-rose-500">
          <span>[ KOLEKTIF_V2.0 ]</span>
          <div className="h-px flex-1 bg-rose-500/20" />
        </div>

        <h1 className="text-[12vw] md:text-[8vw] leading-[0.85] font-black uppercase tracking-tighter mb-8">
          KON<span className="text-white bg-rose-600 px-4 shadow-[10px_10px_0px_0px_rgba(225,29,72,0.3)]">TRIB</span>UTOR
        </h1>
      </motion.div>

      {/* Error Banner */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative z-10 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <p className="text-yellow-200/90 text-sm">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="text-yellow-400 hover:text-yellow-300 text-sm font-bold underline"
          >
            Coba Lagi
          </button>
        </motion.div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 relative z-10">
          <div className="w-16 h-16 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
          <p className="mt-6 font-black uppercase tracking-widest text-rose-500 antialiased">Sinkronisasi Data...</p>
        </div>
      ) : (
        <div className="space-y-40 relative z-10">
          {/* Core Team Section */}
          <section>
            <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="bg-rose-500 text-white p-3 shadow-brutalist-rose">
                  <Users size={32} />
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Arsitek Utama</h2>
              </div>
              <span className="font-mono text-rose-500/50 text-sm hidden md:block">TOTAL: {contributors.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {contributors.map(c => (
                <BrutalistCard
                  key={c.login}
                  login={c.login}
                  avatar_url={c.avatar_url}
                  html_url={c.html_url}
                  contributions={c.contributions}
                  bio={c.bio}
                  isOwner={c.login === OWNER_LOGIN}
                  socials={c.socials}
                />
              ))}
            </div>
          </section>

          {/* Issue Reporters Section */}
          {reporters.length > 0 && (
            <section>
              <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-500 text-white p-3 shadow-brutalist-purple">
                    <AlertCircle size={32} />
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Pemburu Bug</h2>
                    <p className="font-mono text-xs text-purple-400 mt-1 uppercase tracking-widest">Pahlawan Komunitas & Pelapor Masalah</p>
                  </div>
                </div>
                <span className="font-mono text-purple-500/50 text-sm hidden md:block">TOTAL: {reporters.length}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {reporters.map(r => (
                  <BrutalistCard
                    key={r.login}
                    login={r.login}
                    avatar_url={r.avatar_url}
                    html_url={r.html_url}
                    isReporter={true}
                    issueCount={r.issueCount}
                    issueTitle={r.issueTitle}
                    bio={`Kontribusi signifikan melalui laporan issue yang membangun stabilitas platform.`}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Call to Action */}
          <motion.div
            whileHover={{ y: -5 }}
            className="border-4 border-rose-500 bg-rose-500/5 backdrop-blur-sm p-12 text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl -z-10 group-hover:bg-rose-500/20 transition-all" />
            <h3 className="text-4xl md:text-6xl font-black uppercase mb-6 tracking-tighter">Bentuk Masa Depan Kita</h3>
            <p className="font-mono text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              Setiap baris kode atau laporan bug membawa kita satu langkah lebih dekat ke kesempurnaan. Bergabunglah dalam kolektif kreatif ini.
            </p>
            <a
              href={`https://github.com/${REPO_OWNER}/${REPO_NAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 bg-rose-600 text-white px-10 py-5 font-black uppercase text-xl border-4 border-black shadow-brutalist-rose hover:bg-rose-500 transition-all transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <Github size={24} /> Mulai Berkontribusi
            </a>
          </motion.div>
        </div>
      )}
    </div>
  );
};
