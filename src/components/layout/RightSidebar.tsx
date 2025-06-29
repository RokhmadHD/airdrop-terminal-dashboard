// src/components/layout/RightSidebar.tsx
"use client";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Sparkles, Loader2, Clipboard, X } from "lucide-react";
import { useState } from "react";
import { useSidebar } from "@/contexts/SidebarProvider"; // Import hook kita
import { useUser } from "@/contexts/user-provider";

// Fungsi untuk memanggil API Gemini
async function generateWithAI(prompt: string, token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ prompt }),
    });
    if (!response.ok) throw new Error("AI generation failed");
    const data = await response.json();
    return data.text;
}

export const RightSidebar = () => {
  const { isRightSidebarOpen, closeRightSidebar } = useSidebar();
  const { session } = useUser();

  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateClick = async () => {
    if (!prompt || !session) return;
    setIsLoading(true);
    setResult("");
    try {
      const aiResult = await generateWithAI(prompt, session.access_token);
      setResult(aiResult);
    } catch (error) {
      console.error(error);
      alert("AI Generation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isRightSidebarOpen} onOpenChange={closeRightSidebar}>
      <SheetContent className="w-[400px] sm:w-[540px] p-0">
        <div className="h-full flex flex-col">
            <SheetHeader className="p-6">
              <SheetTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary"/> AI Assistant
              </SheetTitle>
              <SheetDescription>
                Use AI to generate ideas, expand content, or check your writing.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <Textarea 
                placeholder="Enter a prompt, e.g., 'Give me 5 title ideas for a guide about wallet security'."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px]"
              />
              <Button onClick={handleGenerateClick} disabled={isLoading || !prompt} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate
              </Button>

              {result && (
                <div className="p-4 mt-4 border rounded-md bg-background relative">
                  <p className="text-sm whitespace-pre-wrap">{result}</p>
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => navigator.clipboard.writeText(result)}
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};