import { auth, db } from "@/firebase/config";
import Board from "@/firebase/models/Board";
import {
  QuerySnapshot,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subscribeToBoardsCollection = (
    obs: (snapshot: QuerySnapshot) => void,
  ) => {
    const uid = auth.currentUser!.uid;
    const userRef = doc(db, "users", uid);
    const boardsRef = collection(userRef, "boards");
    const q = query(boardsRef, orderBy("createdAt", "asc"));

    return onSnapshot(q, obs);
  };

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = subscribeToBoardsCollection((snapshot) => {
        const _boards: Board[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          _boards.push({
            id: data.id,
            name: data.name,
            createdAt: data.createdAt,
            columnsOrder: data.columnsOrder,
          });
        });
        setBoards(_boards);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      setError("Error loading boards.");
      setLoading(false);
    }
    return () => {
      unsubscribe();
    };
  }, []);

  return { boards, loading, error };
}
