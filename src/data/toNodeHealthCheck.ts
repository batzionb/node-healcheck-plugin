import { EditorType } from "components/copiedFromConsole/synced-editor/editor-toggle";
import * as _ from "lodash";
import {
  NodeHealthCheck,
  Labels,
  NodeHealthCheckFormData,
  NodeHealthCheckFormValues,
  UnhealthyCondition,
  Duration,
  FormDataUnhealthyCondition,
  FormDataRemediator,
  RemediationTemplate,
  isBuiltInRemediationTemplate,
} from "./types";
import { initialNodeHealthCheckData } from "./initialNodeHealthCheckData";
import { load } from "js-yaml";

const getNodeHealthCheckSelector = (
  labelDisplayNames: string[]
): NodeHealthCheck["spec"]["selector"] | undefined => {
  const labels: Labels = {};
  for (const displayName of labelDisplayNames) {
    const [key, value] = displayName.split("=");
    labels[key] = value;
  }
  if (Object.keys(labels).length === 0) {
    return undefined;
  }
  return {
    matchLabels: labels,
  };
};

const getDuration = (formDuration: Duration) => {
  return `${formDuration.number}${formDuration.units}`;
};

const getUnhealthyConditions = (
  unhealthyConditions: FormDataUnhealthyCondition[]
): UnhealthyCondition[] =>
  unhealthyConditions.map((formUnhealthyCondition) => {
    const { duration, status, type } = formUnhealthyCondition;
    return {
      duration: getDuration(duration),
      status,
      type,
    };
  });

const getRemediatorTemplate = (
  initialRemediationTemplate: RemediationTemplate,
  remediator: FormDataRemediator
): RemediationTemplate => {
  if (isBuiltInRemediationTemplate(remediator.template)) {
    return {
      ...initialRemediationTemplate,
      name: remediator.template,
    };
  }
  return remediator.template;
};

export const formDataToNodeHealthCheck = (
  formData: NodeHealthCheckFormData,
  existingNodeHealthCheck?: NodeHealthCheck
) => {
  const { name, selector, minHealthy, unhealthyConditions } = formData;
  return _.merge<{}, NodeHealthCheck, NodeHealthCheck>(
    {},
    initialNodeHealthCheckData,
    {
      ...existingNodeHealthCheck,
      metadata: {
        ...existingNodeHealthCheck?.metadata,
        name,
      },
      spec: {
        ...existingNodeHealthCheck?.spec,
        selector: getNodeHealthCheckSelector(selector),
        unhealthyConditions: getUnhealthyConditions(unhealthyConditions),
        minHealthy: minHealthy,
        remediationTemplate: getRemediatorTemplate(
          initialNodeHealthCheckData.spec.remediationTemplate,
          formData.remediator
        ),
      },
    }
  );
};

export const toNodeHealthCheck = (
  values: NodeHealthCheckFormValues
): NodeHealthCheck => {
  const yamlData = load(values.yamlData);
  if (values.editorType === EditorType.YAML) {
    return yamlData;
  }
  return formDataToNodeHealthCheck(values.formData, yamlData);
};
