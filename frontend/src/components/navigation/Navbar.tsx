import { X, AlignJustify, Bell, CircleUserRound } from "lucide-react";
import React, { useState, useEffect } from "react";
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTop, setIsTop] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const newNotificationsCount = notifications.reduce(
    (acc, notification) => acc + (notification.is_read ? 0 : 1),
    0
  );

  useEffect(() => {
    try {
      const fetchNotifications = async () => {
        const res = await axios.get("/notifications");
        console.log(res.data);
        setNotifications(res.data);
      };
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const setNotificationToRead = async () => {
    try {
      const res = await axios.put("/notifications/read");
      console.log(res.data);
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true }))
      );
    } catch (error) {
      console.log(error);
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
            {/* <svg
              height="35px"
              viewBox="-.118 -.109 251.871 92.31644088"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m245.106 11.497h1.107c.53 0 .892-.08 1.087-.236a.765.765 0 0 0 .286-.624.757.757 0 0 0 -.139-.448.81.81 0 0 0 -.387-.293c-.163-.07-.47-.098-.917-.098h-1.037zm-.915 3.186v-5.655h1.944c.663 0 1.146.053 1.445.156.296.104.532.288.71.55.176.257.265.534.265.824 0 .415-.15.773-.444 1.08-.296.305-.688.478-1.175.515.2.083.36.183.481.299.224.221.503.596.833 1.122l.688 1.11h-1.123l-.498-.893c-.397-.698-.711-1.137-.946-1.314-.168-.133-.409-.2-.728-.2h-.537v2.406zm2.302-7.304c-.74 0-1.46.19-2.162.568a4.105 4.105 0 0 0 -1.644 1.629 4.425 4.425 0 0 0 -.592 2.202c0 .759.193 1.486.58 2.184.39.694.933 1.236 1.633 1.624a4.397 4.397 0 0 0 2.185.585c.76 0 1.488-.194 2.184-.585a4.098 4.098 0 0 0 1.626-1.624 4.421 4.421 0 0 0 .582-2.184c0-.764-.197-1.5-.59-2.202a4.067 4.067 0 0 0 -1.644-1.63c-.703-.378-1.423-.567-2.158-.567m0-.868c.883 0 1.748.227 2.588.68a4.814 4.814 0 0 1 1.966 1.946c.473.846.706 1.725.706 2.641 0 .906-.23 1.779-.693 2.616a4.919 4.919 0 0 1 -1.95 1.952 5.317 5.317 0 0 1 -2.617.692 5.323 5.323 0 0 1 -2.62-.692 4.949 4.949 0 0 1 -1.95-1.952 5.32 5.32 0 0 1 -.698-2.616c0-.916.236-1.795.71-2.641a4.858 4.858 0 0 1 1.968-1.945c.844-.454 1.705-.681 2.59-.681"
                fill="#808080"
              />
              <path
                d="m28.664.008c-2.637.07-5.291.621-7.814 1.53-9.771 4.078-16.566 12.976-19.64 23.652-.519 2.004-.94 4.01-1.166 6.08 0 .067-.162 2.105.129 1.555.291-.484.42-1.197.582-1.748 1.488-5.014 3.302-9.577 6.084-13.912 6.666-9.805 17.375-16.113 28.698-12.618 2.104.71 3.98 1.747 5.856 2.976.355.259 2.976 2.33 2.394.453-.485-1.486-1.714-2.751-2.783-3.754-3.598-3.114-7.944-4.331-12.34-4.214zm82.643 9.81c-1.52 0-2.684.52-3.494 1.588-.842 1.034-1.229 2.588-1.229 4.627v14.754c-1.877-2.07-3.817-3.56-5.79-4.565a14.287 14.287 0 0 0 -4.306-1.293 21.666 21.666 0 0 0 -2.974-.193c-4.95 0-8.995 1.745-12.035 5.238-3.043 3.495-4.563 8.35-4.563 14.594 0 2.945.39 5.693 1.133 8.217.778 2.524 1.909 4.723 3.397 6.6a15.871 15.871 0 0 0 5.304 4.337c2.039 1 4.238 1.52 6.633 1.52 1.069 0 2.104-.1 3.105-.293a12.156 12.156 0 0 0 1.877-.451 15.966 15.966 0 0 0 4.239-2.2c1.328-.972 2.621-2.233 3.98-3.753v.968c0 1.847.454 3.238 1.326 4.24.873.97 2.04 1.489 3.397 1.489 1.326 0 2.491-.485 3.365-1.424.874-.971 1.293-2.393 1.293-4.305v-44c0-1.843-.387-3.267-1.197-4.238-.839-.97-2.005-1.457-3.461-1.457zm122.1 0c-1.52 0-2.685.52-3.493 1.588-.81 1.034-1.23 2.588-1.23 4.627v14.754c-1.876-2.07-3.818-3.56-5.79-4.565-1.23-.615-2.685-1.065-4.304-1.293a21.668 21.668 0 0 0 -2.977-.193c-4.948 0-8.96 1.745-12.035 5.238-3.04 3.495-4.562 8.35-4.562 14.594 0 2.945.388 5.693 1.164 8.217s1.876 4.723 3.365 6.6a15.854 15.854 0 0 0 5.307 4.337c2.037 1 4.239 1.52 6.633 1.52 1.098 0 2.134-.1 3.105-.293.648-.096 1.26-.257 1.875-.451a15.947 15.947 0 0 0 4.238-2.2c1.328-.972 2.655-2.233 3.98-3.753v.968c0 1.847.453 3.238 1.327 4.24.906.97 2.038 1.489 3.396 1.489 1.393 0 2.523-.485 3.399-1.424.874-.971 1.326-2.393 1.326-4.305v-44c0-1.843-.42-3.267-1.228-4.238-.842-.97-1.974-1.457-3.497-1.457zm-207.293 2.695a8.148 8.148 0 0 0 -3.939.899c-4.044 2.037-5.663 6.987-3.592 11.031 2.038 4.045 6.986 5.664 11.031 3.594 4.044-2.039 5.662-6.989 3.592-11.031a8.17 8.17 0 0 0 -7.092-4.493zm112.726 12.092c-2.88.033-5.5.518-7.894 1.422-2.46.973-4.529 2.365-6.211 4.145-1.684 1.81-2.978 3.98-3.852 6.502-.874 2.525-1.326 5.275-1.326 8.218 0 6.277 1.812 11.193 5.37 14.848 3.365 3.464 7.993 5.274 13.913 5.467.355.034.679.035 1.035.035 2.815 0 5.274-.357 7.442-1.1 2.167-.746 3.946-1.65 5.369-2.752 1.457-1.13 2.492-2.296 3.205-3.494.712-1.196 1.066-2.263 1.066-3.136 0-1.003-.322-1.812-.937-2.364-.645-.548-1.489-.841-2.492-.841-.97 0-1.68.228-2.2.648a105.113 105.113 0 0 1 -3.04 2.783 27.532 27.532 0 0 1 -2.557 1.908c-.94.582-1.876 1.037-2.88 1.295-.97.29-2.07.42-3.267.42-.26 0-.518 0-.744-.033-1.487-.097-2.88-.517-4.14-1.295-1.457-.872-2.655-2.165-3.526-3.848-.907-1.747-1.361-3.753-1.393-6.017h19.541c2.59 0 4.627-.388 6.082-1.1 1.425-.776 2.137-2.395 2.137-4.886 0-2.718-.68-5.37-2.072-7.99-1.391-2.59-3.493-4.723-6.275-6.376-2.784-1.648-6.15-2.459-10.03-2.459zm39.957 0c-2.88.033-5.533.518-7.894 1.422-2.46.973-4.53 2.365-6.247 4.145-1.65 1.81-2.942 3.98-3.814 6.502-.875 2.525-1.328 5.275-1.328 8.218 0 6.277 1.779 11.193 5.338 14.848 3.363 3.464 8.024 5.274 13.945 5.467.325.034.677.035 1.033.035 2.784 0 5.275-.357 7.442-1.1 2.167-.746 3.947-1.65 5.37-2.752 1.426-1.13 2.491-2.296 3.204-3.494.711-1.196 1.068-2.263 1.068-3.136 0-1.003-.325-1.812-.972-2.364-.614-.548-1.454-.841-2.49-.841-.94 0-1.651.228-2.169.648-1.262 1.165-2.262 2.103-3.039 2.783a27.98 27.98 0 0 1 -2.59 1.908c-.903.582-1.876 1.037-2.845 1.295-1.005.29-2.07.42-3.268.42-.26 0-.518 0-.744-.033-1.489-.097-2.881-.517-4.143-1.295-1.488-.872-2.653-2.165-3.558-3.848-.874-1.747-1.328-3.753-1.36-6.017h19.508c2.622 0 4.66-.388 6.084-1.1 1.457-.776 2.166-2.395 2.166-4.886 0-2.718-.709-5.37-2.101-7.99-1.391-2.59-3.463-4.723-6.278-6.376-2.783-1.648-6.113-2.459-10.029-2.459zm-135.883.067c-1.456 0-2.59.484-3.398 1.422-.841.906-1.262 2.33-1.262 4.238v28.826c0 1.94.453 3.462 1.39 4.498.94 1.066 2.103 1.586 3.56 1.586 1.488 0 2.684-.52 3.624-1.52.938-1.036 1.424-2.527 1.424-4.564v-12.455c0-4.11.226-6.859.711-8.348.679-1.875 1.781-3.33 3.236-4.398 1.457-1.036 3.074-1.586 4.854-1.586 2.715 0 4.56.874 5.467 2.619.905 1.749 1.36 4.27 1.36 7.572v16.596c0 1.94.451 3.462 1.39 4.498.937 1.066 2.135 1.586 3.623 1.586 1.455 0 2.652-.52 3.558-1.555.907-1.001 1.391-2.524 1.391-4.529v-18.537c0-2.199-.096-4.013-.291-5.404-.194-1.424-.613-2.748-1.293-3.979-1.035-2.102-2.556-3.72-4.627-4.853s-4.431-1.713-7.053-1.713c-2.718 0-5.112.548-7.215 1.617-2.07 1.099-3.978 2.782-5.76 5.11v-1.227c0-1.165-.193-2.168-.613-3.01-.42-.84-1.003-1.456-1.714-1.877-.714-.421-1.49-.613-2.362-.613zm95.895 6.89h.031c2.586 0 4.69.841 6.275 2.524 1.62 1.681 2.524 4.238 2.782 7.668h-18.117c.357-3.364 1.327-5.921 2.912-7.635 1.585-1.715 3.623-2.557 6.116-2.557zm39.955 0h.033c2.588 0 4.688.841 6.273 2.524 1.587 1.681 2.525 4.238 2.752 7.668h-18.085c.323-3.364 1.294-5.921 2.912-7.635 1.586-1.715 3.624-2.557 6.115-2.557zm-82.402.582h.126c1.715 0 3.301.518 4.725 1.522 1.488 1.002 2.655 2.458 3.527 4.367.843 1.909 1.295 4.206 1.295 6.86 0 2.846-.452 5.207-1.295 7.083-.872 1.877-2.039 3.267-3.494 4.172-1.425.906-3.043 1.362-4.758 1.362h-.03c-1.747 0-3.334-.486-4.79-1.424-1.486-.97-2.62-2.394-3.46-4.27-.842-1.909-1.262-4.206-1.262-6.924 0-2.556.39-4.821 1.166-6.73.808-1.94 1.908-3.43 3.363-4.465 1.424-1.069 3.074-1.553 4.887-1.553zm122.13 0h.098c1.715 0 3.3.518 4.756 1.522 1.456 1.002 2.622 2.458 3.494 4.367.874 1.909 1.295 4.206 1.295 6.86 0 2.846-.421 5.207-1.295 7.083-.872 1.877-2.04 3.267-3.463 4.172a8.857 8.857 0 0 1 -4.787 1.362h-.031c-1.746 0-3.334-.486-4.79-1.424-1.454-.97-2.619-2.394-3.46-4.27-.841-1.909-1.262-4.206-1.262-6.924 0-2.556.385-4.82 1.195-6.73.777-1.94 1.91-3.43 3.334-4.465 1.458-1.069 3.073-1.553 4.916-1.553zm-186.838.325c-2.59 1.55-5.63 2.425-8.865 2.425-.678 0-1.326-.031-2.006-.097v23.812c0 2.2.518 3.85 1.522 4.951 1.035 1.132 2.298 1.682 3.883 1.682 1.616 0 2.945-.55 3.945-1.65 1.005-1.1 1.521-2.75 1.521-4.983v-26.139z"
                fill="#2164f3"
                fillRule="evenodd"
              />
            </svg> */}
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
              Job Listing
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
                if (notifications.some((notification) => !notification.is_read))
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
              <Notification notifications={notifications} />
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
