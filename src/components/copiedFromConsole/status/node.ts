import { isNodeReady } from "../selectors/node";
import { NodeKind } from "../types/node";

export const nodeStatus = (node: NodeKind) =>
  isNodeReady(node) ? "Ready" : "Not Ready";
