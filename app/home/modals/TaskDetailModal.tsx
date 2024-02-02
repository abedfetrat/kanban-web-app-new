import Modal, { BaseModalType } from "@/app/components/Modal";
import { auth, db } from "@/firebase/config";
import { Column } from "@/firebase/models/Column";
import { Subtask } from "@/firebase/models/Subtask";
import { Task } from "@/firebase/models/Task";
import { Dialog } from "@headlessui/react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Dropdown from "../../components/Dropdown";
import { useModal } from "../../providers/ModalProvider";
import OptionsMenu, { OptionsItem } from "../components/OptionsMenu";
import { useColumns } from "../hooks/useColumns";
import { useTasks } from "../hooks/useTasks";
import { useSelectedBoard } from "../providers/SelectedBoardProvider";
import DeleteTaskModal from "./DeleteTaskModal";

type TaskDetailModalType = BaseModalType & {
  taskId: string;
  column: Column;
};

export default function TaskDetailModal({
  isOpen,
  onClose,
  taskId,
  column,
}: TaskDetailModalType): React.ReactElement {
  const { selectedBoard } = useSelectedBoard();
  const { columns } = useColumns();
  const { tasks } = useTasks(column);
  const [task, setTask] = useState<Task>({} as Task);
  const numCompletedSubtasks = useMemo(() => {
    if (task && task.subtasks) {
      return task.subtasks.filter((t) => t.completed).length;
    }
    return 0;
  }, [task]);

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
    }
  }, [tasks, taskId]);

  const handleSubtaskCompletionChange = async (
    subtaskId: string,
    completed: boolean,
  ) => {
    try {
      const boardId = selectedBoard!.id;
      const uid = auth.currentUser!.uid;
      const taskRef = doc(
        db,
        `users/${uid}/boards/${boardId}/columns/${column.id}/tasks/`,
        taskId,
      );

      const updatedSubtasks = task.subtasks.map((subtask) => {
        if (subtask.id === subtaskId) {
          subtask.completed = completed;
        }
        return subtask;
      });

      return updateDoc(taskRef, { subtasks: updatedSubtasks });
    } catch (error) {
      console.log(error);
      toast.error("Could not change completion");
    }
  };

  const handleColumnSelectionChange = async (newColumn: Column) => {
    if (newColumn.id === column.id) return;

    try {
      const uid = auth.currentUser!.uid;
      const userRef = doc(db, "users", uid);
      const boardsRef = collection(userRef, "boards");
      const boardRef = doc(boardsRef, selectedBoard!.id);
      const columnsRef = collection(boardRef, "columns");

      const oldColumnRef = doc(columnsRef, column.id);
      const oldTasksRef = collection(oldColumnRef, "tasks");
      const oldTaskRef = doc(oldTasksRef, task.id);

      const newColumnRef = doc(columnsRef, newColumn.id);
      const newTasksRef = collection(newColumnRef, "tasks");
      const newTaskRef = doc(newTasksRef);

      const batch = writeBatch(db);
      batch.set(newTaskRef, {
        ...task,
        id: newTaskRef.id,
        subtasks: task.subtasks,
      });
      batch.delete(oldTaskRef);
      // Delete taskId from old column tasks order array
      batch.update(oldColumnRef, {
        tasksOrder: arrayRemove(task.id),
      });
      // Add taskId to new column tasks order array
      batch.update(newColumnRef, {
        tasksOrder: arrayUnion(newTaskRef.id),
      });

      await batch.commit();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Could not change status");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mb-4 flex items-center justify-between gap-x-4 md:mb-6">
        <Dialog.Title as="h3" className="text-lg font-bold md:text-xl">
          {task.name}
        </Dialog.Title>
        <TaskOptionsMenu column={column} task={task} />
      </div>
      <p className="text-sm font-medium text-medium-grey md:text-base">
        {task.description}
      </p>
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-bold md:text-base">
            Subtasks {numCompletedSubtasks} of {task.subtasks.length}
          </p>
          <div className="mt-4 flex flex-col gap-y-2">
            {task.subtasks.map((subtask) => (
              <Subtask
                key={subtask.id}
                subtask={subtask}
                onCompletionChanged={handleSubtaskCompletionChange}
              />
            ))}
          </div>
        </div>
      )}
      <Dropdown
        className="mb-3 mt-6"
        label="Current status"
        options={columns}
        selectedOption={column}
        onOptionChange={handleColumnSelectionChange}
        mapOptionToLabel={(option) => option.name}
        mapOptionToId={(option) => option.id}
      />
    </Modal>
  );
}

function Subtask({
  subtask,
  onCompletionChanged,
}: {
  subtask: Subtask;
  onCompletionChanged: (subtaskId: string, completed: boolean) => void;
}) {
  return (
    <div className="rounded-md bg-light-grey p-3 dark:bg-very-dark-grey">
      <label
        className={`flex items-center gap-x-4 text-sm font-bold md:text-base ${
          subtask.completed && "text-medium-grey line-through"
        }`}
      >
        <input
          type="checkbox"
          checked={subtask.completed}
          onChange={(e) => onCompletionChanged(subtask.id, e.target.checked)}
          className="rounded-[4px] text-primary focus:ring-primary"
        />
        {subtask.name}
      </label>
    </div>
  );
}

function TaskOptionsMenu({ column, task }: { column: Column; task: Task }) {
  const { openModal } = useModal();

  return (
    <OptionsMenu>
      <OptionsItem>Edit task</OptionsItem>
      <OptionsItem
        className="text-danger"
        onClick={() => openModal(DeleteTaskModal, { task, column })}
      >
        Delete task
      </OptionsItem>
    </OptionsMenu>
  );
}
