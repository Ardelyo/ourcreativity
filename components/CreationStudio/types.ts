
export type Medium = 'visual' | 'narasi' | 'kode' | 'sinema';
export type WorkType = 'image' | 'video' | 'text' | 'code' | 'meme' | 'slide';
export type DivisionId = 'graphics' | 'video' | 'writing' | 'coding' | 'meme';

export interface SlideContent {
    id: string;
    type: 'image' | 'text' | 'video';
    content: string;
    file?: File; // For client-side compression support
    metadata?: {
        language?: string;
        embedUrl?: string;
        caption?: string;
    };
    order: number;
}

export interface CreationData {
    id: number; // using timestamp for ID in frontend
    title: string;
    description: string;
    author: string;
    division: DivisionId;
    type: WorkType;
    content: string;
    image?: string;
    image_url?: string; // mapping for DB
    tags: string[];
    role: string;

    // New API fields based on schema
    slides?: SlideContent[];
    code_language?: string;
    embed_url?: string;
    document_source?: string;
    _pendingFile?: File; // Internal use for uploads
}

export interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language: string;
    onLanguageChange: (lang: string) => void;
    onRun?: () => void;
    isExecuting?: boolean;
}
