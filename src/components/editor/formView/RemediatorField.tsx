import * as React from "react";
import * as _ from "lodash";

import { TextContent, Text, TextVariants } from "@patternfly/react-core";
import FormSelectField from "components/copiedFromConsole/formik-fields/FormSelectField";
import RadioGroupField from "components/copiedFromConsole/formik-fields/RadioGroupField";
import { getObjectItemFieldName } from "components/sharedComponents/formik-utils";
import {
  BuiltInRemediationTemplate,
  FormDataRemediator,
  RemediatorKind,
} from "data/types";
import { FormViewFieldProps } from "./propTypes";
import InputField from "components/sharedComponents/InputField";
import { useField } from "formik";
import { getRemediatorLabel } from "data/remediatorFormData";

const RadioGroupOptions = [
  {
    value: RemediatorKind.SNR,
    label: getRemediatorLabel(RemediatorKind.SNR),
  },
  {
    value: RemediatorKind.CUSTOM,
    label: getRemediatorLabel(RemediatorKind.CUSTOM),
  },
];

const SNRStrategyOptions = [
  {
    label: "Node deletion",
    value: BuiltInRemediationTemplate.NodeDeletion,
  },
  {
    label: "Resource deletion",
    value: BuiltInRemediationTemplate.ResourceDeletion,
  },
];

const sentenceCase = (string: string) => {
  return _.capitalize(_.startCase(string));
};

const RemediatorKindGroup = ({ fieldName }: FormViewFieldProps) => {
  return (
    <RadioGroupField
      options={RadioGroupOptions}
      name={fieldName}
      isInline
    ></RadioGroupField>
  );
};

const SNRRemediatorField = ({ fieldName }: FormViewFieldProps) => (
  <FormSelectField
    name={fieldName}
    options={SNRStrategyOptions}
    label="RemediationStrategy"
    required
  />
);

const CustomRemediatorField = ({ fieldName }: FormViewFieldProps) => (
  <>
    {["apiVersion", "kind", "name", "namespace"].map((subFieldName) => {
      const inputFieldName = getObjectItemFieldName([fieldName, subFieldName]);
      return (
        <InputField
          required
          name={inputFieldName}
          key={inputFieldName}
          label={sentenceCase(subFieldName)}
        ></InputField>
      );
    })}
  </>
);

export const RemediatorField = ({ fieldName }: FormViewFieldProps) => {
  const kindFieldName = getObjectItemFieldName([fieldName, "kind"]);
  const templateFieldName = getObjectItemFieldName([fieldName, "template"]);
  const [{ value: kind }] = useField<RemediatorKind>(kindFieldName);
  const [, , { setValue: setRemediationTemplate }] =
    useField<FormDataRemediator["template"]>(templateFieldName);
  React.useEffect(() => {
    if (kind === RemediatorKind.SNR) {
      setRemediationTemplate(BuiltInRemediationTemplate.NodeDeletion);
    } else {
      setRemediationTemplate({
        apiVersion: "",
        kind: "",
        namespace: "",
        name: "",
      });
    }
  }, [kind]);
  return (
    <>
      <TextContent>
        <Text component={TextVariants.h3}>Remediator</Text>
      </TextContent>
      <RemediatorKindGroup
        fieldName={getObjectItemFieldName([fieldName, "kind"])}
      />
      {kind === RemediatorKind.SNR && (
        <SNRRemediatorField fieldName={templateFieldName}></SNRRemediatorField>
      )}
      {kind === RemediatorKind.CUSTOM && (
        <CustomRemediatorField
          fieldName={templateFieldName}
        ></CustomRemediatorField>
      )}
    </>
  );
};
