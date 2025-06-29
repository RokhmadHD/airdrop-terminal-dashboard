// src/components/workspace/Toolbar.tsx
"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Code,
  Quote,
  Loader2,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle"; // Gunakan Toggle untuk state aktif/non-aktif

interface ToolbarProps {
  editor: Editor | null;
  progress?: number;
  loading?: boolean;
}

export const Toolbar = ({ editor, loading, progress }: ToolbarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-input p-2 flex items-center flex-wrap gap-1">
      {/* Tombol Undo/Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        aria-label="Undo"
      >
        <Undo className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        aria-label="Redo"
      >
        <Redo className="h-4 w-4" />
      </button>

      <div className="h-6 w-px bg-border mx-2" />

      {/* Tombol Bold, Italic, Strikethrough */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Toggle strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <div className="h-6 w-px bg-border mx-2" />

      {/* Tombol Heading */}
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        aria-label="Toggle heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 3 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        aria-label="Toggle heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>

      <div className="h-6 w-px bg-border mx-2" />

      {/* Tombol List */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Toggle bullet list"
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Toggle ordered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <div className="h-6 w-px bg-border mx-2" />

      {/* Tombol Blockquote & Code */}
      <Toggle
        size="sm"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        aria-label="Toggle blockquote"
      >
        <Quote className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("codeBlock")}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        aria-label="Toggle code block"
      >
        <Code className="h-4 w-4" />
      </Toggle>
      <div className="ml-auto">
        {loading && (<div className='flex items-center gap-2 text-muted-foreground  w-full justify-center'>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{progress}%</span>
        </div>)}
      </div>
    </div>
  );
};