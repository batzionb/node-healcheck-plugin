import * as _ from "lodash";
import {
  initialNodeHealthCheckData,
  initialSpec,
} from "./initialNodeHealthCheckData";
import { getRemediator } from "./remediatorFormData";
import {
  Duration,
  TimeUnit,
  Labels,
  UnhealthyCondition,
  NodeHealthCheck,
  NodeHealthCheckFormData,
  FormDataUnhealthyCondition,
} from "./types";

const DURATION_REGEX = /^([0-9]+(\.[0-9]+)?)(ns|us|µs|ms|s|m|h)$/;

type DURATION_PARSE_ERROR = {
  invalidDuration: string;
};

const isDurationParseError = (err: unknown): err is DURATION_PARSE_ERROR => {
  return err["invalidDuration"];
};

const parseDuration = (nodeHealthCheckDuration: string): Duration => {
  try {
    const [, number, , units] = DURATION_REGEX.exec(nodeHealthCheckDuration);
    return { number, units: units as TimeUnit };
  } catch (err) {
    throw { invalidDuration: nodeHealthCheckDuration };
  }
};

const getNodeLabelDisplayNames = (
  matchLabels: Labels | undefined,
  deleteInvalid: boolean
): string[] => {
  if (!matchLabels) {
    return [];
  }
  try {
    return Object.entries(matchLabels).map(([key, value]) => `${key}=${value}`);
  } catch (err) {
    if (deleteInvalid) {
      return [];
    }
    throw "Failed to parse spec.selector.matchLabels field";
  }
};

const _getUnhealthyConditions = (
  unhealthyConditions: UnhealthyCondition[],
  deleteInvalid: boolean
): FormDataUnhealthyCondition[] => {
  return unhealthyConditions.map((condition) => {
    let duration = {
      number: "",
      units: TimeUnit.MilliSecond,
    };
    try {
      duration = parseDuration(condition.duration);
    } catch (err) {
      if (!deleteInvalid) {
        throw err;
      }
    }
    return {
      status: condition.status,
      type: condition.type,
      duration,
    };
  });
};

const getUnhealthyConditions = (
  unhealthyConditions: UnhealthyCondition[] | undefined,
  deleteInvalid: boolean
): FormDataUnhealthyCondition[] => {
  const defaultUnhealthyConditions = _getUnhealthyConditions(
    initialSpec.unhealthyConditions,
    deleteInvalid
  );
  if (!unhealthyConditions) {
    return defaultUnhealthyConditions;
  }
  try {
    return _getUnhealthyConditions(unhealthyConditions, deleteInvalid);
  } catch (err) {
    if (deleteInvalid) {
      return defaultUnhealthyConditions;
    }
    if (isDurationParseError(err)) {
      //catch duration error
      throw `Unhealthy condition duration ${err.invalidDuration} does not match regex ${DURATION_REGEX}`;
    }
    throw "Failed to parse unhealthy conditions";
  }
};

export const getFormData = (
  nodeHealthCheck: NodeHealthCheck,
  deleteInvalid: boolean
): NodeHealthCheckFormData => {
  return {
    name: nodeHealthCheck.metadata?.name,
    selector: getNodeLabelDisplayNames(
      nodeHealthCheck.spec?.selector?.matchLabels,
      deleteInvalid
    ),
    minHealthy: nodeHealthCheck.spec?.minHealthy,
    unhealthyConditions: getUnhealthyConditions(
      nodeHealthCheck.spec?.unhealthyConditions,
      deleteInvalid
    ),
    remediator: getRemediator(
      initialNodeHealthCheckData.spec.remediationTemplate,
      nodeHealthCheck.spec?.remediationTemplate
    ),
  };
};

export const getInitialFormData = () => {
  return getFormData(initialNodeHealthCheckData, false);
};
