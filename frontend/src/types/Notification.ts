interface Notification {
  id: number;
  message: string;
  created_at: Date;
  is_read: boolean;
}

export default Notification;
