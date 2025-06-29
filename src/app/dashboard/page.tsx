// src/app/(dashboard)/dashboard/page.tsx

import { Rocket, Users, Newspaper, CheckCircle, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { createClient } from "@/lib/supabase/server";
import { getAnalyticsOverview } from "@/lib/api";

export default async function DashboardPage() {

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return <p>Please log in to view analytics.</p>;

  const analytics = await getAnalyticsOverview(session.access_token);

  if (!analytics) {
    return <p>Could not load analytics data.</p>;
  }

  return (
    <div className="w-full mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Overview</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Airdrops"
          value={analytics.total_airdrops.toLocaleString()}
          description="+12 since last month"
          Icon={Rocket}
        />
        <StatCard
          title="Total Users"
          value={analytics.total_users.toLocaleString()}
          description="+85 this month"
          Icon={Users}
        />
        <StatCard
          title="New Users (7 days)"
          value={analytics.new_users_last_7_days?.reduce((sum, day) => sum + day.count, 0).toLocaleString() || '0'}
          Icon={Activity}
        />
      </div>

      {/* Main Content Area: Chart dan Recent Activity */}
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          {/* Chart butuh Client Component, bungkus dengan ClientOnly */}
          {analytics.new_users_last_7_days && (
            <OverviewChart data={analytics.new_users_last_7_days} />
          )}
        </div>
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}