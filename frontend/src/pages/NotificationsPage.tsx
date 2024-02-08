import React, { useEffect, useState } from "react";

import NotificationItem from "@/components/notification/NotificationItem";
import axios from "@/lib/axiosConfig";
import Notification from "@/types/Notification";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [todayNotifications, setTodayNotifications] = useState<Notification[]>(
    []
  );
  const [earlierNotifications, setEarlierNotifications] = useState<
    Notification[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/notifications?limit=30&page=1");
        const notifications = res.data[0];
        const hasNextPage = res.data[1];
        setNotifications(notifications);
        setHasNextPage(hasNextPage);

        setTodayAndEarlierNotifications(notifications);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotifications();
  }, []);

  const fetchMoreNotifications = async () => {
    try {
      if (!hasNextPage) return;
      const res = await axios.get(
        `/notifications?limit=30&page=${currentPage + 1}`
      );
      const olderNotifications = res.data[0];
      const hasNext = res.data[1];
      setNotifications([...notifications, ...olderNotifications]);
      setTodayAndEarlierNotifications([
        ...notifications,
        ...olderNotifications,
      ]);
      setCurrentPage(currentPage + 1);
      setHasNextPage(hasNext);
    } catch (error) {
      console.log(error);
    }
  };

  const setTodayAndEarlierNotifications = (notifications: Notification[]) => {
    const today = new Date();
    const todayNotifications = notifications.filter(
      (notification: Notification) => {
        //createdAt must minus 7 hours to get the correct date
        const createdAt = new Date(notification.created_at);
        createdAt.setHours(createdAt.getHours() - 7);
        return createdAt.getDate() === today.getDate();
      }
    );
    setTodayNotifications(todayNotifications);

    const earlierNotifications = notifications.filter(
      (notification: Notification) => {
        const createdAt = new Date(notification.created_at);
        createdAt.setHours(createdAt.getHours() - 7);
        return createdAt.getDate() !== today.getDate();
      }
    );
    setEarlierNotifications(earlierNotifications);
  };
  return (
    <div className="max-w-2xl mx-auto flex flex-col py-8 px-2">
      <h1 className="text-2xl font-semibold mb-5">Notifications</h1>

      <div className="flex flex-col min-h-[400px] bg-white rounded-md border border-[#dbe9ff] shadow-sm">
        {notifications.length === 0 && (
          <div className="flex items-center justify-center h-[400px] font-semibold">
            <p className=" text-gray-500">No notifications</p>
          </div>
        )}
        {notifications.length > 0 && (
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
                  onClick={fetchMoreNotifications}
                >
                  Load more
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
