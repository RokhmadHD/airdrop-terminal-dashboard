// src/components/workspace/AIBubbleMenu.tsx
"use client";

import { BubbleMenu, Editor } from "@tiptap/react";
import { Button } from "../ui/button";
import { Languages, Rows, Pilcrow } from "lucide-react";

interface AIBubbleMenuProps {
  editor: Editor;
  onAIAction: (action: AIActions, text: string) => void;
}

export type AIActions = "fix" | "shorter" | "longer" | "simplify" | "create";

export const AIBubbleMenu = ({ editor, onAIAction }: AIBubbleMenuProps) => {
  const getSelectedText = () => {
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to);
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      shouldShow={({ state }) => !state.selection.empty}
      className="bg-popover border border-border rounded-lg shadow-md p-1 flex items-center gap-1"
    >
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 px-3 py-1 text-xs"
        onClick={() => onAIAction("fix", getSelectedText())}
      >
        <Languages className="h-4 w-4" />
        <span>Fix Grammar</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 px-3 py-1 text-xs"
        onClick={() => onAIAction("shorter", getSelectedText())}
      >
        <Rows className="h-4 w-4" />
        <span>Make Shorter</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 px-3 py-1 text-xs"
        onClick={() => onAIAction("longer", getSelectedText())}
      >
        <Pilcrow className="h-4 w-4" />
        <span>Make Longer</span>
      </Button>
    </BubbleMenu>
  );
};
