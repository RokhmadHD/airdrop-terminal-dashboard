import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function GeneralSettingsPage() {
  return (
    <Card className="max-w-xl w-full">
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <p className="text-sm text-muted-foreground">Update website name and timezone.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="site-name">Website Name</Label>
          <Input id="site-name" placeholder="My Airdrop Dashboard" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input id="timezone" placeholder="Asia/Jakarta" />
        </div>
        <Button>Save</Button>
      </CardContent>
    </Card>
  );
}
