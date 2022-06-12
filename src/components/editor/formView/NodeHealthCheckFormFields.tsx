import * as React from "react";
import { useFormikContext } from "formik";
import { useNodeHealthcheckTranslation } from "useNodeHealthCheckTranslation";
import { FormSection, TextInputTypes } from "@patternfly/react-core";
import InputField from "../../sharedComponents/InputField";
import NodeSelectionField from "./nodeSelectionField/NodeSelectionField";
import PopoverIcon from "components/sharedComponents/PopoverIcon";
import { FormViewFieldProps } from "./propTypes";
import { getObjectItemFieldName } from "components/sharedComponents/formik-utils";
import UnhealthyConditionsField from "./unhealthyConditionsField/UnhealthyConditionsField";
import { RemediatorField } from "./RemediatorField";
import { NodeHealthCheckFormValues } from "data/types";

const MinHealthyField = ({ fieldName }: FormViewFieldProps) => {
  const { t } = useNodeHealthcheckTranslation();
  return (
    <InputField
      required
      label="Min Healthy"
      labelIcon={
        <PopoverIcon
          noVerticalAlign
          bodyContent={t(
            "The minimum number or percentage of nodes that has to be healthy for the remediation to start."
          )}
        />
      }
      name={fieldName}
    />
  );
};

const NodeHealthCheckFormFields: React.FC = () => {
  const { t } = useNodeHealthcheckTranslation();
  const { values } = useFormikContext<NodeHealthCheckFormValues>();
  const fieldNamePrefix = "formData";
  return (
    <FormSection>
      <InputField
        type={TextInputTypes.text}
        required
        isDisabled={!values.isCreateFlow}
        name="formData.name"
        label={t("Name")}
        data-test="NodeHealthCheck-name"
        helpText={t("A unique name for the NodeHealthCheck within the project")}
      />
      <NodeSelectionField />
      <MinHealthyField
        fieldName={getObjectItemFieldName([fieldNamePrefix, "minHealthy"])}
      />
      <UnhealthyConditionsField
        fieldName={getObjectItemFieldName([
          fieldNamePrefix,
          "unhealthyConditions",
        ])}
      ></UnhealthyConditionsField>
      <RemediatorField
        fieldName={getObjectItemFieldName([fieldNamePrefix, "remediator"])}
      ></RemediatorField>
    </FormSection>
  );
};

export default NodeHealthCheckFormFields;
