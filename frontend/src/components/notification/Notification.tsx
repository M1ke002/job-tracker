import React from "react";
import { Separator } from "../ui/separator";
import NotificationItem from "./NotificationItem";

const Notification = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2 px-4 py-3 shadow-sm">
        <p className="text-black font-semibold">Notifications</p>
        <div className="bg-[#c0dbf7] rounded-full text-center px-2 py-1 text-xs font-semibold inline-block mt-1">
          2
        </div>
      </div>
      <Separator />
      <div className="overflow-y-auto max-h-[330px]">
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        {/* load more btn */}
        <div className="flex items-center justify-center">
          <button className="text-sm w-full text-blue-500 hover:text-blue-500/80 py-3">
            Load more
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
