import {
  BuiltInRemediationTemplate,
  InitialNodeHealthCheck,
  UnhealthyConditions,
  UnhealthyConditionStatus,
} from "./types";
import { getVersion, nodeHealthCheckKind } from "./model";

export const DEFAULT_MIN_HEALTHY = "51%";

const initialUnhealthyConditions: UnhealthyConditions = [
  {
    duration: "300ms",
    status: UnhealthyConditionStatus.False,
    type: "Ready",
  },
  {
    duration: "300ms",
    status: UnhealthyConditionStatus.Unknown,
    type: "Ready",
  },
];

export const initialSpec = {
  selector: {
    matchLabels: {},
  },
  remediationTemplate: {
    apiVersion: "poison-pill.medik8s.io/v1alpha1",
    kind: "PoisonPillRemediationTemplate",
    name: BuiltInRemediationTemplate.NodeDeletion,
    namespace: "openshift-operators",
  },
  minHealthy: DEFAULT_MIN_HEALTHY,
  unhealthyConditions: initialUnhealthyConditions,
};

export const initialNodeHealthCheckData: InitialNodeHealthCheck = {
  apiVersion: getVersion(),
  kind: nodeHealthCheckKind.kind,
  metadata: {
    name: "",
  },
  spec: initialSpec,
};
