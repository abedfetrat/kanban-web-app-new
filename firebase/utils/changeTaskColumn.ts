import {
  CollectionReference,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../config";
import { Task } from "../models/Task";

export default function changeTaskColumn(
  task: Task,
  oldColumnId: string,
  newColumnId: string,
  columnsRef: CollectionReference,
) {
  const oldColumnRef = doc(columnsRef, oldColumnId);
  const oldTaskRef = doc(oldColumnRef, "tasks", task.id);

  const newColumnRef = doc(columnsRef, newColumnId);
  const newTasksRef = collection(newColumnRef, "tasks");
  const newTaskRef = doc(newTasksRef);

  const batch = writeBatch(db);
  batch.set(newTaskRef, {
    ...task,
    id: newTaskRef.id,
    subtasks: task.subtasks,
    columnId: newColumnId,
  });
  batch.delete(oldTaskRef);
  // Remove task id from tasks order array of old column
  batch.update(oldColumnRef, {
    tasksOrder: arrayRemove(task.id),
  });
  // Add task id to tasks order array of new column
  batch.update(newColumnRef, {
    tasksOrder: arrayUnion(newTaskRef.id),
  });

  return batch.commit();
}
