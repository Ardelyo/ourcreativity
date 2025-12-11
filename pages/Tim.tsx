import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContributorCard } from '../components/ContributorCard';
import { ContributorModal } from '../components/ContributorModal';
import { Users } from 'lucide-react';

// --- Types ---
interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface ContributorStats {
  author: {
    login: string;
  };
  total: number;
  weeks: { a: number; d: number; c: number }[];
}

interface CreativePersona {
  title: string;
  description: string;
  adjective: string;
  element: string;
}

interface EnhancedContributor extends Contributor {
  totalAdditions: number;
  totalDeletions: number;
  persona: CreativePersona;
}

const OWNER_LOGIN = 'Ardelyo';
const REPO_OWNER = 'Ardelyo';
const REPO_NAME = 'OurCreativity';

// Cache untuk mengurangi API calls
const CACHE_KEY = 'ourcreativities_contributors_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

// Fallback data dengan kontributor asli dari repo OurCreativity
// Data ini digunakan ketika GitHub API terkena rate limit (403)
const FALLBACK_CONTRIBUTORS: Contributor[] = [
  {
    login: 'Ardelyo',
    avatar_url: 'https://avatars.githubusercontent.com/u/117548799?v=4',
    html_url: 'https://github.com/Ardelyo',
    contributions: 13
  },
  {
    login: 'mrmambu',
    avatar_url: 'https://avatars.githubusercontent.com/u/137814118?v=4',
    html_url: 'https://github.com/mrmambu',
    contributions: 6
  },
  {
    login: 'Kira262',
    avatar_url: 'https://avatars.githubusercontent.com/u/158989780?v=4',
    html_url: 'https://github.com/Kira262',
    contributions: 5
  },
  {
    login: 'devanjalichandra',
    avatar_url: 'https://avatars.githubusercontent.com/u/157803048?v=4',
    html_url: 'https://github.com/devanjalichandra',
    contributions: 4
  },
  {
    login: 'ZenSwordXJaworski',
    avatar_url: 'https://avatars.githubusercontent.com/u/203177437?v=4',
    html_url: 'https://github.com/ZenSwordXJaworski',
    contributions: 3
  }
];

// --- Persona Generator ---
const generatePersona = (login: string, isOwner: boolean): CreativePersona => {
  if (isOwner) {
    return {
      title: "Pendiri Visioner",
      description: "Arsitek mimpi yang merajut benang pertama dari tapestri digital ini. Cahaya penuntun bagi kolektif.",
      adjective: "Bercahaya",
      element: "Aether"
    };
  }

  const charSum = login.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const titles = [
    "Alkemis Piksel", "Penenun Kode", "Pembentuk Logika", "Tukang Kebun Digital",
    "Penjinak Entropi", "Penyair Sintaks", "Pencari Algoritma", "Pemimpi Antarmuka",
    "Arsitek Sistem", "Ahli Alur"
  ];

  const descriptions = [
    "Mengubah kafein menjadi realitas terstruktur.",
    "Menghembuskan kehidupan ke piksel statis.",
    "Menemukan keindahan dalam kompleksitas logika.",
    "Memahat kekosongan menjadi pengalaman bermakna.",
    "Menari dengan error hingga menjadi fitur.",
    "Merajut benang-benang tak kasat mata dari koneksi.",
    "Menerjemahkan niat manusia menjadi eksekusi mesin."
  ];

  const adjectives = ["Berani", "Abstrak", "Presisi", "Cair", "Neon", "Tenang", "Kacau"];
  const elements = ["Api", "Air", "Angin", "Bumi", "Digital", "Hampa", "Cahaya"];

  return {
    title: titles[charSum % titles.length],
    description: descriptions[charSum % descriptions.length],
    adjective: adjectives[charSum % adjectives.length],
    element: elements[charSum % elements.length]
  };
};

