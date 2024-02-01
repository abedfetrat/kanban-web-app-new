import { auth, db } from "@/firebase/config";
import { Column } from "@/firebase/models/Column";
import { Task } from "@/firebase/models/Task";
import {
  QuerySnapshot,
  collection,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelectedBoard } from "../providers/SelectedBoardProvider";

export function useTasks(column: Column) {
  const { selectedBoard, loading: loadingBoard } = useSelectedBoard();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscribeToTasksCollection = (
      obs: (snapshot: QuerySnapshot) => void,
    ) => {
      const uid = auth.currentUser!.uid;
      const userRef = doc(db, "users", uid);
      const boardsRef = collection(userRef, "boards");
      const boardRef = doc(boardsRef, selectedBoard!.id);
      const columnsRef = collection(boardRef, "columns");
      const columnRef = doc(columnsRef, column.id);
      const tasksRef = collection(columnRef, "tasks");

      const q = query(tasksRef);

      return onSnapshot(q, { includeMetadataChanges: true }, obs);
    };

    let unsubscribe = () => {};

    if (loadingBoard) {
      setLoading(true);
      return;
    }

    if (selectedBoard) {
      try {
        unsubscribe = subscribeToTasksCollection((snapshot) => {
          if (snapshot.metadata.hasPendingWrites) return;
          const _tasks: Task[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            _tasks.push({
              id: data.id,
              name: data.name,
              createdAt: data.createdAt,
              description: data.description,
              subtasks: data.subtasks,
              columnId: data.columnId,
            });
          });
          const tasksOrder: string[] = column.tasksOrder;
          _tasks.sort((a, b) => {
            const indexA = tasksOrder.indexOf(a.id);
            const indexB = tasksOrder.indexOf(b.id);
            return indexA - indexB;
          });
          setTasks(_tasks);
          setLoading(false);
        });
      } catch (error) {
        console.log(error);
        setError(`Error loading tasks for board "${selectedBoard.name}"`);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    return () => {
      unsubscribe();
    };
  }, [selectedBoard, loadingBoard, column]);

  return { tasks, loading, error };
}
