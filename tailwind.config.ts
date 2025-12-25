import type { Config } from 'tailwindcss';

export default {
    content: [
        "./index.html",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#050505',
                surface: '#0f0f0f',
                surfaceHighlight: '#1a1a1a',
                primary: '#ffffff',
                accentRed: '#e11d48',
                accentPurple: '#a855f7',
                // Warna gaya brutalist
                brutalistYellow: '#FACC15',
                brutalistPink: '#F472B6',
                brutalistCyan: '#22D3EE',
                brutalistWhite: '#F8FAFC',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'brutalist-sm': '2px 2px 0px 0px #000',
                'brutalist': '4px 4px 0px 0px #000',
                'brutalist-lg': '8px 8px 0px 0px #000',
                'brutalist-white': '4px 4px 0px 0px #fff',
                'brutalist-rose': '4px 4px 0px 0px #e11d48',
                'brutalist-purple': '4px 4px 0px 0px #a855f7',
                'brutalist-rose-lg': '8px 8px 0px 0px #e11d48',
                'brutalist-purple-lg': '8px 8px 0px 0px #a855f7',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #f43f5e 0deg, #8b5cf6 180deg, #10b981 360deg)',
                'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E\")",
            },
            animation: {
                'spin-slow': 'spin 8s linear infinite',
            },
        },
    },
    plugins: [],
} satisfies Config;
