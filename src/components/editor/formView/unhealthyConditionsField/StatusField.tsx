import DropdownField from "components/sharedComponents/DropdownField";
import { UnhealthyConditionStatus } from "data/types";
import * as React from "react";
import { UnhealthyConditionFieldProps } from "./propTypes";

const StatusOptions = [
  {
    label: "True",
    value: UnhealthyConditionStatus.True,
  },
  {
    label: "False",
    value: UnhealthyConditionStatus.False,
  },
  {
    label: "Unknown",
    value: UnhealthyConditionStatus.Unknown,
  },
];

const StatusField: React.FC<UnhealthyConditionFieldProps> = ({
  name,
  showLabel,
  idx,
}) => {
  return (
    <DropdownField
      name={name}
      label={showLabel ? "Status" : null}
      isRequired
      items={StatusOptions}
    ></DropdownField>
  );
};

export default StatusField;
