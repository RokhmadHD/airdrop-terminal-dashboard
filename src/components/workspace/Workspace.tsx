'use client';
import { useUser } from '@/contexts/user-provider';
import { updatePost, createPost } from '@/lib/api';
import { Guide, GuideFormData } from '@/lib/types';
import { convertMarkdownToHtml, simulateTypingAdvanced } from '@/lib/utils';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useParams,useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { AIActions, AIBubbleMenu } from './AIBubbleMenu';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { TiptapEditor } from './TiptapEditor';


async function generateWithAI(prompt: string, systemIntructions: string, token: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ prompt, systemIntructions }),
    });
    if (!response.ok) throw new Error("AI generation failed");
    return response.json();
}

const emptyFormData: GuideFormData = {
    title: "",
    description: "",
    content: "",
    image_url: "",
    category: "Beginner",
    status: "draft"
};
interface WorkspaceProps {
    initData?: Guide
}

function Workspace({ initData }: WorkspaceProps) {
    const params = useParams();
    const slug = params.slug as string;
    const { session } = useUser()
    const [formData, setFormData] = useState<GuideFormData>(emptyFormData);
    const [title, setTitle] = useState(initData?.title || '');
    const [content, setContent] = useState(initData?.content || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isAiEditing, setIsAIEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [displayedText, setDisplayedText] = useState(initData?.content || '')
    const [progress, setProgress] = useState(0)
    const [isTyping, setIsTyping] = useState(false);
    const [selectText, setSelectText] = useState('')
    const router = useRouter();
    

    // Debounce untuk Autosave
    const [debouncedContent] = useDebounce(content, 1500); // Autosave 1.5 detik setelah berhenti mengetik
    const [debouncedTitle] = useDebounce(title, 1500);
    // Fetch data awal
    useEffect(() => {
        // ... logika untuk fetch getGuideBySlug(slug) dan set state title & content ...
    }, [slug]);

    // Autosave Logic
    useEffect(() => {
        if (!slug || !session || (debouncedTitle === initData?.title && debouncedContent === initData?.content)) return;
        const autoSave = async () => {
            setIsSaving(true);
            await updatePost(slug, { title: debouncedTitle, content: debouncedContent }, session.access_token).then(console.log)
            setIsSaving(false);
        };
        autoSave();
    }, [debouncedContent, debouncedTitle, slug, session]);

    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
            },
        },
        onUpdate({ editor }) {
            setContent(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && displayedText !== editor.getHTML()) {
            editor.commands.setContent(displayedText, false);
        }
    }, [editor, displayedText]);

    const handleAiCreate = async () => {
        if (!editor || !session) return;
        setIsAIEditing(true)
        const systemIntructions = `
                        You are an experienced content writer and SEO specialist. Based on the blog title provided below, write a comprehensive, informative, and engaging blog post that would perform well on search engines and provide real value to readers.

                        - Use clear headings (H2, H3) where appropriate.
                        - Write in a tone that matches the topic (e.g., informative, persuasive, friendly, or professional).
                        - Include an engaging introduction and a strong conclusion.
                        - Avoid using filler content or repeating ideas.
                        - If relevant, include lists, bullet points, or step-by-step instructions.
                        - Format the content using Markdown.

                        Only return the final blog content. Do not include the title in the output.

                        Blog Title:
                        "${title}"
                        `;
        try {
            const resultText = await generateWithAI(title, systemIntructions, session.access_token);
            const htmlResult = convertMarkdownToHtml(resultText.text);
            setIsTyping(true)
            simulateTypingAdvanced(htmlResult, setDisplayedText, 'char', 5, () => {
                setIsTyping(false)
            }, (progress) => setProgress(progress))

        } catch (error) {
            console.error("AI action failed:", error);
            toast.error("AI action failed.");
        } finally {
            setIsAIEditing(false);
        }
    }


    const handleAIEditorAction = async (action: AIActions, selectedText: string) => {
        if (!editor || !session) return;
        setSelectText(selectedText)
        setIsAIEditing(true);
        let systemIntructions = "";

        // Membuat systemIntructions yang kontekstual berdasarkan aksi
        switch (action) {
            case 'fix':
                systemIntructions = `You are a professional editor. Correct any grammar, spelling, and punctuation mistakes in the following text. Only return the corrected text, without any explanation:\n\n"`;
                break;
            case 'shorter':
                systemIntructions = `You are a professional editor. Rewrite the following text to be more concise and clear, while retaining its core meaning:\n\n"`;
                break;
            case 'longer':
                systemIntructions = `You are a creative writer. Expand on the following text, adding more detail and explanation to make it more comprehensive. Do not add a preamble, just return the expanded text:\n\n"`;
                break;
            case 'simplify':
                // Anda bisa menambahkan aksi lain di sini
                systemIntructions = `Rewrite the following text in simpler, easier-to-understand language for a beginner:\n\n"`;
                break;
        }

        try {
            const resultText = await generateWithAI(selectedText, systemIntructions, session.access_token);
            const htmlResult = convertMarkdownToHtml(resultText.text);
            // Mengganti teks yang diseleksi dengan hasil dari AI
            editor.chain().focus().insertContent(htmlResult).run()
        } catch (error) {
            console.error("AI action failed:", error);
            toast.error("AI action failed.");
        } finally {
            setIsAIEditing(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (newContent: string) => {
        setFormData(prev => ({ ...prev, content: newContent }));
    };

    const handleSelectChange = (name: 'category' | 'status', value: string) => {
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleSwitchChange = (name: 'is_confirmed', checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async () => {
        if (!session) { setError("You must be logged in."); return; }
        if (!formData.title) { setError("Title is required."); return; }

        setIsLoading(true);
        setError(null);

        try {
            const resultGuide = await createPost(formData, session.access_token);
            // Redirect ke halaman edit setelah berhasil dibuat, agar bisa lanjut menulis
            router.push(`/guides/${resultGuide.slug}/edit`);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };


    if (!editor) {
        return null;
    }
    return (
        <div className="flex-1 p-4 md:p-8 overflow-y-auto col-span-3">
            <div className="mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <h1 className="text-2xl font-bold">Editor</h1>
                    <div className='flex items-center gap-2'>
                        {isSaving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                        <span className='text-sm text-muted-foreground'>{isSaving ? 'Saving...' : 'Saved'}</span>
                    </div>
                </div>

                <div className='flex flex-col md:flex-row w-full gap-4'>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Article Title..."
                        className="text-md md:text-xl lg:text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0 px-4 md:px-6 mb-4 h-12"
                    />
                    <Button
                        className="p-0 px-4 md:px-6 mb-4 h-12 text-lg md:text-xl bg-indigo-500"
                        onClick={() => handleAiCreate()}
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <Sparkles className="w-6 h-6 md:w-8 md:h-8" /> {'Create with AI'}
                    </Button>
                </div>
                {editor && <AIBubbleMenu editor={editor} onAIAction={handleAIEditorAction} />}
                <TiptapEditor editor={editor} isTyping={isTyping} progress={progress} />
                {isAiEditing && (
                    <div className='flex items-center gap-2 text-muted-foreground w-full justify-center'>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>AI is thinking...</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Workspace
