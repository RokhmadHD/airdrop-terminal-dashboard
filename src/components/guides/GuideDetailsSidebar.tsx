// src/components/guides/GuideDetailsSidebar.tsx
'use client'

import { GuideFormData } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface GuideDetailsSidebarProps {
  formData: GuideFormData
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSelectChange: (name: 'category' | 'status', value: string) => void
  onSwitchChange?: (name: string, checked: boolean) => void
  onSubmit: () => void
  isLoading: boolean
  isEditMode?: boolean
  error?: string | null
}

export function GuideDetailsSidebar({
  formData,
  onFormChange,
  onSelectChange,
  onSubmit,
  isLoading,
  isEditMode,
  error,
}: GuideDetailsSidebarProps) {
  return (
    <div className="bg-muted/40 border-l p-4 space-y-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold">Guide Details</h2>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={onFormChange}
          placeholder="Short description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">Cover Image URL</Label>
        <Input
          id="image_url"
          name="image_url"
          value={formData.image_url || ""}
          onChange={onFormChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => onSelectChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Strategy">Strategy</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Tools">Tools</SelectItem>
            <SelectItem value="News">News</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => onSelectChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button className="w-full" onClick={onSubmit} disabled={isLoading}>
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {isEditMode ? "Update Guide" : "Create Guide"}
      </Button>
    </div>
  )
}
