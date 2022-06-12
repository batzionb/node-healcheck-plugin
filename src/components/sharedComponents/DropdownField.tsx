import * as React from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  FormGroup,
} from "@patternfly/react-core";
import { useField } from "formik";
import { getFieldId } from "../copiedFromConsole/formik-fields/field-utils";

import "./DropdownField.css";

type SelectItem = {
  label: string;
  value: string;
};

const isReactElement = (
  item: SelectItem | React.ReactElement
): item is React.ReactElement => {
  return "props" in item;
};

export type DropdownFieldProps = {
  name: string;
  label?: string;
  isRequired?: boolean;
  items: (SelectItem | React.ReactElement)[];
};

const DropdownField: React.FC<DropdownFieldProps> = ({
  name,
  label,
  isRequired = false,
  items,
}) => {
  const [{ value }, , { setValue }] = useField(name);
  const [isOpen, setIsOpen] = React.useState(false);
  const fieldId = getFieldId(name, "dropdown");

  const onToggle = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  const onSelect = () => {
    setIsOpen(false);
  };

  const getDropdownItems = () => {
    return items.map((item, idx) => {
      if (isReactElement(item)) {
        return item;
      }
      return (
        <DropdownItem key={idx} onClick={() => setValue(item.value)}>
          {item.label}
        </DropdownItem>
      );
    });
  };

  const getToggleLabel = () => {
    const selectItem = items.find(
      (item) => !isReactElement(item) && item.value === value
    ) as SelectItem;
    if (selectItem) {
      return selectItem.label;
    }
    return value;
  };

  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      isRequired={isRequired}
      className="dropdown-field"
    >
      <Dropdown
        toggle={
          <DropdownToggle onToggle={onToggle}>
            {getToggleLabel()}
          </DropdownToggle>
        }
        onSelect={onSelect}
        isOpen={isOpen}
        dropdownItems={getDropdownItems()}
      />
    </FormGroup>
  );
};

export default DropdownField;
