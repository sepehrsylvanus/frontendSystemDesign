"use client";

import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NotificationBellProps {
  initialUnreadCount: number;
}
const NotificationBell = ({ initialUnreadCount }: NotificationBellProps) => {
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  useEffect(() => {
    setUnreadCount(initialUnreadCount);
  }, [initialUnreadCount]);

  return (
    <Link href="/notifications" className="relative">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default NotificationBell;
