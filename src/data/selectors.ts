import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import * as _ from "lodash";
import { NodeHealthCheck } from "./types";

export const getName = <A extends K8sResourceCommon = K8sResourceCommon>(
  value: A
) => _.get(value, "metadata.name") as K8sResourceCommon["metadata"]["name"];

export const getPauseRequests = (nhc: NodeHealthCheck) =>
  nhc.spec?.pauseRequests;

export const getPhase = (nhc: NodeHealthCheck) => nhc.status?.phase;
