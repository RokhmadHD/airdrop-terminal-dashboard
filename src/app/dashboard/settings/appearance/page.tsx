import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AppearanceSettingsPage() {
  return (
    <Card className="max-w-xl w-full">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <p className="text-sm text-muted-foreground">Customize your frontend look and feel.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="logo-url">Logo URL</Label>
          <Input id="logo-url" placeholder="https://example.com/logo.png" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="theme-color">Primary Theme Color</Label>
          <Input id="theme-color" type="color" />
        </div>
        <Button>Save</Button>
      </CardContent>
    </Card>
  );
}