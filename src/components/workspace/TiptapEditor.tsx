"use client";

import { EditorContent } from '@tiptap/react';
import { Toolbar } from './Toolbar'; // Komponen baru untuk tombol Bold, Italic, dll.
import type { Editor } from '@tiptap/react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface TiptapEditorProps {
    editor: Editor;
    isTyping?: boolean;
    progress?: number;
}


export const TiptapEditor = ({ editor, isTyping, progress }: TiptapEditorProps) => {
    // Sync editor content when prop `content` changes
    const editorContainerRef = useRef<HTMLDivElement>(null)
    function scrollToBottom(ref: React.RefObject<HTMLElement | null>) {
        setTimeout(() => {
            if (ref.current) {
                ref.current.scrollTo({
                    top: ref.current.scrollHeight,
                    behavior: 'smooth',
                })
            }
        }, 30)
    }

    useEffect(() => {
        if (editorContainerRef.current && isTyping) {
            scrollToBottom(editorContainerRef)
        }
    }, [editor.$doc])

    return (
        <div className="border rounded-md w-full overflow-hidden relative " >
            <Toolbar editor={editor as Editor}loading={isTyping} progress={progress}/>
            <EditorContent editor={editor} ref={editorContainerRef} className={clsx('h-full max-h-[calc(60vh)] overflow-auto hide-scrollbar')} />
            {isTyping && <div className="absolute bottom-0 w-full h-1 bg-blue-600/20 rounded">
                <div
                    className="h-full bg-blue-500 transition-all duration-100"
                    style={{ width: `${progress}%` }}
                />
            </div>}
        </div>
    );
};