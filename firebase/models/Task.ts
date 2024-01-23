import { FieldValue } from "firebase/firestore";
import { Subtask } from "./Subtask";

export interface Task {
  id: string;
  name: string;
  createdAt?: FieldValue;
  description: string;
  subtasks: Subtask[];
  columnId: string;
}
