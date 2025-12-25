import React, { useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';

interface CodeEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language: string;
    theme?: 'vs-dark' | 'light';
    readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    value,
    onChange,
    language,
    theme = 'vs-dark',
    readOnly = false
}) => {
    const editorRef = useRef<any>(null);

    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor;

        // Configure p5.js autocompletion if language is Javascript
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES6,
            allowNonTsExtensions: true,
        });

        if (language === 'javascript') {
            // Include p5.js global definitions mostly for Intellisense
            // This is a simplified version; normally you'd fetch the actual .d.ts
            const libSource = `
                declare function setup(): void;
                declare function draw(): void;
                declare function createCanvas(w: number, h: number): void;
                declare function background(color: any): void;
                declare function fill(color: any): void;
                declare function stroke(color: any): void;
                declare function rect(x: number, y: number, w: number, h: number): void;
                declare function circle(x: number, y: number, d: number): void;
                declare var width: number;
                declare var height: number;
                declare var mouseX: number;
                declare var mouseY: number;
            `;
            monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, 'p5.d.ts');
        }
    };

    return (
        <div className="w-full h-full overflow-hidden rounded-md">
            <Editor
                height="100%"
                language={language}
                value={value}
                theme={theme}
                onChange={onChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, Menlo, monospace',
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    readOnly: readOnly,
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    renderLineHighlight: 'all',
                }}
            />
        </div>
    );
};
