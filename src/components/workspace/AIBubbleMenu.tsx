// src/components/workspace/AIBubbleMenu.tsx
"use client";

import { BubbleMenu, Editor } from "@tiptap/react";
import { Button } from "../ui/button";
import {Languages, Rows, Pilcrow } from "lucide-react";

interface AIBubbleMenuProps {
  editor: Editor;
  onAIAction: (action: AIActions, text: string) => void;
}

// Definisikan tipe untuk aksi-aksi AI kita
export type AIActions = 'fix' | 'shorter' | 'longer' | 'simplify' | 'create';

export const AIBubbleMenu = ({ editor, onAIAction }: AIBubbleMenuProps) => {
  const getSelectedText = () => {
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to);
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      // Hanya tampilkan menu jika ada teks yang diseleksi (bukan hanya kursor)
      shouldShow={({ state }) => !state.selection.empty}
      className="p-1 bg-accent border rounded-lg shadow-lg flex flex-col items-center gap-1"
    >
      <Button variant="ghost" size="sm" className="h-auto px-2 py-1"
        onClick={() => onAIAction('fix', getSelectedText())}
      >
        <Languages className="h-4 w-4 mr-2" />
        Fix Grammar
      </Button>
      <Button variant="ghost" size="sm" className="h-auto px-2 py-1"
        onClick={() => onAIAction('shorter', getSelectedText())}
      >
        <Rows className="h-4 w-4 mr-2" />
        Make Shorter
      </Button>
       <Button variant="ghost" size="sm" className="h-auto px-2 py-1"
        onClick={() => onAIAction('longer', getSelectedText())}
      >
        <Pilcrow className="h-4 w-4 mr-2" />
        Make Longer
      </Button>
    </BubbleMenu>
  );
};