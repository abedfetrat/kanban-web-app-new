import { useModal } from "@/app/providers/ModalProvider";
import OptionsMenu, { OptionsItem } from "../components/OptionsMenu";
import AddEditBoardModal from "../modals/AddEditBoardModal";
import DeleteBoardModal from "../modals/DeleteBoardModal";

export default function BoardOptionsMenu() {
  const { openModal } = useModal();
  return (
    <OptionsMenu>
      <OptionsItem
        onClick={() => openModal(AddEditBoardModal, { mode: "edit" })}
      >
        Edit board
      </OptionsItem>
      <OptionsItem
        className="text-danger"
        onClick={() => openModal(DeleteBoardModal, {})}
      >
        Delete board
      </OptionsItem>
    </OptionsMenu>
  );
}
