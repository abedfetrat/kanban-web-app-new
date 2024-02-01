import { useModal } from "@/app/providers/ModalProvider";
import { useMemo } from "react";
import { Task } from "@/firebase/models/Task";
import { Column } from "@/firebase/models/Column";
import TaskDetailModal from "../modals/TaskDetailModal";

export default function TaskItem({
  task,
  column,
}: {
  task: Task;
  column: Column;
}) {
  const { openModal } = useModal();

  const numCompletedSubtasks = useMemo(
    () => task.subtasks.filter((t) => t.completed).length,
    [task],
  );
  const numSubtasks = task.subtasks.length;

  return (
    <li>
      <button
        onClick={() =>
          openModal(TaskDetailModal, { taskId: task.id, column: column })
        }
        className="w-full rounded-lg bg-white px-4 py-6 text-start shadow-surface-light outline-none hocus:text-primary dark:bg-dark-grey dark:shadow-surface-dark"
      >
        <h4 className="font-bold transition-colors">{task.name}</h4>
        <p className="mt-2 text-xs font-bold text-medium-grey">
          {numCompletedSubtasks} of {numSubtasks} subtasks
        </p>
      </button>
    </li>
  );
}
