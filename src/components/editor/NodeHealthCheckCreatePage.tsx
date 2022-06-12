import * as React from "react";
import NodeHealthCheckForm from "./NodeHealthCheckForm";

const NodeHealthCheckCreatePage = () => {
  return (
    <NodeHealthCheckForm
      name=""
      nodeHealthCheck={null}
      title={"Create NodeHealthCheck"}
      isCreateFlow={true}
    />
  );
};

export default NodeHealthCheckCreatePage;
