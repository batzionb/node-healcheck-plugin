import * as React from "react";
import DeleteModal from "./DeleteModal";
import EditPauseModal from "./EditPauseModal";
import { useModals } from "./ModalsContext";
import PauseModal from "./PauseModal";
import { UnpauseModal } from "./UnpauseModal";

export enum ModalId {
  PAUSE = 0,
  UNPAUSE = 1,
  EDIT_PAUSE = 2,
  DELETE = 3,
}

const Modals: React.FC = () => {
  const modalsContext = useModals();
  if (!modalsContext.getNodeHealthCheck()) {
    return null;
  }
  return (
    <>
      {modalsContext.isOpen(ModalId.PAUSE) && (
        <PauseModal
          isOpen={modalsContext.isOpen(ModalId.PAUSE)}
          onClose={modalsContext.closeModal}
          nodeHealthCheck={modalsContext.getNodeHealthCheck()}
        />
      )}
      {modalsContext.isOpen(ModalId.EDIT_PAUSE) && (
        <EditPauseModal
          isOpen={modalsContext.isOpen(ModalId.EDIT_PAUSE)}
          onClose={modalsContext.closeModal}
          nodeHealthCheck={modalsContext.getNodeHealthCheck()}
        />
      )}
      {modalsContext.isOpen(ModalId.UNPAUSE) && (
        <UnpauseModal
          isOpen={modalsContext.isOpen(ModalId.UNPAUSE)}
          onClose={modalsContext.closeModal}
          nodeHealthCheck={modalsContext.getNodeHealthCheck()}
        />
      )}
      {modalsContext.isOpen(ModalId.DELETE) && (
        <DeleteModal
          isOpen={modalsContext.isOpen(ModalId.DELETE)}
          onClose={modalsContext.closeModal}
          nodeHealthCheck={modalsContext.getNodeHealthCheck()}
        />
      )}
    </>
  );
};

export default Modals;
