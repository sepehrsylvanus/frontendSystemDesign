"use client";

import { Button } from "@/components/ui/button";
import { markAllNotificationsAsRead } from "../actions/markAllAsRead";
import { useTransition } from "react";

export function MarkAllAsReadButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await markAllNotificationsAsRead();
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "Marking..." : "Mark all as read"}
    </Button>
  );
}
