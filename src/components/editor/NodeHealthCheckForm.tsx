import * as React from "react";
import * as _ from "lodash";

import { NodeHealthCheckFormEditor } from "./NodeHealthCheckFormEditor";
import { NodeHealthCheck, NodeHealthCheckFormValues } from "../../data/types";

import { Formik, FormikHelpers } from "formik";

import { k8sCreate, k8sUpdate } from "@openshift-console/dynamic-plugin-sdk";
import { useHistory } from "react-router-dom";
import { fromNodeHealthCheck } from "data/fromNodeHealthCheck";
import { toNodeHealthCheck } from "data/toNodeHealthCheck";
import { NodeHealthCheckModel } from "data/model";
import { validationSchema } from "data/validationSchema";
import { getNodeHealthCheckUrl } from "./url";
import { Alert } from "@patternfly/react-core";

export interface NodeHealthCheckProps {
  title: string;
  name: string;
  nodeHealthCheck: NodeHealthCheck;
  isCreateFlow: boolean;
}

const NodeHealthCheckForm: React.FC<NodeHealthCheckProps> = ({
  name,
  title,
  nodeHealthCheck,
  isCreateFlow,
}) => {
  const [initialValues] = React.useState(
    fromNodeHealthCheck(nodeHealthCheck, isCreateFlow)
  );
  const [formParseError, setFormParseError] = React.useState<string | null>(
    initialValues.formParsingError
  );
  const history = useHistory();

  const gotoNodeHealthCheck = (name?: string) => {
    history.push(getNodeHealthCheckUrl(name));
  };
  const handleSubmit = (
    values: NodeHealthCheckFormValues,
    actions: FormikHelpers<NodeHealthCheckFormValues>
  ) => {
    setFormParseError(null);
    let resourceCall;
    const nodeHealthCheck: NodeHealthCheck = toNodeHealthCheck(values);
    if (isCreateFlow) {
      resourceCall = k8sCreate({
        model: NodeHealthCheckModel,
        data: nodeHealthCheck,
      });
    } else {
      const editNodeHealthCheckData = _.cloneDeep(nodeHealthCheck);
      editNodeHealthCheckData.metadata = nodeHealthCheck?.metadata;

      resourceCall = k8sUpdate({
        model: NodeHealthCheckModel,
        data: editNodeHealthCheckData,
        name,
      });
    }
    return resourceCall
      .then(() => {
        gotoNodeHealthCheck(nodeHealthCheck?.metadata?.name);
        return true;
      })
      .catch((e) => {
        actions.setStatus({ submitError: e.message });
      });
  };
  const handleCancel = () => history.goBack();

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema()}
      >
        {(formikProps) => (
          <NodeHealthCheckFormEditor
            title={title}
            nodeHealthCheck={nodeHealthCheck}
            handleCancel={handleCancel}
            onDoneReload={() => setFormParseError(null)}
            {...formikProps}
          />
        )}
      </Formik>
      {formParseError && (
        <Alert title="Failed to load form view" variant="danger" isInline>
          <p>{formParseError}</p>
        </Alert>
      )}
    </>
  );
};

export default NodeHealthCheckForm;
