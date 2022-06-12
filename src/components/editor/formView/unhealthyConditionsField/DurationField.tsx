import { FormGroup, Flex, FlexItem } from "@patternfly/react-core";
import { getFieldId } from "components/copiedFromConsole/formik-fields/field-utils";
import DropdownField from "components/sharedComponents/DropdownField";
import { getObjectItemFieldName } from "components/sharedComponents/formik-utils";
import InputField from "components/sharedComponents/InputField";
import PopoverIcon from "components/sharedComponents/PopoverIcon";
import { TimeUnit } from "data/types";
import * as React from "react";
import { UnhealthyConditionFieldProps } from "./propTypes";

const UnitOptions = [
  {
    label: "Nano Seconds",
    value: TimeUnit.NanoSecond,
  },
  {
    label: "Milli Seconds",
    value: TimeUnit.MilliSecond,
  },
  {
    label: "Seconds",
    value: TimeUnit.Second,
  },
  {
    label: "Minutes",
    value: TimeUnit.Minute,
  },
  {
    label: "Hours",
    value: TimeUnit.Hour,
  },
];

const icon = (
  <PopoverIcon
    noVerticalAlign
    bodyContent="The amount of time that needs to pass with the selected condition before remediation occurs."
  />
);

const DurationField: React.FC<UnhealthyConditionFieldProps> = ({
  name,
  showLabel,
}) => {
  return (
    <FormGroup
      labelIcon={showLabel ? icon : null}
      fieldId={getFieldId("duration", "input")}
      label={showLabel ? "Duration" : null}
      isRequired
    >
      <Flex>
        <FlexItem
          className="unhealthy-condition-duration-number"
          flex={{ default: "flex_1" }}
        >
          <InputField
            name={getObjectItemFieldName([name, "number"])}
          ></InputField>
        </FlexItem>
        <FlexItem flex={{ default: "flex_2" }}>
          <DropdownField
            items={UnitOptions}
            name={getObjectItemFieldName([name, "units"])}
          />
        </FlexItem>
      </Flex>
    </FormGroup>
  );
};

export default DurationField;
