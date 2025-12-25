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

interface TextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
}

export const TextEditor: React.FC<TextEditorProps> = ({
    content,
    onChange,
    placeholder = "Mulai menulis ceritamu...",
    className
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            Underline,
            Link.configure({
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
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[60vh] leading-relaxed',
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

    return (
        <div className={`flex flex-col h-full bg-[#0a0a0a] ${className}`}>
            {/* ===== FIXED TOP TOOLBAR (IDE Style) ===== */}
            <div className="flex-shrink-0 bg-[#111] border-b border-white/10 px-4 py-2">
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Formatting Tools */}
                    <div className="flex items-center gap-1 flex-wrap">
                        {/* Undo/Redo */}
                        <ToolbarButton
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            icon={<Undo size={16} />}
                            tooltip="Urungkan"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            icon={<Redo size={16} />}
                            tooltip="Ulangi"
                        />

                        <Divider />

                        {/* Text Formatting */}
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive('bold')}
                            icon={<Bold size={16} />}
                            tooltip="Tebal (Ctrl+B)"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive('italic')}
                            icon={<Italic size={16} />}
                            tooltip="Miring (Ctrl+I)"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            isActive={editor.isActive('underline')}
                            icon={<UnderlineIcon size={16} />}
                            tooltip="Garis Bawah (Ctrl+U)"
                        />

                        <Divider />

                        {/* Headings */}
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            isActive={editor.isActive('heading', { level: 1 })}
                            icon={<Heading1 size={16} />}
                            tooltip="Judul Besar"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            isActive={editor.isActive('heading', { level: 2 })}
                            icon={<Heading2 size={16} />}
                            tooltip="Judul Sedang"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            isActive={editor.isActive('heading', { level: 3 })}
                            icon={<Heading3 size={16} />}
                            tooltip="Judul Kecil"
                        />

                        <Divider />

                        {/* Lists */}
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={editor.isActive('bulletList')}
                            icon={<List size={16} />}
                            tooltip="Daftar Bullet"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            isActive={editor.isActive('orderedList')}
                            icon={<ListOrdered size={16} />}
                            tooltip="Daftar Nomor"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleTaskList().run()}
                            isActive={editor.isActive('taskList')}
                            icon={<CheckSquare size={16} />}
                            tooltip="Daftar Tugas"
                        />

                        <Divider />

                        {/* Block Elements */}
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            isActive={editor.isActive('blockquote')}
                            icon={<Quote size={16} />}
                            tooltip="Kutipan"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            isActive={editor.isActive('codeBlock')}
                            icon={<Code size={16} />}
                            tooltip="Blok Kode"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            icon={<Minus size={16} />}
                            tooltip="Garis Pemisah"
                        />

                        <Divider />

                        {/* Insert */}
                        <ToolbarButton
                            onClick={setLink}
                            isActive={editor.isActive('link')}
                            icon={<LinkIcon size={16} />}
                            tooltip="Sisipkan Tautan"
                        />
                        <ToolbarButton
                            onClick={addImage}
                            icon={<ImageIcon size={16} />}
                            tooltip="Sisipkan Gambar"
                        />
                    </div>

                    {/* Right: Stats */}
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

            {/* ===== EDITOR CANVAS ===== */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-8 py-10">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    );
};

// ===== TOOLBAR COMPONENTS =====

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
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${disabled
                ? 'text-gray-600 cursor-not-allowed'
                : isActive
                    ? 'text-white bg-rose-500/20 border border-rose-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-white/10 border border-transparent'
            }`}
    >
        {icon}
    </button>
);
