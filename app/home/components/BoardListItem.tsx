import Board from "@/firebase/models/Board";
import { forwardRef } from "react";
import BoardIcon from "./BoardIcon";

type BoardListItemProps = {
  board: Board;
  isSelected?: boolean;
  onClick: () => void;
};

const BoardListItem = forwardRef<HTMLLIElement, BoardListItemProps>(
  function BoardListItem(
    { board, isSelected, onClick }: BoardListItemProps,
    ref,
  ) {
    const variant = isSelected
      ? "bg-primary text-white"
      : "hocus:bg-primary-hover/10 hocus:text-primary dark:hocus:bg-white dark:hocus:text-primary";
    return (
      <li ref={ref}>
        <button
          className={`${variant} flex w-full items-center gap-x-4 rounded-r-full px-6 py-4 font-bold transition-colors`}
          onClick={onClick}
        >
          <BoardIcon />
          <span className="truncate">{board.name}</span>
        </button>
      </li>
    );
  },
);

export default BoardListItem;
