import Board from "@/firebase/models/Board";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useBoards } from "../hooks/useBoards";

const STORAGE_KEY = "selectedBoard";

type SelectedBoardContextType = {
  selectedBoard: Board | null;
  selectBoard: (id: string) => void;
  loading: boolean;
};

const SelectedBoardContext = createContext<SelectedBoardContextType>({
  selectedBoard: null,
  selectBoard: () => {},
  loading: false,
});

export default function SelectedBoardProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { boards, loading: loadingBoards } = useBoards();
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loadingBoards) {
      setLoading(true);
      return;
    }

    const board = boards.find((b) => b.id === selectedBoardId);
    if (board) {
      setSelectedBoard(board);
    } else {
      setSelectedBoard(boards[0]);
    }
    setLoading(false);
  }, [selectedBoardId, boards, loadingBoards]);

  const selectBoard = (id: string) => {
    setSelectedBoardId(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  return (
    <SelectedBoardContext.Provider
      value={{
        selectedBoard: selectedBoard,
        selectBoard: selectBoard,
        loading: loading,
      }}
    >
      {children}
    </SelectedBoardContext.Provider>
  );
}

export function useSelectedBoard() {
  return useContext(SelectedBoardContext);
}
