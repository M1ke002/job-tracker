import React from "react";

import { MoreHorizontal, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getTimeDifference } from "@/utils/utils";
import axios from "@/lib/axiosConfig";
import { cn } from "@/lib/utils";

import { useModal } from "@/stores/useModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotificationCache } from "@/hooks/queries/useNotificationsQuery";

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
  const { onOpen } = useModal();
  const queryClient = useQueryClient();

  const deleteNotificationMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/notifications/${id}`);
      return res.data;
    },
    onSuccess: () => {
      //delete the notification in cache
      deleteNotificationCache(queryClient, id);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleDeleteNotification = async () => {
    deleteNotificationMutation.mutate();
  };

  return (
    <div className="relative grid grid-cols-[25px_1fr] items-start border-b-[1px] last:border-b-0 px-4 py-4 cursor-pointer hover:bg-gray-100">
      <span
        className={cn(
          "flex h-2 w-2 translate-y-1 mt-[2px] rounded-full bg-sky-500",
          isRead && "bg-gray-400"
        )}
      />
      <div className="space-y-1">
        <p className="text-sm font-medium leading-5">
          {/* {message.length > 50 ? message.slice(0, 50) + "..." : message} */}
          {message}
        </p>
        <p className="text-sm text-muted-foreground">
          {getTimeDifference(new Date(createdAt), new Date())}
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
