import {
  ResourceLink,
  RowProps,
  TableColumn,
  TableData,
  VirtualizedTable,
} from "@openshift-console/dynamic-plugin-sdk";
import { getNodeRole } from "components/copiedFromConsole/selectors/node";
import { nodeStatus } from "components/copiedFromConsole/status/node";
import { NodeKind } from "components/copiedFromConsole/types/node";
import { nodeKind } from "data/model";
import * as React from "react";

const columns: TableColumn<NodeKind>[] = [
  {
    title: "Name",
    id: "name",
  },
  {
    title: "Status",
    id: "status",
  },
  {
    title: "Role",
    id: "role",
  },
];

const NodeRow: React.FC<RowProps<NodeKind>> = ({ obj, activeColumnIDs }) => {
  const status = nodeStatus(obj);
  const role = getNodeRole(obj);
  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        <ResourceLink
          groupVersionKind={nodeKind}
          name={obj.metadata.name}
          namespace={obj.metadata.namespace}
        />
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        {status}
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {role}
      </TableData>
    </>
  );
};

type NodeListProps = {
  nodes: NodeKind[];
  filteredNodes: NodeKind[];
  loaded: boolean;
  loadError: any;
};

const NodeList: React.FC<NodeListProps> = ({
  nodes,
  filteredNodes,
  loaded,
  loadError,
}) => {
  return (
    <VirtualizedTable<NodeKind>
      data={nodes}
      unfilteredData={filteredNodes}
      loaded={loaded}
      loadError={loadError}
      columns={columns}
      Row={NodeRow}
    />
  );
};

export default NodeList;
