import { getPauseRequests } from "data/selectors";
import * as React from "react";

import { useNodeHealthcheckTranslation } from "useNodeHealthCheckTranslation";
import EditPauseReasonsModal from "./EditPauseReasonsModal";
import { NodeHealthCheckModalProps } from "./propTypes";

const EditPauseModal: React.FC<NodeHealthCheckModalProps> = ({
  nodeHealthCheck,
  ...props
}) => {
  const { t } = useNodeHealthcheckTranslation();
  return (
    <EditPauseReasonsModal
      title={t("Edit pause reason(s)")}
      failureErrorMessage={t("Failed to edit pause reasons")}
      confirmButtonText="Save"
      initialPauseReasons={getPauseRequests(nodeHealthCheck)}
      nodeHealthCheck={nodeHealthCheck}
      {...props}
    />
  );
};

export default EditPauseModal;
