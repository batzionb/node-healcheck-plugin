import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import { MultiSelectOption } from "components/sharedComponents/field-types";
import * as _ from "lodash";
import * as React from "react";
import MultiSelectField from "../../../sharedComponents/MultiSelectField";
import { getObjectLabelDisplayNames } from "./utils";

const LabelsSelector: React.FC<{ objects: K8sResourceCommon[] }> = ({
  objects,
}) => {
  const nodeLabelOptions: string[] = Array.from(
    new Set(
      _.flatten(objects.map((object) => getObjectLabelDisplayNames(object)))
    )
  );
  const multiSelectOptions = nodeLabelOptions.map<MultiSelectOption>(
    (value) => ({
      isLastOptionBeforeFooter: (index: number): boolean =>
        index === value.length,
      id: value,
      value: value,
      displayName: value,
    })
  );

  return (
    <MultiSelectField
      name="formData.selector"
      label="Labels matching nodes"
      placeholderText="app=frontend"
      helpText="Select nodes by choosing labels"
      options={multiSelectOptions}
    />
  );
};

export default LabelsSelector;
