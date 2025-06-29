// src/components/workspace/AISidebar.tsx
"use client";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Sparkles, Loader2, Clipboard } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { SelectionToolbar } from "./SelectionToolbar";
import { convertMarkdownToHtml } from "@/lib/utils";

interface AISidebarProps {
    onGenerate: (prompt: string) => Promise<string>; // Fungsi untuk memanggil AI
    isLoading: boolean;
    onInsertToEditor: (text: string) => void;
}

export const AISidebar = ({ onGenerate, isLoading, onInsertToEditor }: AISidebarProps) => {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState("");

    const [selection, setSelection] = useState<string>("");
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
    const resultRef = useRef<HTMLDivElement>(null); // Ref untuk div hasil AI

    const handleGenerateClick = async () => {
        if (!prompt) return;
        try {
            const aiResult = await onGenerate(prompt);
            const htmlResult = convertMarkdownToHtml(aiResult);
            setResult(htmlResult);
        } catch (error) {
            // Optionally handle error, e.g., show a toast or set an error state
            setResult("Failed to generate content. Please try again.");
            console.error("AI generation error:", error);
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(result);
        // Tambahkan notifikasi toast di sini jika perlu
    };

    const handleMouseUp = useCallback(() => {
        const currentSelection = window.getSelection();
        if (currentSelection && currentSelection.toString().trim() !== "") {
            const selectedText = currentSelection.toString();
            const range = currentSelection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            // Cek apakah seleksi berada di dalam div hasil AI kita
            if (resultRef.current && resultRef.current.contains(currentSelection.anchorNode)) {
                setSelection(selectedText);
                setToolbarPosition({
                    top: rect.top - 40, // Tampilkan 40px di atas seleksi
                    left: rect.left + (rect.width / 2), // Tampilkan di tengah seleksi
                });
            }
        } else {
            // Jika tidak ada seleksi, sembunyikan toolbar
            setSelection("");
            setToolbarPosition({ top: 0, left: 0 });
        }
    }, []);

    const handleInsert = () => {
        onInsertToEditor(selection);
        // Sembunyikan toolbar setelah di-insert
        setSelection("");
        setToolbarPosition({ top: 0, left: 0 });
        window.getSelection()?.removeAllRanges(); // Hapus seleksi visual
    };


    return (
        <aside className="fixed w-[35rem] right-5 top-[0-10rem] z-40 h-max border-l bg-muted/50 rounded-xl" >
            {selection && <SelectionToolbar position={toolbarPosition} onInsert={handleInsert} />}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI Content Generator
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {result && (
                        <div className="p-4 border rounded-md bg-muted/50 relative h-[33rem] overflow-auto hide-scrollbar" >
                            <div className="text-sm whitespace-pre-wrap" ref={resultRef} onMouseUp={handleMouseUp} dangerouslySetInnerHTML={{ __html: result }} />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7"
                                onClick={handleCopyToClipboard}
                            >
                                <Clipboard className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    <Textarea
                        placeholder="Enter a prompt, e.g., 'Write a summary of this article...' or 'Give me 5 title ideas for a guide about wallet security'."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[100px]"
                    />
                    <Button onClick={handleGenerateClick} disabled={isLoading || !prompt} className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate
                    </Button>

                </CardContent>
            </Card>
        </aside>
    );
};