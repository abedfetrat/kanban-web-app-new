import Button from "@/app/components/Button";
import Modal, { BaseModalType } from "@/app/components/Modal";
import { auth, db } from "@/firebase/config";
import { Column } from "@/firebase/models/Column";
import { Task } from "@/firebase/models/Task";
import { Dialog } from "@headlessui/react";
import {
  CollectionReference,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useSelectedBoard } from "../providers/SelectedBoardProvider";

export default function DeleteBoardModal({ isOpen, onClose }: BaseModalType) {
  const { selectedBoard } = useSelectedBoard();

  const cancelButtonRef = useRef(null);

  const getBoardColumns = async (columnsRef: CollectionReference) => {
    const q = query(columnsRef, orderBy("createdAt"));
    const snapshot = await getDocs(q);

    let columns: Column[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      columns.push({
        id: data.id,
        name: data.name,
        createdAt: data.createdAt,
        boardId: data.boardId,
      });
    });

    return columns;
  };

  const getColumnTasks = async (tasksRef: CollectionReference) => {
    const q = query(tasksRef);
    const snapshot = await getDocs(q);

    let tasks: Task[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      tasks.push({
        id: data.id,
        name: data.name,
        createdAt: data.createdAt,
        description: data.description,
        subtasks: data.subtasks,
        columnId: data.columnId,
      });
    });

    return tasks;
  };

  const handleDelete = async () => {
    try {
      if (selectedBoard) {
        const uid = auth.currentUser!.uid;
        const userRef = doc(db, "users", uid);
        const boardsRef = collection(userRef, "boards");
        const boardRef = doc(boardsRef, selectedBoard.id);
        const columnsRef = collection(boardRef, "columns");

        const columns = await getBoardColumns(columnsRef);
        const batch = writeBatch(db);
        // Delete columns and associated tasks from db
        for (const col of columns) {
          const columnRef = doc(columnsRef, col.id);
          const tasksRef = collection(columnRef, "tasks");
          const tasks = await getColumnTasks(tasksRef);
          for (const task of tasks) {
            const taskRef = doc(tasksRef, task.id);
            batch.delete(taskRef);
          }
          batch.delete(columnRef);
        }
        // Delete board
        batch.delete(boardRef);
        await batch.commit();
        toast.success(`Deleted board '${selectedBoard.name}'`);
      }
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Error deleting board");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocus={cancelButtonRef}>
      <div className="mb-4 md:mb-6">
        <Dialog.Title
          as="h3"
          className="text-lg font-bold text-danger md:text-xl"
        >
          Delete this board?
        </Dialog.Title>
      </div>
      <p className="font-medium text-medium-grey">
        Are you sure you want to delete the `{selectedBoard?.name || ""}` board?
        This action will remove all columns and tasks and cannot be reversed.
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
          onClick={onClose}
          ref={cancelButtonRef}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
