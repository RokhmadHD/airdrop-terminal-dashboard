// src/app/dashboard/analytics/page.tsx

import { getAnalyticsOverview } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Rocket, FileText, Activity } from "lucide-react";
import { OverviewChart } from "@/components/dashboard/OverviewChart";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return <p>Please log in to view analytics.</p>;
  
  const analytics = await getAnalyticsOverview(session.access_token);
  console.log(analytics)
  if (!analytics) {
    return <p>Could not load analytics data.</p>;
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
      </div>

      {/* Kartu Statistik */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={analytics.total_users.toLocaleString()} Icon={Users} />
        <StatCard title="Total Airdrops" value={analytics.total_airdrops.toLocaleString()} Icon={Rocket} description={`${analytics.active_airdrops} active`} />
        <StatCard title="Total Guides" value={analytics.total_guides.toLocaleString()} Icon={FileText} description={`${analytics.published_guides} published`} />
        <StatCard title="New Users (7 days)" value={analytics.new_users_last_7_days?.reduce((sum, day) => sum + day.count, 0).toLocaleString() || '0'} Icon={Activity} />
      </div>

      {/* Grafik */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>New Users Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {analytics.new_users_last_7_days && (
                <OverviewChart data={analytics.new_users_last_7_days} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}