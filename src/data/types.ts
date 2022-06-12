import { ObjectMetadata } from "@openshift-console/dynamic-plugin-sdk";
import { EditorType } from "../components/copiedFromConsole/synced-editor/editor-toggle";

export type Labels = {
  [key: string]: string;
};

export enum UnhealthyConditionStatus {
  False = "False",
  True = "True",
  Unknown = "Unknown",
}

export enum UnhealtyConditionType {
  Ready = "Ready",
  MemoryPressure = "MemoryPressure",
  DiskPressure = "DiskPressure",
  PIDPressure = "PIDPressure",
  NetworkUnavailable = "NetworkUnavailable",
}

export type UnhealthyCondition = {
  duration: string;
  status: UnhealthyConditionStatus;
  type: string;
};

export type RemediationTemplate = {
  apiVersion: string;
  kind: string;
  name: string;
  namespace: string;
};

export type UnhealthyConditions = UnhealthyCondition[];

export type PauseRequest = {};

export type NodeHealthCheckSpec = {
  selector?: {
    matchLabels?: Labels;
  };
  remediationTemplate: RemediationTemplate;
  minHealthy?: string;
  unhealthyConditions?: UnhealthyConditions;
};

export type BasicResourceInfo = {
  apiVersion: string;
  kind: string;
  metadata: ObjectMetadata;
};

export type InitialNodeHealthCheck = {
  spec: Required<NodeHealthCheckSpec>;
} & BasicResourceInfo;

export enum StatusPhase {
  ENABLED = "Enabled",
  DISABLED = "Disabled",
  REMEDIATING = "Remediating",
  PAUSED = "Paused",
}

export type NodeHealthCheckStatus = {
  phase?: StatusPhase;
  reason?: string;
};

export type NodeHealthCheck = BasicResourceInfo & {
  spec?: NodeHealthCheckSpec & {
    pauseRequests?: string[];
  };
  status?: NodeHealthCheckStatus;
};

export enum TimeUnit {
  Hour = "h",
  Minute = "m",
  Second = "s",
  NanoSecond = "ns",
  MilliSecond = "ms",
}

export type Duration = {
  number: string;
  units: TimeUnit;
};

export enum RemediatorKind {
  SNR = "SNR",
  CUSTOM = "Other",
}

export enum BuiltInRemediationTemplate {
  NodeDeletion = "node-deletion",
  ResourceDeletion = "resource-deletion",
}

export type FormDataRemediator = {
  kind: RemediatorKind;
  template: BuiltInRemediationTemplate | RemediationTemplate;
};

export const isBuiltInRemediationTemplate = (
  template: BuiltInRemediationTemplate | RemediationTemplate | string
): template is BuiltInRemediationTemplate => {
  if (typeof template !== "string") {
    return false;
  }
  return (
    template === BuiltInRemediationTemplate.NodeDeletion ||
    template === BuiltInRemediationTemplate.ResourceDeletion
  );
};

export type FormDataUnhealthyCondition = {
  duration: Duration;
  status: UnhealthyConditionStatus;
  type: string;
};

export type NodeHealthCheckFormData = {
  name: string;
  selector: string[];
  minHealthy: string;
  unhealthyConditions: FormDataUnhealthyCondition[];
  remediator: FormDataRemediator;
};

export type NodeHealthCheckFormValues = {
  isCreateFlow: boolean;
  editorType: EditorType;
  yamlData: string;
  formData: NodeHealthCheckFormData | null;
  resourceVersion: string;
  formReloadCount: number;
  formParsingError: string | null;
};
