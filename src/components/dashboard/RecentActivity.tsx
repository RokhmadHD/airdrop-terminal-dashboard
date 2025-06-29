// src/components/dashboard/RecentActivity.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { createClient } from "@/lib/supabase/server";
import { getRecentActivity } from "@/lib/api";
import { Activity } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";



const activities: Activity[] = [
  { type: 'NEW_AIRDROP', details: 'LayerZero was added.', avatarUrl: '', avatarFallback: 'LZ', timestamp: '5 minutes ago' },
  { type: 'NEW_USER', details: 'John Doe signed up.', avatarUrl: 'https://github.com/shadcn.png', avatarFallback: 'JD', timestamp: '15 minutes ago' },
  { type: 'NEW_AIRDROP', details: 'ZkSync was confirmed.', avatarUrl: '', avatarFallback: 'ZK', timestamp: '1 hour ago' },
  { type: 'NEW_USER', details: 'Alice signed up.', avatarUrl: '', avatarFallback: 'A', timestamp: '3 hours ago' },
];

export async function RecentActivity() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return <p className="text-sm text-muted-foreground">Please log in to see activity.</p>;
  }

  const activityData = await getRecentActivity(session.access_token);

  if (!activityData || (!activityData.new_users && !activityData.new_airdrops)) {
    return <p className="text-sm text-muted-foreground">No recent activity found.</p>;
  }
  const new_activity: Activity[] = []
  activityData.new_airdrops?.map(airdrop => {
    new_activity.push({
      type: 'NEW_AIRDROP',
      details: `${airdrop.name} created`,
      avatarFallback: airdrop.name.substring(0, 2),
      avatarUrl: '',
      timestamp: airdrop.created_at
    })
  })
  activityData.new_users?.map(user => {
    new_activity.push({
      type: 'NEW_USER',
      details: `${user.name} signed up.`,
      avatarFallback: user.name.substring(0, 2),
      avatarUrl: user.avatar_url,
      timestamp: user.created_at
    })
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User/Project</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {new_activity.map((activity, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={activity.avatarUrl} alt="Avatar" />
                      <AvatarFallback>{activity.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{activity.details.split(' ')[0]}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={activity.type === 'NEW_USER' ? 'outline' : 'default'}>
                    {activity.type.replace('_', ' ')}
                  </Badge>
                  <p className="text-sm text-muted-foreground hidden md:inline ml-2">
                    {activity.details}
                  </p>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{formatRelativeTime(activity.timestamp)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}