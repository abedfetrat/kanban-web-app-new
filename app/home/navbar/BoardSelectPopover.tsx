import ThemeToggle from "@/app/components/ThemeToggle";
import { useModal } from "@/app/providers/ModalProvider";
import { auth } from "@/firebase/config";
import Board from "@/firebase/models/Board";
import { Popover, Transition } from "@headlessui/react";
import Image from "next/image";
import { ComponentPropsWithoutRef, Fragment, useEffect, useRef } from "react";
import BoardIcon from "../components/BoardIcon";
import BoardListItem from "../components/BoardListItem";
import LogOutIcon from "../components/LogOutIcon";
import { useBoards } from "../hooks/useBoards";
import AddEditBoardModal from "../modals/AddEditBoardModal";
import { useSelectedBoard } from "../providers/SelectedBoardProvider";

export default function BoardSelectPopover(
  props: ComponentPropsWithoutRef<"div">,
) {
  const { selectedBoard } = useSelectedBoard();

  return (
    <Popover className="relative w-full min-w-0 md:hidden">
      <Popover.Button className="flex w-full min-w-0 max-w-fit items-center gap-x-3 text-lg font-bold leading-tight">
        <span className="truncate">
          {selectedBoard ? selectedBoard.name : "Select board"}
        </span>
        <Image
          className="ui-open:rotate-180 ui-open:transform"
          src="images/icon-chevron-down.svg"
          width={10}
          height={7}
          alt=""
        />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Popover.Overlay className="fixed inset-0 bg-black/25" />
      </Transition>
      <Transition
        as={Fragment}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <div className="fixed inset-0 z-10 pb-3 pl-[56px] pr-4 pt-[88px]">
          <Popover.Panel className="flex max-h-full w-full min-w-[264px] max-w-fit flex-col rounded-lg bg-white font-bold text-medium-grey dark:bg-dark-grey">
            {({ open, close }) => (
              <>
                <BoardList isPopoverOpen={open} onClosePopover={close} />
                <div>
                  <div className="relative p-4 pb-0">
                    <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-medium-grey/15 to-medium-grey/0 dark:from-very-dark-grey/45 dark:to-very-dark-grey/0"></div>
                    <ThemeToggle />
                  </div>
                  <div className="px-4 py-6">
                    <button
                      onClick={() => auth.signOut()}
                      className="flex items-center gap-x-3"
                    >
                      <LogOutIcon />
                      Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </Popover.Panel>
        </div>
      </Transition>
    </Popover>
  );
}

function BoardList({
  isPopoverOpen,
  onClosePopover,
}: {
  isPopoverOpen: boolean;
  onClosePopover: () => void;
}) {
  const { openModal } = useModal();
  const { selectedBoard, selectBoard } = useSelectedBoard();
  const { boards } = useBoards();
  const selectedItemRef = useRef<HTMLElement | null>(null);

  const scrollSelectedListItemToView = () => {
    selectedItemRef.current?.scrollIntoView({
      block: "center",
      behavior: "instant",
    });
  };

  useEffect(() => {
    if (isPopoverOpen && selectedBoard) {
      scrollSelectedListItemToView();
    }
  });

  return (
    <div className="flex-1 overflow-y-auto pb-4 font-bold text-medium-grey">
      <div className="px-6 py-4 text-sm uppercase tracking-[2.4px]">
        All Boards ({boards.length})
      </div>
      <ul className="pr-6">
        {boards.map((board: Board) => {
          const isSelected = board.id === selectedBoard?.id;
          return (
            <BoardListItem
              key={board.id}
              board={board}
              isSelected={isSelected}
              onClick={() => {
                selectBoard(board.id);
                onClosePopover();
              }}
              ref={(node) => {
                if (!isSelected) return;
                if (node) {
                  selectedItemRef.current = node;
                } else {
                  selectedItemRef.current = null;
                }
              }}
            />
          );
        })}
        <li>
          <button
            className="flex w-full items-center gap-x-4 rounded-r-full px-6 py-4 font-bold text-primary transition-colors hocus:bg-primary-hover/10 hocus:text-primary dark:hocus:bg-white dark:hocus:text-primary"
            onClick={() => openModal(AddEditBoardModal, { mode: "add" })}
          >
            <BoardIcon />
            <span>+ Create New Board</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
