import React, { useState, useEffect } from 'react';

// Penampil kode berpetak-file untuk karya bertipe kode (multi-file JSON atau teks biasa).
export const CodeViewer = ({ content }: { content: any }) => {
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const files = React.useMemo(() => {
    try {
      if (typeof content === 'string') {
        // Coba parse kalo string
        if (content.trim().startsWith('[')) {
          return JSON.parse(content);
        }
      }
      if (Array.isArray(content)) {
        return content;
      }
      return null;
    } catch (e) {
      return null;
    }
  }, [content]);

  // Atur file aktif awal pas file-filenya dimuat
  useEffect(() => {
    if (files && files.length > 0) {
      setActiveFileId(files[0].id);
    }
  }, [files]);

  const activeFile = files?.find((f: any) => f.id === activeFileId) || files?.[0];

  if (!files || !Array.isArray(files)) {
    // Logika fallback buat konten lama/simple
    const displayContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    return (
      <div className="flex-1 overflow-auto p-3 md:p-6 bg-[#0d1117]">
        <pre className="font-mono text-[10px] md:text-xs text-green-400 leading-relaxed whitespace-pre-wrap break-words">
          {displayContent}
        </pre>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Tab Bar - Scrollable on Mobile */}
      <div className="flex-shrink-0 bg-[#161b22] border-b border-white/10 flex overflow-x-auto no-scrollbar">
        {files.map((file: any) => (
          <button
            key={file.id}
            onClick={() => setActiveFileId(file.id)}
            className={`px-3 md:px-4 py-2 md:py-3 text-[10px] md:text-xs font-mono whitespace-nowrap border-b-2 transition-colors ${file.id === activeFileId
              ? 'border-blue-500 text-white bg-[#0d1117]'
              : 'border-transparent text-gray-500 hover:text-gray-300'
              } `}
          >
            <span className={`mr-1.5 ${file.name?.endsWith('.html') ? 'text-orange-400' :
              file.name?.endsWith('.css') ? 'text-blue-400' :
                file.name?.endsWith('.js') ? 'text-yellow-400' : 'text-gray-400'
              } `}>●</span>
            {file.name || 'file'}
          </button>
        ))}
      </div>

      {/* Konten Kode - Responsif */}
      <div className="flex-1 overflow-auto p-3 md:p-6 bg-[#0d1117]">
        <pre className="font-mono text-[10px] md:text-xs leading-relaxed">
          <code className={`${activeFile?.language === 'html' ? 'text-orange-300' :
            activeFile?.language === 'css' ? 'text-blue-300' :
              activeFile?.language === 'javascript' ? 'text-yellow-300' : 'text-green-300'
            } `}>
            {activeFile?.content || '// No content'}
          </code>
        </pre>
      </div>
    </div>
  );
};
