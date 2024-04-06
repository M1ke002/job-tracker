import axios from "@/lib/axiosConfig";
import Notification from "@/types/Notification";
import { QueryClient, useInfiniteQuery } from "@tanstack/react-query";

const PAGE_LIMIT = 15;
const QUERY_KEY = "notifications";

export const useGetNotifications = () => {
  const fetchNotifications = async ({ pageParam }: { pageParam: number }) => {
    const res = await axios.get(
      `/notifications?limit=${PAGE_LIMIT}&page=${pageParam || 1}`
    );
    return res.data;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchNotifications,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const hasNextPage = lastPage[1];
      if (!hasNextPage) return undefined;
      return lastPageParam + 1;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
    retryOnMount: false,
  });

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  };
};

export const setNotificationToReadCache = (queryClient: QueryClient) => {
  queryClient.setQueryData([QUERY_KEY], (oldData: any) => {
    return {
      ...oldData,
      pages: oldData.pages.map((page: any) => {
        const notifications = page[0];
        const updatedNotifications = notifications.map(
          (notification: Notification) => ({
            ...notification,
            is_read: true,
          })
        );
        return [updatedNotifications, page[1]];
      }),
    };
  });
};

export const deleteNotificationCache = (
  queryClient: QueryClient,
  notificationId: number
) => {
  queryClient.setQueryData([QUERY_KEY], (oldData: any) => {
    return {
      ...oldData,
      pages: oldData.pages.map((page: any) => {
        const notifications = page[0];
        const filteredNotifications = notifications.filter(
          (notification: Notification) => notification.id !== notificationId
        );
        return [
          filteredNotifications,
          filteredNotifications.length === 0 ? false : page[1],
        ];
      }),
    };
  });
};
