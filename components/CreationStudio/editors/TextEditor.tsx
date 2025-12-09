import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Code } from 'lucide-react';

interface TextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
}

export const TextEditor: React.FC<TextEditorProps> = ({
    content,
    onChange,
    placeholder = "Write your story...",
    className
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px]',
            },
        },
    });

    // Update content if changed externally (e.g. from file upload)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div className={`flex flex-col border border-white/10 rounded-xl overflow-hidden bg-[#0f0f0f] ${className}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/5 bg-[#1a1a1a]">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={<Bold size={16} />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={<Italic size={16} />}
                />
                <div className="w-px h-6 bg-white/10 mx-1" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    icon={<Heading1 size={16} />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    icon={<Heading2 size={16} />}
                />
                <div className="w-px h-6 bg-white/10 mx-1" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    icon={<List size={16} />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    icon={<ListOrdered size={16} />}
                />
                <div className="w-px h-6 bg-white/10 mx-1" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    icon={<Quote size={16} />}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                    icon={<Code size={16} />}
                />
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <EditorContent editor={editor} />
            </div>

            {/* Status Bar */}
            <div className="px-4 py-2 text-xs text-gray-500 border-t border-white/5 flex justify-end">
                {editor.storage.characterCount?.words?.() || 0} words
            </div>
        </div>
    );
};

const ToolbarButton = ({ onClick, isActive, icon }: { onClick: () => void, isActive: boolean, icon: React.ReactNode }) => (
    <button
        onClick={onClick}
        className={`p-2 rounded hover:bg-white/10 transition-colors ${isActive ? 'bg-white/20 text-white' : 'text-gray-400'
            }`}
    >
        {icon}
    </button>
);
