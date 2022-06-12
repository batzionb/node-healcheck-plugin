import { GreenCheckCircleIcon } from "@openshift-console/dynamic-plugin-sdk";
import {
  Popover,
  TextContent,
  TextVariants,
  Text,
} from "@patternfly/react-core";
import {
  ExclamationCircleIcon,
  WrenchIcon,
  PauseIcon,
} from "@patternfly/react-icons";
import { ModalId } from "components/modals/Modals";
import { useModals } from "components/modals/ModalsContext";
import { getPauseRequests, getPhase } from "data/selectors";
import {
  NodeHealthCheck,
  StatusPhase,
  NodeHealthCheckStatus,
} from "data/types";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNodeHealthcheckTranslation } from "useNodeHealthCheckTranslation";

const getIcon = (phase: StatusPhase) => {
  switch (phase) {
    case StatusPhase.ENABLED: {
      return <GreenCheckCircleIcon />;
    }
    case StatusPhase.DISABLED: {
      return <ExclamationCircleIcon />;
    }
    case StatusPhase.REMEDIATING: {
      return <WrenchIcon />;
    }
    case StatusPhase.PAUSED: {
      return <PauseIcon />;
    }
    default: {
      return phase;
    }
  }
};

const PausePopoverContent: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
  pauseReasons: string[];
}> = ({ nodeHealthCheck, pauseReasons }) => {
  const { t } = useTranslation();
  const modalsApi = useModals();
  return (
    <>
      <Text>{`${pauseReasons.length} ${t("pause reasons found")}`}</Text>
      <a
        onClick={() => modalsApi.openModal(ModalId.EDIT_PAUSE, nodeHealthCheck)}
      >
        Edit pause reasons
      </a>
    </>
  );
};

const PopoverContent: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
  phase: StatusPhase;
  reason: string;
}> = ({ nodeHealthCheck, phase, reason }) => {
  const { t } = useNodeHealthcheckTranslation();
  const pauseReasons = getPauseRequests(nodeHealthCheck);
  const showPausePopover = pauseReasons && pauseReasons.length;
  return (
    <TextContent>
      <Text component={TextVariants.h4}>{t(phase)}</Text>
      {showPausePopover && (
        <PausePopoverContent
          nodeHealthCheck={nodeHealthCheck}
          pauseReasons={pauseReasons}
        />
      )}
      {!showPausePopover && <Text>{reason}</Text>}
    </TextContent>
  );
};

const NodeHealthCheckStatus: React.FC<{ nodeHealthCheck: NodeHealthCheck }> = ({
  nodeHealthCheck,
}) => {
  const { t } = useNodeHealthcheckTranslation();
  if (!nodeHealthCheck.status || !nodeHealthCheck.status?.phase) {
    return <span>{t("N/A")}</span>;
  }
  const phase = getPhase(nodeHealthCheck);
  let icon = getIcon(getPhase(nodeHealthCheck));
  if (!icon) {
    return <span>{phase}</span>;
  }
  const content = (
    <span>
      {icon} <a>{t(phase)}</a>
    </span>
  );
  return nodeHealthCheck.status?.reason ? (
    <Popover
      bodyContent={
        <PopoverContent
          nodeHealthCheck={nodeHealthCheck}
          phase={phase}
          reason={nodeHealthCheck.status?.reason}
        />
      }
    >
      {content}
    </Popover>
  ) : (
    content
  );
};

export default NodeHealthCheckStatus;
