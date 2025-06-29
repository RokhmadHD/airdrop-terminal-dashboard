// src/components/workspace/SelectionToolbar.tsx

"use client";

import { Button } from "../ui/button";
import { CornerDownLeft } from "lucide-react";

interface SelectionToolbarProps {
  position: { top: number; left: number };
  onInsert: () => void;
}

export const SelectionToolbar = ({ position, onInsert }: SelectionToolbarProps) => {
  // Jika posisi top 0, berarti tidak ada seleksi, jangan render apa-apa
  if (position.top === 0 && position.left === 0) {
    return null;
  }

  return (
    <div
      className="absolute z-50 p-1 bg-background border rounded-lg shadow-lg flex items-center gap-1 animate-in fade-in"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <Button variant="ghost" size="sm" onClick={onInsert} className="h-auto px-2 py-1">
        <CornerDownLeft className="h-4 w-4 mr-2" />
        Insert to Editor
      </Button>
      {/* Anda bisa menambahkan tombol lain di sini, misal "Copy" atau "Rewrite with AI" */}
    </div>
  );
};