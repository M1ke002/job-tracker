import React from "react";
import { Button } from "../ui/button";
import { CalendarSearch, PlusCircle } from "lucide-react";
import Task from "@/types/Task";
import TaskItem from "../task/TaskItem";

const dueTasks: Task[] = [
  {
    id: 1,
    job_id: 1,
    task_name: "Task 1",
    due_date: "2022-01-01",
    is_completed: false,
    is_reminder_enabled: false,
    is_reminded: false,
    is_notify_email: false,
    is_notify_on_website: false,
  },
  {
    id: 2,
    job_id: 1,
    task_name: "Task 2",
    due_date: "2022-01-02",
    is_completed: false,
    is_reminder_enabled: false,
    is_reminded: false,
    is_notify_email: false,
    is_notify_on_website: false,
  },
];

const onGoingTasks: Task[] = [
  {
    id: 5,
    job_id: 1,
    task_name: "Task 5",
    due_date: "2024-06-05",
    is_completed: false,
    is_reminder_enabled: false,
    is_reminded: false,
    is_notify_email: false,
    is_notify_on_website: false,
  },
  {
    id: 6,
    job_id: 1,
    task_name: "Task 6",
    due_date: "2024-06-06",
    is_completed: false,
    is_reminder_enabled: false,
    is_reminded: false,
    is_notify_email: false,
    is_notify_on_website: false,
  },
];

const completedTasks: Task[] = [
  {
    id: 3,
    job_id: 1,
    task_name: "Task 3",
    due_date: "2022-01-03",
    is_completed: true,
    is_reminder_enabled: false,
    is_reminded: false,
    is_notify_email: false,
    is_notify_on_website: false,
  },
  {
    id: 4,
    job_id: 1,
    task_name: "Task 4",
    due_date: "2022-01-04",
    is_completed: true,
    is_reminder_enabled: false,
    is_reminded: false,
    is_notify_email: false,
    is_notify_on_website: false,
  },
];

const TaskTab = () => {
  return (
    <div>
      <div className="font-semibold flex items-center">
        <p className="text-lg">
          Tasks: {dueTasks.length + onGoingTasks.length + completedTasks.length}
        </p>
        <Button variant="primary" className="ml-auto">
          <PlusCircle size={20} className="mr-2" />
          Add task
        </Button>
      </div>
      <hr className="mt-4 mb-5 border-[#d6eaff]" />

      {dueTasks.length === 0 &&
        onGoingTasks.length === 0 &&
        completedTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center space-y-3 min-h-[200px]">
            <CalendarSearch size={50} className="text-gray-300" />
            <p className="text-lg text-gray-500">No tasks found</p>
          </div>
        )}

      <div>
        <h2 className="text-xl font-semibold mb-2">Due tasks</h2>
        {dueTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">On-going tasks</h2>
        {onGoingTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Completed tasks</h2>
        {completedTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskTab;
