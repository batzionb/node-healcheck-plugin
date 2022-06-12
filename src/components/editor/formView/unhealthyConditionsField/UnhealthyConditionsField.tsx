import * as React from "react";
import {
  FlexItem,
  Flex,
  TextVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";
import { ArrayHelpers, FieldArray, useField } from "formik";
import {
  getArrayItemName,
  getObjectItemFieldName,
} from "components/sharedComponents/formik-utils";
import { FormViewFieldProps } from "../propTypes";
import {
  FormDataUnhealthyCondition,
  UnhealthyConditionStatus,
} from "data/types";
import { WithRemoveButton } from "components/sharedComponents/WithRemoveButton";
import AddMoreButton from "components/sharedComponents/AddMoreButton";
import TypeSelectField from "./TypeField";
import "./unhealthyConditions.css";
import DurationField from "./DurationField";
import StatusField from "./StatusField";

const AddUnhealthyCondition: React.FC<{
  onPush: ArrayHelpers["push"];
}> = ({ onPush }) => {
  return (
    <AddMoreButton
      onClick={() =>
        onPush({
          duration: {
            number: "",
            units: "ms",
          },
          status: UnhealthyConditionStatus.False,
          type: "Ready",
        })
      }
    />
  );
};

const UnhealthyCondition: React.FC<{
  fieldName: string;
  onRemove: () => void;
  idx: number;
}> = ({ fieldName, idx }) => {
  const showLabel = idx === 0; //show the column names only for the first row
  return (
    <Flex spacer={{ default: "spacerXl" }}>
      <FlexItem flex={{ default: "flex_1" }}>
        <TypeSelectField
          name={getObjectItemFieldName([fieldName, "type"])}
          showLabel={showLabel}
          idx={idx}
        ></TypeSelectField>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <StatusField
          name={getObjectItemFieldName([fieldName, "status"])}
          showLabel={showLabel}
          idx={idx}
        ></StatusField>
      </FlexItem>
      <FlexItem flex={{ default: "flex_1" }}>
        <DurationField
          name={`${getObjectItemFieldName([fieldName, "duration"])}`}
          showLabel={showLabel}
          idx={idx}
        ></DurationField>
      </FlexItem>
    </Flex>
  );
};

export const UnhealthyConditionArray: React.FC<{
  fieldName: string;
}> = ({ fieldName }) => {
  const [{ value }] = useField<FormDataUnhealthyCondition[]>(fieldName);
  if (!value) {
    return null;
  }
  return (
    <FieldArray
      name={fieldName}
      validateOnChange={false}
      render={({ push, remove }) => (
        <>
          {value.map((currentValue, idx) => {
            return (
              <WithRemoveButton
                onClick={() => remove(idx)}
                isDisabled={value.length === 1}
                key={idx}
              >
                <UnhealthyCondition
                  key={getArrayItemName(fieldName, idx)}
                  fieldName={getArrayItemName(fieldName, idx)}
                  onRemove={() => remove(idx)}
                  idx={idx}
                />
              </WithRemoveButton>
            );
          })}

          <AddUnhealthyCondition onPush={push} />
        </>
      )}
    ></FieldArray>
  );
};

const UnhealthyConditionsField = ({ fieldName }: FormViewFieldProps) => {
  return (
    <>
      <TextContent>
        <Text component={TextVariants.h3}>Unhealthy conditions</Text>
        <Text component={TextVariants.small}>
          Nodes that meet any of these conditions for a certain amount of time
          will be remediated.
        </Text>
      </TextContent>
      <UnhealthyConditionArray fieldName={fieldName} />
    </>
  );
};

export default UnhealthyConditionsField;
