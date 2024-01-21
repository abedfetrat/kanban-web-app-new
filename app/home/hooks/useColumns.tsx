import { auth, db } from "@/firebase/config";
import { Column } from "@/firebase/models/Column";
import {
  QuerySnapshot,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelectedBoard } from "../providers/SelectedBoardProvider";

export function useColumns() {
  const { selectedBoard, loading: loadingBoard } = useSelectedBoard();
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subscribeToColumnsCollection = (
      obs: (snapshot: QuerySnapshot) => void,
    ) => {
      const uid = auth.currentUser!.uid;
      const userRef = doc(db, "users", uid);
      const boardsRef = collection(userRef, "boards");
      const boardRef = doc(boardsRef, selectedBoard!.id);
      const columnsRef = collection(boardRef, "columns");
      const q = query(columnsRef, orderBy("createdAt"));

      return onSnapshot(q, obs);
    };

    let unsubscribe = () => {};

    if (loadingBoard) {
      setLoading(true);
      return;
    }

    if (selectedBoard) {
      try {
        unsubscribe = subscribeToColumnsCollection((snapshot) => {
          const _columns: Column[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            _columns.push({
              id: data.id,
              name: data.name,
              createdAt: data.createdAt,
              boardId: data.boardId,
            });
          });
          setColumns(_columns);
          setLoading(false);
        });
      } catch (error) {
        console.log(error);
        setError(`Error loading columns for board "${selectedBoard.name}"`);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    return () => {
      unsubscribe();
    };
  }, [selectedBoard, loadingBoard]);

  return { columns, loading, error };
}
