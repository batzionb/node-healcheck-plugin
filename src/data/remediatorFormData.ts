import * as _ from "lodash";
import {
  RemediationTemplate,
  FormDataRemediator,
  RemediatorKind,
  isBuiltInRemediationTemplate,
  BuiltInRemediationTemplate,
} from "./types";

const getBuiltInRemediatorTemplate = (
  initialRemediationTemplate: RemediationTemplate,
  remediationTemplate: RemediationTemplate
): BuiltInRemediationTemplate | null => {
  const commonProps = ["kind", "namespace", "apiVersion"];
  const commonPropsEqual = _.isEqual(
    _.pick(initialRemediationTemplate, commonProps),
    _.pick(remediationTemplate, commonProps)
  );
  if (!commonPropsEqual) {
    return null;
  }

  if (isBuiltInRemediationTemplate(remediationTemplate.name)) {
    return remediationTemplate.name;
  }
  return null;
};

export const getRemediator = (
  initialRemediationTemplate: RemediationTemplate,
  remediationTemplate: RemediationTemplate
): FormDataRemediator => {
  const builtInTemplate = getBuiltInRemediatorTemplate(
    initialRemediationTemplate,
    remediationTemplate
  );

  if (builtInTemplate) {
    return {
      kind: RemediatorKind.SNR,
      template: builtInTemplate,
    };
  }
  return {
    kind: RemediatorKind.CUSTOM,
    template: remediationTemplate,
  };
};

export const getRemediatorLabel = (kind: RemediatorKind) =>
  kind === RemediatorKind.SNR ? "Self node remediation" : "Other";
