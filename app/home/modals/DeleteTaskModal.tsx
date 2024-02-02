import Button from "@/app/components/Button";
import Modal, { BaseModalType } from "@/app/components/Modal";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";
import TaskDetailModal from "./TaskDetailModal";
import { useSelectedBoard } from "../providers/SelectedBoardProvider";
import { useModal } from "@/app/providers/ModalProvider";
import { Task } from "@/firebase/models/Task";
import { Column } from "@/firebase/models/Column";
import { auth, db } from "@/firebase/config";
import { arrayRemove, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { useRef } from "react";

type TaskDetailModalProps = BaseModalType & {
  task: Task;
  column: Column;
};

export default function DeleteTaskModal({
  isOpen,
  onClose,
  task,
  column,
}: TaskDetailModalProps) {
  const { selectedBoard } = useSelectedBoard();
  const { openModal } = useModal();
  
  const cancelButtonRef = useRef(null);

  const handleDelete = async () => {
    if (!selectedBoard) return;
    try {
      const boardId = selectedBoard.id;
      const uid = auth.currentUser!.uid;
      const columnRef = doc(
        db,
        `users/${uid}/boards/${boardId}/columns/`,
        column.id,
      );
      const taskRef = doc(db, `${columnRef.path}/tasks/`, task.id);

      const batch = writeBatch(db);
      batch.delete(taskRef);
      batch.update(columnRef, {
        tasksOrder: arrayRemove(task.id),
      });

      await batch.commit();

      onClose();
      toast.success(`Deleted task '${task.name}'`);
    } catch (error) {
      console.log(error);
      toast("Could not delete task");
    }
  };

  const handleCancel = () => {
    openModal(TaskDetailModal, { column: column, taskId: task.id });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocus={cancelButtonRef}>
      <div className="mb-4 md:mb-6">
        <Dialog.Title
          as="h3"
          className="text-lg font-bold text-danger md:text-xl"
        >
          Delete this task?
        </Dialog.Title>
      </div>
      <p className="font-medium text-medium-grey">
        Are you sure you want to delete the `{task.name}` task and its subtasks?
        This action cannot be reversed.
      </p>
      <div className="mt-6 flex flex-col gap-4 md:flex-row">
        <Button
          color="danger"
          size="large"
          className="w-full"
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button
          color="secondary"
          size="large"
          className="w-full"
          onClick={handleCancel}
          ref={cancelButtonRef}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
