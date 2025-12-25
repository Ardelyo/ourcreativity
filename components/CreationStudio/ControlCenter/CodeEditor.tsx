import React, { useEffect, useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';

interface CodeEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language: string;
    theme?: 'vs-dark' | 'light';
    readOnly?: boolean;
    fontSize?: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    value,
    onChange,
    language,
    theme = 'vs-dark',
    readOnly = false,
    fontSize = 14
}) => {
    const editorRef = useRef<any>(null);

    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor;

        // setup autocompletion p5.js kalo bahasanya javascript
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES6,
            allowNonTsExtensions: true,
        });

        if (language === 'javascript') {
            // masukin definisi global p5.js buat intellisense
            // ini versi simpel aja; aslinya mending ambil file .d.ts beneran
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
                    fontSize: fontSize,
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
