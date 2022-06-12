import * as React from "react";
import CustomTypeModal from "./CustomTypeModal";
import DropdownField from "components/sharedComponents/DropdownField";
import { UnhealthyConditionFieldProps } from "./propTypes";
import { useField } from "formik";
import { DropdownItem, DropdownSeparator } from "@patternfly/react-core";

const TypeOptions = [
  {
    label: "Disk pressure",
    value: "DiskPressure",
  },
  {
    label: "Memory pressure",
    value: "MemoryPressure",
  },
  {
    label: "Network unavailable",
    value: "NetworkUnavailable",
  },
  {
    label: "PID pressure",
    value: "PIDPressure",
  },
  {
    label: "Ready",
    value: "Ready",
  },
];

const TypeSelectField: React.FC<UnhealthyConditionFieldProps> = ({
  name,
  showLabel,
}) => {
  const [customTypeModalOpen, setCustomTypeModalOpen] =
    React.useState<boolean>(false);

  const [, , { setValue }] = useField(name);
  const dropdownItems = TypeOptions.map((option, idx) => (
    <DropdownItem key={idx} onClick={() => setValue(option.value)}>
      {option.label}
    </DropdownItem>
  ));

  dropdownItems.push(<DropdownSeparator key="type-field-separator" />);
  dropdownItems.push(
    <DropdownItem
      key="use-custom-type"
      onClick={() => setCustomTypeModalOpen(true)}
    >
      Use Custom Type
    </DropdownItem>
  );
  return (
    <>
      <DropdownField
        name={name}
        label={showLabel ? "Type" : null}
        isRequired={false}
        items={dropdownItems}
      ></DropdownField>
      <CustomTypeModal
        fieldName={name}
        onClose={() => setCustomTypeModalOpen(false)}
        isOpen={customTypeModalOpen}
      />
    </>
  );
};

export default TypeSelectField;