export const Tim = () => {
  const [contributors, setContributors] = useState<EnhancedContributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContributor, setSelectedContributor] = useState<EnhancedContributor | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Cek cache terlebih dahulu
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            console.log('📦 Menggunakan data dari cache');
            setContributors(data);
            setLoading(false);
            return;
          }
        }

        console.log('🌐 Fetching data dari GitHub API...');

        // 1. Fetch basic contributors
        const contribRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors`);

        if (!contribRes.ok) {
          throw new Error(`GitHub API Error: ${contribRes.status}`);
        }

        const contribData: Contributor[] = await contribRes.json();

        // 2. Fetch stats (opsional)
        let statsData: ContributorStats[] = [];
        try {
          const statsRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/stats/contributors`);
          if (statsRes.ok) {
            const rawStats = await statsRes.json();
            if (Array.isArray(rawStats)) statsData = rawStats;
          }
        } catch {
          console.warn('Stats API gagal');
        }

        // 3. Enhance dengan Personas
        const enhancedContributors: EnhancedContributor[] = contribData.map((c) => {
          const stat = statsData.find((s) => s.author?.login?.toLowerCase() === c.login.toLowerCase());
          const totalAdditions = stat?.weeks.reduce((sum, w) => sum + w.a, 0) || 0;
          const totalDeletions = stat?.weeks.reduce((sum, w) => sum + w.d, 0) || 0;
          const isOwner = c.login.toLowerCase() === OWNER_LOGIN.toLowerCase();

          return {
            ...c,
            totalAdditions,
            totalDeletions,
            persona: generatePersona(c.login, isOwner)
          };
        });

        // Sort: Owner first
        const sorted = enhancedContributors.sort((a, b) => {
          if (a.login.toLowerCase() === OWNER_LOGIN.toLowerCase()) return -1;
          if (b.login.toLowerCase() === OWNER_LOGIN.toLowerCase()) return 1;
          return b.contributions - a.contributions;
        });

        setContributors(sorted);

        // Simpan ke cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: sorted,
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
          console.log('🔄 Menggunakan fallback');
          const fallbackEnhanced: EnhancedContributor[] = FALLBACK_CONTRIBUTORS.map(c => {
            const isOwner = c.login.toLowerCase() === OWNER_LOGIN.toLowerCase();
            return {
              ...c,
              totalAdditions: 0,
              totalDeletions: 0,
              persona: generatePersona(c.login, isOwner)
            };
          });
          setContributors(fallbackEnhanced);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const contributorCards = useMemo(() => {
    return contributors.map((contributor) => {
      const isOwner = contributor.login.toLowerCase() === OWNER_LOGIN.toLowerCase();
      return (
        <ContributorCard
          key={contributor.login}
          login={contributor.login}
          avatar_url={contributor.avatar_url}
          contributions={contributor.contributions}
          personaTitle={contributor.persona.title}
          isOwner={isOwner}
          onClick={() => setSelectedContributor(contributor)}
        />
      )
    });
  }, [contributors]);

  return (
    <div className="pt-36 pb-20 px-4 max-w-7xl mx-auto min-h-screen relative z-10">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-rose-500/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-20 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500 blur-xl opacity-20 animate-pulse" />
            <div className="relative bg-white/5 border border-white/10 px-6 py-2 rounded-full text-white/80 font-serif italic text-sm backdrop-blur-md">
              Kolektif
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 tracking-tight">
          Kontributor<span className="text-rose-500">.</span>
        </h1>
        <p className="text-white/40 max-w-xl mx-auto text-lg font-light leading-relaxed">
          Konstelasi pemikiran yang merajut masa depan digital.
          Setiap commit adalah benang, setiap fitur adalah kenangan.
        </p>
      </motion.div>

      {/* Loading */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 gap-6"
        >
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-t-2 border-r-2 border-rose-500 rounded-full animate-spin" />
            <div className="absolute inset-2 border-t-2 border-l-2 border-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
          </div>
          <p className="font-serif italic text-white/30 tracking-widest text-sm">Memanggil roh-roh kreatif...</p>
        </motion.div>
      )}

      {/* Grid */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {contributorCards}
        </motion.div>
      )}

      {/* Empty */}
      {!loading && contributors.length === 0 && (
        <div className="text-center text-gray-500 py-20 font-mono border border-dashed border-white/10">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p className="uppercase tracking-widest text-sm">Belum ada kontributor.</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedContributor && (
          <ContributorModal
            isOpen={!!selectedContributor}
            onClose={() => setSelectedContributor(null)}
            login={selectedContributor.login}
            avatar_url={selectedContributor.avatar_url}
            html_url={selectedContributor.html_url}
            contributions={selectedContributor.contributions}
            totalAdditions={selectedContributor.totalAdditions}
            totalDeletions={selectedContributor.totalDeletions}
            persona={selectedContributor.persona}
            isOwner={selectedContributor.login.toLowerCase() === OWNER_LOGIN.toLowerCase()}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
