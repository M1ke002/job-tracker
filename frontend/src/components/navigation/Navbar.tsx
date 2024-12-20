import React, { useState, useEffect, useMemo } from "react";

import { X, AlignJustify, Bell, CircleUserRound } from "lucide-react";

import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Notification from "../notification/Notification";
import NotificationType from "@/types/Notification";
import axios from "@/lib/axiosConfig";

import {
  setNotificationToReadCache,
  useGetNotifications,
} from "@/hooks/queries/useNotificationsQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const { data: notificationsData } = useGetNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isTop, setIsTop] = useState(false);
  const queryClient = useQueryClient();

  const notifications: NotificationType[] = useMemo(() => {
    if (!notificationsData) return [];
    return notificationsData.pages.reduce((prev, page) => {
      if (page) {
        return [...prev, ...page[0]];
      } else {
        return [...prev];
      }
    }, [] as NotificationType[]);
  }, [notificationsData]);

  const newNotificationsCount = useMemo(
    () =>
      notifications.reduce(
        (total, notification) => total + (notification.is_read ? 0 : 1),
        0
      ),
    [notifications]
  );

  const readNotificationsMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.put("/notifications/read");
      return res.data;
    },
    onSuccess: () => {
      setNotificationToReadCache(queryClient);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const setNotificationToRead = async () => {
    if (notifications.some((notification) => !notification.is_read)) {
      readNotificationsMutation.mutate();
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 w-full z-50 dark:z-50 dark:border-[#1e2029] bg-white",
        {
          "border-[#dedede] border-b-[1px] shadow-sm": !isTop,
        }
      )}
    >
      <div className="mx-auto max-w-[1450px] md:flex md:justify-between px-4">
        <div className="flex items-center min-h-[60px] justify-between md:justify-around">
          <a href="/">
            {/* JobTracker text as logo, blue color*/}
            <h1 className="text-[#2164f3] text-2xl font-semibold tracking-wider">
              JobTracker
            </h1>
          </a>
          <div className="flex items-center">
            <div className="md:hidden flex items-center">
              <Bell className="h-6 w-6 text-black dark:text-white mr-5" />
              <CircleUserRound className="h-6 w-6 text-black dark:text-white" />
            </div>
            <button
              className="block md:hidden text-black dark:text-white ml-5"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <AlignJustify className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "md:flex md:items-center pb-3 md:pb-0 space-y-3 md:space-y-0 md:space-x-4 text-[17px]",
            { hidden: !isOpen }
          )}
        >
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              isActive
                ? "md:underline underline-offset-[7px] decoration-blue-500 decoration-2 text-blue-500"
                : "text-black dark:text-white hover:text-zinc-500"
            }
          >
            <p className="text-[16px] font-semibold md:p-2 transition duration-200 ease-in-out rounded-md">
              Job Listings
            </p>
          </NavLink>
          <NavLink
            to="/saved-jobs"
            className={({ isActive }) =>
              isActive
                ? "md:underline underline-offset-[7px] decoration-blue-500 decoration-2 text-blue-500"
                : "text-black dark:text-white hover:text-zinc-500"
            }
          >
            <p className="text-[16px] font-semibold md:p-2 transition duration-200 ease-in-out rounded-md">
              Saved Jobs
            </p>
          </NavLink>
          <NavLink
            to="/applications"
            className={({ isActive }) =>
              isActive
                ? "md:underline underline-offset-[7px] decoration-blue-500 decoration-2 text-blue-500"
                : "text-black dark:text-white hover:text-zinc-500"
            }
          >
            <p className="text-[16px] font-semibold md:p-2 transition duration-200 ease-in-out rounded-md">
              Applications
            </p>
          </NavLink>
          <NavLink
            to="/documents"
            className={({ isActive }) =>
              isActive
                ? "md:underline underline-offset-[7px] decoration-blue-500 decoration-2 text-blue-500"
                : "text-black dark:text-white hover:text-zinc-500"
            }
          >
            <p className="text-[16px] font-semibold md:p-2 transition duration-200 ease-in-out rounded-md">
              Documents
            </p>
          </NavLink>
        </div>

        <div className="hidden md:flex md:items-center">
          <Popover
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setNotificationToRead();
              }
            }}
          >
            <PopoverTrigger asChild>
              <button className="relative border-none focus:outline-none text-black dark:text-white p-1 mr-2">
                <Bell className="h-6 w-6" />
                {newNotificationsCount > 0 && (
                  <span className="absolute top-0 right-1 -mt-1 -mr-1 bg-red-500 rounded-full text-xs text-white px-1">
                    {newNotificationsCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 m-0 rounded-md shadow-md w-[350px] mr-3"
              sideOffset={6}
            >
              <Notification notifications={notifications.slice(0, 15)} />
            </PopoverContent>
          </Popover>

          <button className="border-none focus:outline-none text-black dark:text-white p-1">
            <CircleUserRound className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
