import React, { useMemo } from "react";
import { Button } from "../ui/button";

import { CalendarSearch, PlusCircle } from "lucide-react";

import TaskItem from "../task/TaskItem";

import { useCurrentSavedJob } from "@/stores/useCurrentSavedJob";
import { useModal } from "@/stores/useModal";

const TaskTab = () => {
  const { currentSavedJob, setCurrentSavedJob } = useCurrentSavedJob();
  const { onOpen } = useModal();
  const tasks = currentSavedJob?.tasks || [];
  const jobId = currentSavedJob?.id.toString();

  const dueTasks = useMemo(
    () =>
      tasks.filter(
        (task) => !task.is_completed && new Date(task.due_date) < new Date()
      ),
    [tasks]
  );

  const onGoingTasks = useMemo(
    () =>
      tasks.filter(
        (task) => !task.is_completed && new Date(task.due_date) >= new Date()
      ),
    [tasks]
  );

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.is_completed),
    [tasks]
  );

  return (
    <div>
      <div className="font-semibold flex items-center">
        <p className="text-lg">Tasks: {tasks.length}</p>
        <Button
          variant="primary"
          className="ml-auto"
          onClick={() => onOpen("createTask", { jobId })}
        >
          <PlusCircle size={20} className="mr-2" />
          Add task
        </Button>
      </div>
      <hr className="mt-4 mb-5 border-[#d6eaff]" />

      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-3 min-h-[200px]">
          <CalendarSearch size={50} className="text-gray-300" />
          <p className="text-lg text-gray-500">No tasks found</p>
        </div>
      )}

      {dueTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Due tasks</h2>
          {dueTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}

      {onGoingTasks.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">On-going tasks</h2>
          {onGoingTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Completed tasks</h2>
          {completedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskTab;
