import React, { useState } from "react";
import { Separator } from "../ui/separator";
import NotificationItem from "./NotificationItem";
import axios from "@/lib/axiosConfig";
import NotificationType from "@/types/Notification";

interface NotificationProps {
  notifications: NotificationType[];
}

const Notification = ({ notifications }: NotificationProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2 px-4 py-3 shadow-sm">
        <p className="text-black font-semibold">Notifications</p>
        <div className="bg-[#c0dbf7] rounded-full text-center px-2 py-1 text-xs font-semibold inline-block mt-1">
          {notifications.reduce(
            (acc, notification) => acc + (notification.is_read ? 0 : 1),
            0
          )}
        </div>
      </div>
      <Separator />
      <div className="overflow-y-auto max-h-[300px]">
        {notifications.length === 0 && (
          <div className="flex items-center justify-center h-[200px] font-semibold">
            <p className=" text-gray-500">No notifications</p>
          </div>
        )}
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            id={notification.id}
            message={notification.message}
            createdAt={notification.created_at}
            isRead={notification.is_read}
          />
        ))}
      </div>
      {/* load more btn */}
      <div className="flex items-center justify-center">
        <button className="text-sm w-full text-blue-500 hover:text-blue-500/80 py-3 bg-[#f6f7f8] font-semibold">
          Load more
        </button>
      </div>
    </div>
  );
};

export default Notification;
