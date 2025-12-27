import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Typography from '@tiptap/extension-typography';
import CharacterCount from '@tiptap/extension-character-count';
import {
    Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Heading3,
    Code, Underline as UnderlineIcon, Link as LinkIcon, Minus,
    Image as ImageIcon, CheckSquare, Clock, AlignLeft, Redo, Undo
} from 'lucide-react';

// Custom styles for lists because Tiptap's prose sometimes hides them on mobile
const LIST_STYLES = `
  .prose ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin-bottom: 1rem !important; }
  .prose ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin-bottom: 1rem !important; }
  .prose li { margin-bottom: 0.5rem !important; }
`;

interface TextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
    isMobile?: boolean; // prop baru
    onFocus?: () => void; // prop baru
    onBlur?: () => void; // prop baru
}

export const TextEditor: React.FC<TextEditorProps> = ({
    content,
    onChange,
    placeholder = "Mulai menulis ceritamu...",
    className,
    isMobile = false,
    onFocus,
    onBlur
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                // Matikan fitur yang kita tambahin manual di bawah biar ga duplicate
                codeBlock: false,
                blockquote: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
            Underline,
            Link.extend({
                // Ini teknik buat nge-handle duplicate kalo StarterKit atau extension lain bawa Link
                priority: 100,
            }).configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-rose-400 underline decoration-rose-500/30 underline-offset-4 hover:text-rose-300 transition-colors cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-2xl border border-white/10 my-6 max-w-full h-auto shadow-xl',
                },
            }),
            TaskList.configure({
                HTMLAttributes: {
                    class: 'not-prose pl-2',
                },
            }),
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {
                    class: 'flex items-start gap-3 my-2',
                },
            }),
            Typography,
            CharacterCount,
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onFocus: () => onFocus?.(),
        onBlur: () => onBlur?.(),
        editorProps: {
            attributes: {
                // AGGRESSIVE FIX: usage of break-words and overflow-hidden/auto
                class: `prose prose-invert ${isMobile ? 'prose-sm' : 'prose-base md:prose-lg'} max-w-none w-full focus:outline-none leading-relaxed break-words break-all text-left ${isMobile ? 'min-h-[50vh] px-0' : 'min-h-[60vh]'}`,
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, { emitUpdate: false });
        }
    }, [content, editor]);

    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href;
        const url = window.prompt('Masukkan URL:', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        const url = window.prompt('Masukkan URL gambar:');
        if (url) {
            editor?.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    if (!editor) return null;

    const wordCount = editor.storage.characterCount?.words() || 0;
    const charCount = editor.storage.characterCount?.characters() || 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // item toolbar yang umum (dipisah biar bisa dipake ulang)
    const ToolbarItems = () => (
        <>
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} icon={<Undo size={isMobile ? 18 : 16} strokeWidth={1.5} />} />
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} icon={<Redo size={isMobile ? 18 : 16} strokeWidth={1.5} />} />
            <Divider />
            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={<Bold size={isMobile ? 18 : 16} strokeWidth={1.5} />} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={<Italic size={isMobile ? 18 : 16} strokeWidth={1.5} />} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={<UnderlineIcon size={isMobile ? 18 : 16} strokeWidth={1.5} />} />
            <Divider />
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={<Heading1 size={isMobile ? 18 : 16} strokeWidth={1.5} />} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={<Heading2 size={isMobile ? 18 : 16} strokeWidth={1.5} />} />
            <Divider />
            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={<List size={isMobile ? 18 : 16} strokeWidth={1.5} />} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={<ListOrdered size={isMobile ? 18 : 16} strokeWidth={1.5} />} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} icon={<CheckSquare size={isMobile ? 18 : 16} strokeWidth={1.5} />} />
            <Divider />
            <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={<Quote size={isMobile ? 18 : 16} strokeWidth={1.5} />} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={<Code size={isMobile ? 18 : 16} strokeWidth={1.5} />} />
            <Divider />
            <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} icon={<LinkIcon size={isMobile ? 18 : 16} strokeWidth={1.5} />} />
            <ToolbarButton onClick={addImage} icon={<ImageIcon size={isMobile ? 18 : 16} strokeWidth={1.5} />} />
        </>
    );

    return (
        <div className={`flex flex-col h-full bg-[#0a0a0a] ${className}`}>
            <style>{LIST_STYLES}</style>

            {/* toolbar buat ngetik */}
            {isMobile ? (
                // toolbar mobile yang bisa di-scroll
                <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 px-2 py-2 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1 min-w-max">
                        <ToolbarItems />
                    </div>
                </div>
            ) : (
                // toolbar desktop yang nempel di atas
                <div className="flex-shrink-0 bg-[#111] border-b border-white/10 px-4 py-2">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1 flex-wrap">
                            <ToolbarItems />
                        </div>
                        {/* bagian kanan: statistik */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 font-mono flex-shrink-0">
                            <span className="tabular-nums">{wordCount} kata</span>
                            <span className="tabular-nums">{charCount} huruf</span>
                            <span className="flex items-center gap-1 tabular-nums">
                                <Clock size={12} />
                                ~{readingTime} mnt baca
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== kanvas editornya ===== */}
            <div className={`flex-1 overflow-y-auto overflow-x-hidden ${isMobile ? 'pb-safe' : ''}`}>
                <div className={`w-full mx-auto ${isMobile ? 'px-3 py-4' : 'px-8 py-10'}`}>
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
};

// ===== komponen-komponen toolbar =====

const Divider = () => (
    <div className="w-px h-5 bg-white/10 mx-1.5" />
);

const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    icon,
    tooltip
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    icon: React.ReactNode;
    tooltip?: string;
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={tooltip}
        className={`flex items-center justify-center rounded-lg transition-all 
            ${disabled ? 'text-gray-600 cursor-not-allowed' : isActive ? 'text-white bg-white/20' : 'text-gray-400 hover:text-white hover:bg-white/10'}
            ${/* ukuran responsifnya */ ''}
            w-9 h-9 md:w-8 md:h-8
        `}
    >
        {icon}
    </button>
);
