import { FieldValue } from "firebase/firestore";

export default interface Board {
  id: string;
  name: string;
  createdAt?: FieldValue;
}
