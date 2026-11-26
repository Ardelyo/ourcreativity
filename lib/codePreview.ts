// Membangun dokumen HTML untuk pratinjau karya bertipe kode (string lama, atau JSON multi-file dari Studio).
// Dipakai halaman Karya dan Profil; dipisah dari komponen supaya bisa diuji tanpa browser.
export const generateCodePreview = (content: any, language: string = 'html'): string => {
  if (!content) return '';

  const baseStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
  font-family: system-ui, sans-serif;
  background: #0a0a0a;
  color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
    canvas { display: block; margin: auto; }
`;

  // Helper to escape </script> to prevent breaking out of the container script tag
  const escapeScript = (str: any) => {
    if (typeof str !== 'string') return '';
    return str.replace(/<\/script>/gi, '<\\/script>');
  };

  // Otomatis deteksi kalo kontennya JSON multi-file
  // Bisa jadi string JSON atau objek yang udah di-parse sama Supabase/client
  const isJsonArray = (typeof content === 'string' && content.trim().startsWith('[')) || Array.isArray(content);

  if (language === 'json_multifile' || isJsonArray) {
    try {
      const files = typeof content === 'string' ? JSON.parse(content) : content;
      if (!Array.isArray(files) || files.length === 0) throw new Error('Not a valid files array');

      // Cari file berdasarkan tipe (pake fallback kals filenya cuma satu tapi isMain-nya lupa di-set)
      const htmlFile = files.find((f: any) => f.name?.endsWith('.html'));
      const cssFile = files.find((f: any) => f.name?.endsWith('.css'));
      const mainJsFile = files.find((f: any) => f.isMain && f.name?.endsWith('.js')) ||
        files.find((f: any) => f.name?.endsWith('.js'));
      const otherJsFile = files.find((f: any) => f.name?.endsWith('.js') && f.id !== mainJsFile?.id);

      // SKENARIO A: Ada file HTML - pake sebagai basis
      if (htmlFile?.content) {
        let html = htmlFile.content;
        if (cssFile?.content) {
          html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
        }
        if (mainJsFile?.content || otherJsFile?.content) {
          const scriptsContent = (mainJsFile?.content || '') + '\n' + (otherJsFile?.content || '');
          html = html.replace('</body>', `<script>${escapeScript(scriptsContent)}</script></body>`);
        }
        return html;
      }

      // SKENARIO B: Gak ada HTML, tapi ada file JS (kayaknya p5.js atau vanilla JS)
      if (mainJsFile?.content) {
        const jsCode = mainJsFile.content;
        const isP5 = jsCode.includes('createCanvas') || jsCode.includes('setup()') || jsCode.includes('draw()');

        if (isP5) {
          return `<!DOCTYPE html><html><head><style>${baseStyles}</style>
  <script src="https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js"></script>
  ${cssFile?.content ? `<style>${cssFile.content}</style>` : ''}
</head><body><script>${escapeScript(jsCode)}</script></body></html>`;
        } else {
          return `<!DOCTYPE html><html><head><style>${baseStyles}</style>
  ${cssFile?.content ? `<style>${cssFile.content}</style>` : ''}
</head><body><div id="app"></div><script>try{${escapeScript(jsCode)}}catch(e){document.body.innerHTML = '<pre style="color:red">' + e.message + '</pre>'}</script></body></html>`;
        }
      }

      // SKENARIO C: Cuma ada CSS atau file lain
      if (cssFile?.content) {
        return `<!DOCTYPE html><html><head><style>${baseStyles}\n${cssFile.content}</style></head><body></body></html>`;
      }

      return `<!DOCTYPE html><html><body style="background:#0a0a0a;color:#ff6b6b;padding:20px;font-family:monospace;">⚠️ Tidak dapat merender: File utama tidak ditemukan</body></html>`;

    } catch (e) {
      console.error('Error generating preview from JSON:', e);
    }
  }

  // Fallback buat format string yang lama (legacy)
  const code = typeof content === 'string' ? content : '';

  switch (language) {
    case 'p5js':
    case 'p5':
      return `<!DOCTYPE html><html><head><style>${baseStyles}</style>
  <script src="https://cdn.jsdelivr.net/npm/p5@1.9.4/lib/p5.min.js"></script>
</head><body><script>${escapeScript(code)}</script></body></html>`;
    case 'html':
      return code; // Harusnya udah valid HTML
    case 'javascript':
    case 'js':
      return `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body><div id="app"></div><script>try{${escapeScript(code)}}catch(e){document.body.innerHTML = '<pre style="color:red">' + e.message + '</pre>'}</script></body></html>`;
    default:
      return `<!DOCTYPE html><html><head><style>${baseStyles}</style></head><body>${code}</body></html>`;
  }
};
