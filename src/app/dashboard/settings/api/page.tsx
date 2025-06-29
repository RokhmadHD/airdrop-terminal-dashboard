'use client';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function ApiSettingsPage() {
  const [apiUrl, setApiUrl] = useState("");

  const handleSave = () => {
    console.log("Saved API URL:", apiUrl);
    // Simpan ke database atau localStorage jika diperlukan
  };

  return (
    <Card className="max-w-xl w-full">
      <CardHeader>
        <CardTitle>API Settings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure the backend API endpoint for frontend communication.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-url">API Base URL</Label>
          <Input
            id="api-url"
            placeholder="https://api.example.com"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
        </div>
        <Button onClick={handleSave}>Save</Button>
      </CardContent>
    </Card>
  );
}