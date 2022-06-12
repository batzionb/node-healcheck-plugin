import { useField } from "formik";
import * as React from "react";
import * as _ from "lodash";
import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import { NodeKind } from "components/copiedFromConsole/types/node";
import { LoadingBox } from "components/copiedFromConsole/status-box";
import ErrorState from "components/sharedComponents/ErrorState";
import NodeList from "./NodeList";
import LabelsSelector from "./LabelsSelector";

import { getObjectLabelDisplayNames } from "./utils";
import { nodeKind } from "data/model";

const NodeSelectionField = () => {
  const fieldName = "formData.selector";
  const [{ value: labels }] = useField<string[]>(fieldName);
  const [allNodes, loaded, loadError] = useK8sWatchResource<NodeKind[]>({
    groupVersionKind: nodeKind,
    isList: true,
    namespaced: false,
  });
  const [selectedNodes, setSelectedNodes] =
    React.useState<NodeKind[]>(allNodes);
  React.useEffect(() => {
    if (!loaded || loadError) {
      return;
    }
    if (labels.length === 0) {
      setSelectedNodes(allNodes);
      return;
    }
    const nodesWithLabels = allNodes.filter((node: NodeKind) => {
      const nodeLabels = getObjectLabelDisplayNames(node);
      return _.intersection(nodeLabels, labels).length > 0;
    });
    setSelectedNodes(nodesWithLabels);
  }, [allNodes, labels, loaded, loadError]);
  if (!loaded) {
    return <LoadingBox />;
  }
  if (loadError) {
    return <ErrorState />;
  }
  return (
    <>
      <LabelsSelector objects={allNodes}></LabelsSelector>
      <NodeList
        nodes={selectedNodes}
        filteredNodes={selectedNodes}
        loaded={true}
        loadError={null}
      ></NodeList>
    </>
  );
};

export default NodeSelectionField;
