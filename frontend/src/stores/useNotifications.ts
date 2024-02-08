import Notification from "@/types/Notification";
import { create } from "zustand";

interface NotificationStore {
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

export const useNotifications = create<NotificationStore>((set) => ({
  notifications: [],
  setNotifications: (notifications) => set({ notifications }),
}));
