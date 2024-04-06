import React, { useEffect, useMemo, useState } from "react";

import NotificationItem from "@/components/notification/NotificationItem";
import Notification from "@/types/Notification";

import { useGetNotifications } from "@/hooks/queries/useNotificationsQuery";

const getTodayAndEarlierNotifications = (notifications: Notification[]) => {
  const today = new Date();
  const todayNotifications = notifications.filter(
    (notification: Notification) => {
      //createdAt must minus 7 hours to get the correct date
      const createdAt = new Date(notification.created_at);
      createdAt.setHours(createdAt.getHours() - 7);
      return createdAt.getDate() === today.getDate();
    }
  );

  const earlierNotifications = notifications.filter(
    (notification: Notification) => {
      const createdAt = new Date(notification.created_at);
      createdAt.setHours(createdAt.getHours() - 7);
      return createdAt.getDate() !== today.getDate();
    }
  );

  return { todayNotifications, earlierNotifications };
};

const NotificationsPage = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useGetNotifications();

  const { todayNotifications, earlierNotifications } = useMemo(() => {
    if (!data) return { todayNotifications: [], earlierNotifications: [] };
    const notifications: Notification[] = data.pages.reduce((prev, page) => {
      if (page) {
        return [...prev, ...page[0]];
      } else {
        return [...prev];
      }
    }, [] as Notification[]);
    console.log(data.pages);
    return getTodayAndEarlierNotifications(notifications);
  }, [data]);

  return (
    <div className="max-w-2xl mx-auto flex flex-col py-8 px-2">
      <h1 className="text-2xl font-semibold mb-5">Notifications</h1>

      <div className="flex flex-col min-h-[400px] bg-white rounded-md border border-[#dbe9ff] shadow-sm">
        {(isFetching || !data || data.pages.length === 0) && (
          <div className="flex items-center justify-center h-[400px] font-semibold">
            <p className=" text-gray-500">
              {isFetching || !data ? "Loading..." : "No notifications"}
            </p>
          </div>
        )}
        {data && data.pages.length > 0 && (
          <>
            <div className="flex items-center space-x-3 border-b-[1px] font-semibold p-3 px-4">
              <div>Today</div>
              <div className="bg-[#c0dbf7] rounded-full text-center px-2 py-1 text-xs font-semibold inline-block mt-1">
                {todayNotifications.length}
              </div>
            </div>
            {todayNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                id={notification.id}
                message={notification.message}
                createdAt={notification.created_at}
                isRead={notification.is_read}
              />
            ))}
            <div className="p-3 px-4 border-b-[1px] font-semibold">Earlier</div>
            {earlierNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                id={notification.id}
                message={notification.message}
                createdAt={notification.created_at}
                isRead={notification.is_read}
              />
            ))}
            {hasNextPage && (
              <div className="flex items-center justify-center">
                <button
                  className="text-sm w-full text-blue-500 hover:text-blue-500/80 py-3 bg-[#f6f7f8] font-semibold uppercase"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
