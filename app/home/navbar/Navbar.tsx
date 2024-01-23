import Skeleton from "@/app/components/Skeleton";
import Image from "next/image";
import { useColumns } from "../hooks/useColumns";
import { useSelectedBoard } from "../providers/SelectedBoardProvider";
import AddTaskButton from "./AddTaskButton";
import BoardOptionsMenu from "./BoardOptionsMenu";
import BoardSelectPopover from "./BoardSelectPopover";
import LogoContainer from "./LogoContainer";
import { useModal } from "@/app/providers/ModalProvider";
import AddEditTaskModal from "../modals/AddEditTaskModal";

export default function Navbar() {
  const { selectedBoard, loading } = useSelectedBoard();
  const { columns } = useColumns();
  const { openModal } = useModal();

  const shouldDisableAddTaskButton = !columns || columns.length === 0;

  return (
    <header className="relative flex min-h-[76px] border-light-border bg-white dark:border-dark-border dark:bg-dark-grey md:min-h-[90px] md:border-b-2">
      <LogoContainer />
      <div className="flex w-full items-center gap-x-4 px-4 py-5 desktop:px-8 desktop:pb-7">
        <Image
          src="/images/logo-mobile.svg"
          width={24}
          height={25}
          alt="kanaban logo"
          className="min-w-[24px] md:hidden"
        />
        {loading ? (
          <Skeleton className="h-7 w-32 md:hidden" />
        ) : (
          <BoardSelectPopover className="md:hidden" />
        )}
        {loading ? (
          <Skeleton className="hidden h-7 w-32 md:block" />
        ) : (
          <h1 className="hidden text-xl font-bold md:block desktop:text-2xl">
            {selectedBoard ? selectedBoard.name : "Select a board"}
          </h1>
        )}
        <div className="flex flex-grow items-center justify-end gap-x-4">
          {loading ? (
            <>
              <Skeleton className="h-7 w-12 justify-end rounded-3xl md:w-40" />
              <Skeleton className="h-7 w-3 justify-end md:w-4" />
            </>
          ) : (
            selectedBoard && (
              <>
                <AddTaskButton
                  disabled={shouldDisableAddTaskButton}
                  onClick={() => openModal(AddEditTaskModal, { mode: "add" })}
                />
                <BoardOptionsMenu />
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
