interface Notification {
  id: number;
  scraped_site_id: number;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default Notification;
