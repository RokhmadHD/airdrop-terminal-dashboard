// src/components/layout/NotificationPanel.tsx
"use client";
import { useState, useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { getNotifications, markNotificationsAsRead } from "@/lib/api";
import { type Notification } from "@/lib/types"; // Pastikan tipe di-ekspor dari types.ts
import { useUser } from "@/contexts/user-provider";

export function NotificationPanel() {
  const { session } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (!session) return;
    
    getNotifications(session.access_token)
      .then(data => setNotifications(data))
      .catch(console.error);
  }, [session]);

  const handleMarkAllAsRead = async () => {
    if (!session || unreadCount === 0) return;
    
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    
    // Update UI secara optimis
    const updatedNotifications = notifications.map(n => ({ ...n, is_read: true }));
    setNotifications(updatedNotifications);

    try {
      await markNotificationsAsRead({ notification_ids: unreadIds }, session.access_token);
    } catch (error) {
      // Jika gagal, kembalikan ke state semula (atau tampilkan error)
      console.error("Failed to mark as read:", error);
      // setNotifications(originalNotifications); // Anda perlu menyimpan state original
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <Link href={notif.link_url || "#"} key={notif.id} onClick={() => setIsOpen(false)}>
                <div className={`p-4 border-b hover:bg-muted ${!notif.is_read ? 'bg-muted/50' : ''}`}>
                  <p className={`font-semibold text-sm ${!notif.is_read ? '' : 'text-muted-foreground'}`}>{notif.title}</p>
                  <p className="text-xs text-muted-foreground">{notif.message}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="p-4 text-sm text-center text-muted-foreground">No new notifications.</p>
          )}
        </div>
        {unreadCount > 0 && (
          <div className="p-2 border-t">
            <Button variant="ghost" size="sm" className="w-full" onClick={handleMarkAllAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}