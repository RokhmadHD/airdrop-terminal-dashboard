import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SeoSettingsPage() {
  return (
    <Card className="max-w-xl w-full">
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
        <p className="text-sm text-muted-foreground">Manage metadata for better search visibility.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="meta-title">Meta Title</Label>
          <Input id="meta-title" placeholder="Your Website Title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="meta-desc">Meta Description</Label>
          <Textarea id="meta-desc" placeholder="Short description for SEO..." />
        </div>
        <Button>Save</Button>
      </CardContent>
    </Card>
  );
}