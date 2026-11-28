/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    /** "1" = pakai data demo lokal dari /demo/works.json (hanya untuk pengembangan). */
    readonly VITE_DEMO_WORKS?: string;
    // Add other env variables as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
