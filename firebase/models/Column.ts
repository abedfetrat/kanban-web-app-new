import { FieldValue } from "firebase/firestore";

export interface Column {
  id: string;
  name: string;
  createdAt?: FieldValue;
  boardId: string;
}
