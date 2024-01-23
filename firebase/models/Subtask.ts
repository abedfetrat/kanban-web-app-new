import { FieldValue } from "firebase/firestore";

export interface Subtask {
  id: string;
  name: string;
  createdAt?: FieldValue;
  completed: boolean;
}
