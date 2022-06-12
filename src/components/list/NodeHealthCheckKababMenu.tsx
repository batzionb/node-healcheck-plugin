import * as React from "react";
import { Dropdown, DropdownItem, KebabToggle } from "@patternfly/react-core";
import { useHistory } from "react-router";
import { getNodeHealthCheckUrl } from "components/editor/url";
import { NodeHealthCheck } from "data/types";
import { ModalId } from "components/modals/Modals";
import { useModals } from "components/modals/ModalsContext";
import { getName, getPauseRequests } from "data/selectors";

const modalLabels = {
  [ModalId.PAUSE]: "Pause NodeHealthCheck",
  [ModalId.UNPAUSE]: "Unpause NodeHealthCheck",
  [ModalId.EDIT_PAUSE]: "Edit Pause NodeHealthCheck",
  [ModalId.DELETE]: "Delete NodeHealthCheck",
};

const NodeHealthCheckKababMenu = ({ obj }: { obj: NodeHealthCheck }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const modalContext = useModals();
  const history = useHistory();

  const getModalIds = (): ModalId[] => {
    let res: ModalId[] = [];
    let pauseRequests = getPauseRequests(obj);
    if (pauseRequests && pauseRequests.length > 0) {
      res = [ModalId.EDIT_PAUSE, ModalId.UNPAUSE];
    } else {
      res = [ModalId.PAUSE];
    }
    res.push(ModalId.DELETE);
    return res;
  };

  const onToggle = (isOpen) => {
    setIsOpen(isOpen);
  };

  const onSelect = () => {
    setIsOpen(!isOpen);
    onFocus();
  };

  const onFocus = () => {
    const element = document.getElementById("toggle-id-6");
    element.focus();
  };

  const onEdit = () => {
    const url = `${getNodeHealthCheckUrl(getName(obj))}/edit`;
    history.push(url);
  };

  const getDropdownItems = () => {
    const items = [
      <DropdownItem key="edit" onClick={onEdit}>
        Edit NodeHealthCheck
      </DropdownItem>,
    ];
    for (const modalId of getModalIds()) {
      items.push(
        <DropdownItem
          key={modalId}
          onClick={() => modalContext.openModal(modalId, obj)}
        >
          {modalLabels[modalId]}
        </DropdownItem>
      );
    }
    return items;
  };

  return (
    <>
      <Dropdown
        onSelect={onSelect}
        toggle={<KebabToggle onToggle={onToggle} id="toggle-id-6" />}
        isOpen={isOpen}
        isPlain
        dropdownItems={getDropdownItems()}
        position="right"
      />
    </>
  );
};

export default NodeHealthCheckKababMenu;
