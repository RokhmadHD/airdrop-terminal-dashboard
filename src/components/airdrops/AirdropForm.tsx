"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { LinkIcon, Loader2, PlusCircle, Trash2 } from "lucide-react";

// Tipe data & fungsi API
import { Airdrop, ParticipationStep, AirdropFormData } from "@/lib/types"; // Import tipe baru Anda
import { createAirdrop, updateAirdrop } from "@/lib/api";

// State Management & Komponen UI
import { useUser } from "@/contexts/user-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { getDomainFromUrl } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface AirdropFormProps {
    initialData?: Airdrop | null;
}

const difficultyOptions = ["Easy", "Medium", "Hard", "Very Hard"];
const categoryOptions = ["DeFi", "Layer 1", "Layer 2", "Gaming", "NFT", "Meme", "Other"];

// 1. Definisikan state awal yang kosong sesuai dengan AirdropFormData
const emptyFormData: AirdropFormData = {
    name: "",
    token_symbol: "",
    project_url: "",
    image_url: "",
    description: "",
    category: "",
    network: "",
    token_contract_address: "",
    airdrop_allocation: undefined,
    estimated_value_usd: undefined,
    difficulty: "",
    participation_steps: [],
    is_confirmed: false,
    start_date: "",
    end_date: "",
    is_active: true,
};

