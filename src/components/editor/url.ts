import { nodeHealthCheckStringKind } from "data/model";

export const getNodeHealthCheckUrl = (name?: string) => {
  return `/k8s/cluster/${nodeHealthCheckStringKind}/${name}`;
};
