import * as React from "react";
import {
  ListPageHeader,
  ListPageBody,
  ListPageCreate,
  VirtualizedTable,
  useK8sWatchResource,
  K8sResourceCommon,
  TableData,
  RowProps,
  ResourceLink,
  TableColumn,
} from "@openshift-console/dynamic-plugin-sdk";

import { useNodeHealthcheckTranslation } from "useNodeHealthCheckTranslation";
import NodeHealthCheckKababMenu from "./NodeHealthCheckKababMenu";
import { nodeHealthCheckKind, nodeHealthCheckStringKind } from "data/model";
import { NodeHealthCheck, RemediatorKind } from "data/types";
import { getRemediator, getRemediatorLabel } from "data/remediatorFormData";
import { initialNodeHealthCheckData } from "data/initialNodeHealthCheckData";
import { ModalsContextProvider } from "components/modals/ModalsContext";
import "./list.css";
import Modals from "components/modals/Modals";
import NodeHealthCheckStatus from "./NodeHealthCheckStatus";

const columns: TableColumn<K8sResourceCommon>[] = [
  {
    title: "Name",
    id: "name",
  },
  {
    title: "Created",
    id: "created",
  },
  {
    title: "Remediator",
    id: "remediator",
  },
  {
    title: "Status",
    id: "status",
  },
  { title: "", id: "kabab-menu" },
];

const Timestamp = ({ obj }: { obj: NodeHealthCheck }) => {
  return <>{obj.metadata.creationTimestamp}</>;
};

const Remediator = ({ obj }: { obj: NodeHealthCheck }) => {
  const kind: RemediatorKind = getRemediator(
    initialNodeHealthCheckData.spec.remediationTemplate,
    obj.spec.remediationTemplate
  ).kind;
  return <>{getRemediatorLabel(kind)}</>;
};

const NodeHealthcheckRow: React.FC<RowProps<NodeHealthCheck>> = ({
  obj,
  activeColumnIDs,
}) => {
  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        <ResourceLink
          groupVersionKind={nodeHealthCheckKind}
          name={obj.metadata.name}
          namespace={obj.metadata.namespace}
        />
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        <Timestamp obj={obj} />
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        <Remediator obj={obj} />
      </TableData>
      <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
        <NodeHealthCheckStatus nodeHealthCheck={obj} />
      </TableData>
      <TableData id={columns[4].id} activeColumnIDs={activeColumnIDs}>
        <NodeHealthCheckKababMenu obj={obj}></NodeHealthCheckKababMenu>
      </TableData>
    </>
  );
};

type NodeHealthchecksTableProps = {
  data: K8sResourceCommon[];
  unfilteredData: K8sResourceCommon[];
  loaded: boolean;
  loadError: any;
};

const NodeHealthchecksTable: React.FC<NodeHealthchecksTableProps> = ({
  data,
  unfilteredData,
  loaded,
  loadError,
}) => {
  return (
    <VirtualizedTable<K8sResourceCommon>
      data={data}
      unfilteredData={unfilteredData}
      loaded={loaded}
      loadError={loadError}
      columns={columns}
      Row={NodeHealthcheckRow}
    />
  );
};

const NodeHealthCheckListPage = () => {
  const [nodeHealthchecks, loaded, loadError] = useK8sWatchResource<
    K8sResourceCommon[]
  >({
    groupVersionKind: nodeHealthCheckKind,
    isList: true,
    namespaced: false,
  });
  const { t } = useNodeHealthcheckTranslation();

  return (
    <>
      <ModalsContextProvider>
        <ListPageHeader title={t("NodeHealthChecks")}>
          <ListPageCreate groupVersionKind={nodeHealthCheckStringKind}>
            {t("Create NodeHealthCheck")}
          </ListPageCreate>
        </ListPageHeader>
        <ListPageBody>
          <NodeHealthchecksTable
            data={nodeHealthchecks}
            unfilteredData={nodeHealthchecks}
            loaded={loaded}
            loadError={loadError}
          />
        </ListPageBody>
        <Modals />
      </ModalsContextProvider>
    </>
  );
};

export default NodeHealthCheckListPage;