export function AirdropForm({ initialData }: AirdropFormProps) {
    const router = useRouter();
    const { session } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = !!initialData;

    const getInitialState = () => {
        if (isEditMode && initialData) {
            // Jika mode edit, kembalikan objek yang sudah diisi dari initialData
            return {
                name: initialData.name,
                token_symbol: initialData.token_symbol,
                project_url: initialData.project_url || "",
                image_url: initialData.image_url || "",
                description: initialData.description || "",
                category: initialData.category || "",
                network: initialData.network || "",
                token_contract_address: initialData.token_contract_address || "",
                airdrop_allocation: initialData.airdrop_allocation,
                estimated_value_usd: initialData.estimated_value_usd,
                difficulty: initialData.difficulty || "",
                participation_steps: initialData.participation_steps || [],
                is_confirmed: initialData.is_confirmed,
                start_date: initialData.start_date ? initialData.start_date.split('T')[0] : "",
                end_date: initialData.end_date ? initialData.end_date.split('T')[0] : "",
                is_active: initialData.is_active,
            };
        }
        // Jika mode create, kembalikan objek kosong
        return {
            name: "", token_symbol: "", project_url: "", image_url: "", description: "",
            category: "", network: "", token_contract_address: "", airdrop_allocation: undefined,
            estimated_value_usd: undefined, difficulty: "", participation_steps: [],
            is_confirmed: false, start_date: "", end_date: "", is_active: true,
        };
    };

    const [formData, setFormData] = useState<AirdropFormData>(getInitialState);

    // --- Inisialisasi State untuk 'Other' Category ---
    const isInitialCategoryOther = isEditMode && initialData?.category && !categoryOptions.slice(0, -1).includes(initialData.category);

    const [isOtherCategory, setIsOtherCategory] = useState(isInitialCategoryOther);
    const [otherCategory, setOtherCategory] = useState(isInitialCategoryOther ? initialData.category || "" : "");

    // 4. Handler umum untuk mengubah state form
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // Untuk input number, kita simpan sebagai number, bukan string
        const newValue = type === 'number' ? (value === '' ? undefined : Number(value)) : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSelectChange = (name: 'difficulty' | 'category', value: string) => {
        if (name === 'category') {
            if (value === "Other") {
                setIsOtherCategory(true);
                // Jangan langsung set formData.category ke "Other" sampai disubmit
            } else {
                setIsOtherCategory(false);
                setOtherCategory(""); // Reset input 'other'
            }
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOtherCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
        setOtherCategory(e.target.value);
    };

    const handleSwitchChange = (name: 'is_confirmed' | 'is_active', checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    // Handler untuk participation steps
    const handleStepChange = (index: number, field: 'instruction' | 'link', value: string) => {
        const newSteps = [...(formData.participation_steps || [])];
        const currentStep = newSteps[index] || {};
        newSteps[index] = { ...currentStep, step: index + 1, [field]: value };
        setFormData(prev => ({ ...prev, participation_steps: newSteps }));
    };

    const addStep = () => {
        const currentSteps = formData.participation_steps || [];
        setFormData(prev => ({
            ...prev,
            participation_steps: [...currentSteps, { step: currentSteps.length + 1, instruction: "" }]
        }));
    };

    const removeStep = (index: number) => {
        const newSteps = (formData.participation_steps || []).filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, participation_steps: newSteps }));
    };

    // 5. Logika saat form disubmit
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!session) { setError("You must be logged in."); return; }
        if (!formData.name || !formData.token_symbol) { setError("Name and Symbol are required."); return; }
        setIsLoading(true);
        setError(null);

        let dataToSend = { ...formData };
        if (formData.category === "Other" && otherCategory.trim() !== "") {
            dataToSend.category = otherCategory.trim();
        }
        try {
            let resultAirdrop: Airdrop;
            if (isEditMode && initialData) {
                resultAirdrop = await updateAirdrop(initialData.slug, dataToSend, session.access_token);
            } else {
                resultAirdrop = await createAirdrop(dataToSend, session.access_token);
            }
            router.push(`/dashboard/airdrops`);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };



    // 6. JSX Form dengan semua field dari AirdropFormData
    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-3"><Switch id="is_edit_mode" checked={isEditMode} className="checked:bg-blue-500" /><Label htmlFor="is_edit_mode">Edit Mode</Label></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2"><Label htmlFor="name">Airdrop Name*</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} /></div>
                        <div className="space-y-2"><Label htmlFor="token_symbol">Token Symbol*</Label><Input id="token_symbol" name="token_symbol" value={formData.token_symbol} onChange={handleChange} /></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={formData.description} onChange={handleChange} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2"><Label htmlFor="project_url">Project URL</Label><Input id="project_url" name="project_url" type="url" value={formData.project_url} onChange={handleChange} /></div>
                        <div className="space-y-2"><Label htmlFor="image_url">Image URL</Label><Input id="image_url" name="image_url" type="url" value={formData.image_url} onChange={handleChange} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <Label htmlFor="network">Network</Label>
                            <Input id="network" name="network" value={formData.network} onChange={handleChange} />
                        </div>

                        {/* --- SELECT UNTUK DIFFICULTY --- */}
                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulty</Label>
                            <Select
                                name="difficulty"
                                value={formData.difficulty || undefined}
                                onValueChange={(value) => handleSelectChange('difficulty', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select difficult" />
                                </SelectTrigger>
                                <SelectContent>
                                    {difficultyOptions.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* --- SELECT UNTUK CATEGORY --- */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                name="category"
                                value={formData.category || undefined}
                                onValueChange={(value) => handleSelectChange('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {isOtherCategory && (
                                <div className="space-y-2 animate-in fade-in-50">
                                    {/* <Label htmlFor="other_category">Please specify the category</Label> */}
                                    <Input
                                        id="other_category"
                                        name="other_category"
                                        value={otherCategory}
                                        onChange={handleOtherCategoryChange}
                                        placeholder="e.g., Infrastructure"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2"><Label htmlFor="token_contract_address">Token Contract Address</Label><Input id="token_contract_address" name="token_contract_address" value={formData.token_contract_address} onChange={handleChange} /></div>
                        <div className="space-y-2"><Label htmlFor="airdrop_allocation">Airdrop Allocation</Label><Input id="airdrop_allocation" name="airdrop_allocation" type="number" value={formData.airdrop_allocation || ''} onChange={handleChange} /></div>
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="space-y-2"><Label htmlFor="estimated_value_usd">Estimated Value (USD)</Label><Input id="estimated_value_usd" name="estimated_value_usd" type="number" step="0.01" value={formData.estimated_value_usd || ''} onChange={handleChange} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2"><Label htmlFor="start_date">Start Date</Label><Input id="start_date" name="start_date" type="date" value={formData.start_date || ''} onChange={handleChange} /></div>
                        <div className="space-y-2"><Label htmlFor="end_date">End Date</Label><Input id="end_date" name="end_date" type="date" value={formData.end_date || ''} onChange={handleChange} /></div>
                    </div>

                    {/* Form Dinamis untuk Participation Steps */}
                    <div>
                        <Label>Participation Steps</Label>
                        <div className="space-y-4 mt-2">
                            {(formData.participation_steps || []).slice(0, -1).map((step, index) => {
                                const domain = getDomainFromUrl(step.link);
                                return (
                                    <div key={index} className="flex items-center gap-2 p-2  border rounded-lg bg-muted/90">
                                        <div className="flex-grow flex space-x-2 items-center">
                                            <p className="font-semibold">Step {index + 1}:</p>
                                            <p className="text-sm">{step.instruction}</p>
                                            {step.link && domain && (
                                                <a
                                                    href={step.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                                                >
                                                    <LinkIcon className="h-3 w-3" />
                                                    <span>{domain}</span>
                                                </a>
                                            )}
                                        </div>
                                        {/* Tombol hapus tetap ada untuk semua */}
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeStep(index)}>
                                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                        </Button>
                                    </div>
                                )
                            })}

                            {/* Render step TERAKHIR sebagai input, jika ada */}
                            {(formData.participation_steps || []).length > 0 && (
                                <div className="flex items-start gap-2 p-4 border-2 border-primary/50 rounded-lg bg-muted/50">
                                    <div className="flex-grow space-y-2">
                                        <Label className="font-semibold">Current Step ({(formData.participation_steps ?? []).length})</Label>
                                        <Input
                                            placeholder={`Instruction for Step ${(formData.participation_steps ?? []).length}`}
                                            value={(formData.participation_steps ?? [])[((formData.participation_steps ?? []).length - 1)]?.instruction || ""}
                                            onChange={(e) => handleStepChange((formData.participation_steps ?? []).length - 1, 'instruction', e.target.value)}
                                        />
                                        <Input
                                            placeholder="Optional link (e.g., https://twitter.com/...)"
                                            value={(formData.participation_steps ?? [])[((formData.participation_steps ?? []).length - 1)]?.link || ""}
                                            onChange={(e) => handleStepChange((formData.participation_steps ?? []).length - 1, 'link', e.target.value)}
                                        />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeStep((formData.participation_steps ?? []).length - 1)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <Button type="button" variant="outline" size="sm" onClick={addStep}><PlusCircle className="mr-2 h-4 w-4" />Add Step</Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3"><Switch id="is_confirmed" checked={formData.is_confirmed} onCheckedChange={(c) => handleSwitchChange('is_confirmed', c)} /><Label htmlFor="is_confirmed">Airdrop is Confirmed</Label></div>
                        <div className="flex items-center space-x-3"><Switch id="is_active" checked={formData.is_active} onCheckedChange={(c) => handleSwitchChange('is_active', c)} /><Label htmlFor="is_active">Airdrop is Active</Label></div>
                    </div>
                </div>
            </div>



            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Save Changes" : "Create Airdrop"}
            </Button>
        </form>
    );
}