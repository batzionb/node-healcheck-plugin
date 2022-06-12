import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";

export const getLabelDisplayName = (key: string, value: string) => {
  return `${key}=${value}`;
};

export const getObjectLabelDisplayNames = (object: K8sResourceCommon) =>
  Object.entries(object.metadata?.labels).map(([key, value]) =>
    getLabelDisplayName(key, value)
  );
