import { MoreHorizontal } from "lucide-react";
import React from "react";

const NotificationItem = () => {
  return (
    <div className="relative grid grid-cols-[25px_1fr] items-start border-b-[1px] last:border-b-0 px-4 py-4 cursor-pointer hover:bg-gray-100">
      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">
          3 new jobs found on LinkedIn
        </p>
        <p className="text-sm text-muted-foreground">1 hour ago</p>
      </div>
      <button className="border-none focus:outline-none text-black dark:text-white p-1 absolute top-[50%] right-3 transform translate-y-[-50%]">
        <MoreHorizontal className="h-5 w-5" />
      </button>
    </div>
  );
};

export default NotificationItem;
