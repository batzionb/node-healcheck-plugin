import * as _ from "lodash";
import { getFormData, getInitialFormData } from "./formData";
import { formDataToNodeHealthCheck } from "./toNodeHealthCheck";
import { NodeHealthCheckFormData, NodeHealthCheck } from "./types";
import { dump } from "js-yaml";

export const sanitizeToYaml = (
  formData: NodeHealthCheckFormData,
  nodeHealthCheck?: NodeHealthCheck
): string => {
  const nodeHealthCheckObj = formDataToNodeHealthCheck(
    formData,
    nodeHealthCheck
  );
  return dump(nodeHealthCheckObj, "", {
    skipInvalid: true,
  });
};

export const sanitizeToForm = (
  existingFormData: NodeHealthCheckFormData,
  yamlData?: NodeHealthCheck
): NodeHealthCheckFormData => {
  try {
    const newFormData = getFormData(yamlData, true);
    return _.merge({}, getInitialFormData(), existingFormData, newFormData);
  } catch (err) {
    console.error(err);
    return null;
  }
};
