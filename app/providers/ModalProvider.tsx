import { ComponentType, createContext, useContext, useState } from "react";
import { BaseModalType } from "../components/Modal";

type OpenModalFnType = <T extends BaseModalType>(
  modalComponent: ComponentType<T>,
  props: Omit<T, "isOpen" | "onClose">,
) => void;

type ModalContextType = {
  isModalOpen: boolean;
  openModal: OpenModalFnType;
};

const ModalContext = createContext<ModalContextType>({} as ModalContextType);

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalComponent, setModalComponent] = useState<JSX.Element | null>(
    null,
  );

  const handleOpenModal: OpenModalFnType = (
    Component: ComponentType<any>,
    props?: {},
  ) => {
    setIsOpen(true);
    setModalComponent(<Component {...props} />);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider
      value={{ isModalOpen: isOpen, openModal: handleOpenModal }}
    >
      {modalComponent && (
        <modalComponent.type
          {...modalComponent.props}
          isOpen={isOpen}
          onClose={handleCloseModal}
        />
      )}
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext was used outside of its Provider");
  }
  return context;
}
