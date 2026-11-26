// Konfigurasi ESLint (flat config). Tujuan awal: CI gagal hanya untuk error nyata
// (bug), sedangkan gaya dan utang teknis lama (any, console) tampil sebagai warning
// supaya bisa dibersihkan bertahap tanpa memblokir PR.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
    { ignores: ['dist/**', 'node_modules/**', 'supabase/**', 'scripts/**', 'tools/**', '*.config.js', '*.config.ts'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: { globals: { ...globals.browser } },
        plugins: { 'react-hooks': reactHooks },
        rules: {
            // Bug nyata: hooks dipakai salah.
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            // Utang teknis lama: warning dulu, jadikan error setelah dibersihkan.
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            'no-console': ['warn', { allow: ['warn', 'error'] }],
        },
    },
);
