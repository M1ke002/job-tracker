import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import { getTimeDifference } from "@/utils/utils";
import { useModal } from "@/hooks/zustand/useModal";
import axios from "@/lib/axiosConfig";

import { useNotifications } from "@/hooks/zustand/useNotifications";

interface NotificationItemProps {
  id: number;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const NotificationItem = ({
  id,
  message,
  createdAt,
  isRead,
}: NotificationItemProps) => {
  const { notifications, setNotifications } = useNotifications();
  const { onOpen } = useModal();

  const handleDeleteNotification = async () => {
    try {
      const res = await axios.delete(`/notifications/${id}`);
      const updatedNotifications = notifications.filter(
        (notification) => notification.id !== id
      );
      setNotifications(updatedNotifications);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative grid grid-cols-[25px_1fr] items-start border-b-[1px] last:border-b-0 px-4 py-4 cursor-pointer hover:bg-gray-100">
      {!isRead && (
        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
      )}
      {isRead && (
        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-gray-400" />
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">
          {message.length > 50 ? message.slice(0, 50) + "..." : message}
        </p>
        <p className="text-sm text-muted-foreground">
          {getTimeDifference(createdAt, new Date())}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="border-none focus:outline-none text-black dark:text-white p-1 absolute top-[50%] right-3 transform translate-y-[-50%] hover:text-gray-500">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right">
          <DropdownMenuItem
            className="flex items-center"
            onClick={() => {
              onOpen("deleteNotification", {
                confirmModalTitle: "Delete notification",
                confirmModalMessage:
                  "Are you sure you want to delete this notification?",
                confirmModalConfirmButtonText: "Delete",
                confirmModalAction: handleDeleteNotification,
              });
            }}
          >
            <Trash size={18} className="mr-2 text-rose-500" />
            Delete notification
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotificationItem;
