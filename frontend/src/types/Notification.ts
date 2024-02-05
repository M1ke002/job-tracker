interface Notification {
  id: number;
  scraped_site_id: number | null;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default Notification;
