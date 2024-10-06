interface Task {
  id: number;
  job_id: number;
  task_name: string;
  due_date?: Date;
  is_completed: boolean;
  is_reminder_enabled: boolean;
  is_reminded: boolean;
  is_notify_email: boolean;
  is_notify_on_website: boolean;
}

export default Task;
