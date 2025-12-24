export type FileType = 'javascript' | 'html' | 'css' | 'json' | 'svg';

export interface CodeFile {
    id: string;
    name: string;
    language: FileType;
    content: string;
    isMain?: boolean; // For index.html or sketch.js
}

export type ExecutionMode = 'p5' | 'web' | 'svg';

export interface ConsoleMessage {
    type: 'log' | 'error' | 'warn' | 'info';
    content: any[];
    timestamp: number;
}
