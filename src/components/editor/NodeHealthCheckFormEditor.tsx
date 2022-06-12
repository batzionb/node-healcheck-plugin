import * as React from "react";
import * as _ from "lodash";
import { FormikProps, useFormikContext } from "formik";
import { useNodeHealthcheckTranslation } from "useNodeHealthCheckTranslation";

import NodeHealthCheckFormFields from "./formView/NodeHealthCheckFormFields";
import { NodeHealthCheck, NodeHealthCheckFormValues } from "../../data/types";
import { EditorType } from "../copiedFromConsole/synced-editor/editor-toggle";

import {
  FlexForm,
  FormBody,
  FormFooter,
  FormHeader,
} from "../copiedFromConsole/form-utils";
import SyncedEditorField from "../copiedFromConsole/formik-fields/SyncedEditorField";
import { getFormData } from "data/formData";
import { dump, load } from "js-yaml";
import { sanitizeToForm, sanitizeToYaml } from "data/sanitizeToView";
import "./editor.css";
interface NodeHealthCheckFormEditorProps {
  nodeHealthCheck: NodeHealthCheck;
  title: string;
  handleCancel: () => void;
  onDoneReload: () => void;
}

export const NodeHealthCheckFormEditor: React.FC<
  FormikProps<NodeHealthCheckFormValues> & NodeHealthCheckFormEditorProps
> = ({
  values,
  status,
  handleSubmit,
  nodeHealthCheck,
  title,
  isSubmitting,
  dirty,
  handleCancel,
  onDoneReload,
  setStatus,
  setErrors,
  errors,
}) => {
  const { t } = useNodeHealthcheckTranslation();
  const { setFieldValue } = useFormikContext<NodeHealthCheckFormValues>();
  const context = useFormikContext();
  const LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY =
    "console.NodeHealthCheckForm.editor.lastView";
  const isStale =
    !!nodeHealthCheck &&
    nodeHealthCheck?.metadata?.resourceVersion !== values.resourceVersion;

  const disableSubmit =
    (values.editorType === EditorType.YAML
      ? !dirty
      : !dirty || !_.isEmpty(errors)) || isSubmitting;

  const formEditor = (
    <div className="form-pane">
      <NodeHealthCheckFormFields />
    </div>
  );
  const yamlEditor = <div>test</div>;

  const onReload = React.useCallback(() => {
    setStatus({ submitSuccess: "", submitError: "" });
    setErrors({});
    if (values.editorType === EditorType.Form) {
      setFieldValue("formData", getFormData(nodeHealthCheck, false), false);
    }
    setFieldValue(
      "yamlData",
      dump(nodeHealthCheck, "", { skipInvalid: true }),
      false
    );
    setFieldValue(
      "resourceVersion",
      nodeHealthCheck?.metadata?.resourceVersion,
      true
    );
    setFieldValue("formReloadCount", values.formReloadCount + 1);
    onDoneReload();
  }, [setErrors, setFieldValue, setStatus, values, nodeHealthCheck]);

  React.useEffect(() => {
    setStatus({ submitError: null });
  }, [setStatus, values.editorType]);
  return (
    <FlexForm onSubmit={handleSubmit} className="NodeHealthCheck-form">
      <FormBody flexLayout>
        <FormHeader
          title={title}
          helpText={t(
            "NodeHealthChecks identify unhealthy nodes and use remediator to fix them."
          )}
        />
        <SyncedEditorField
          name="editorType"
          formContext={{
            name: "formData",
            editor: formEditor,
            sanitizeTo: (yamlNodeHealthCheck: NodeHealthCheck) =>
              sanitizeToForm(values.formData, yamlNodeHealthCheck),
          }}
          yamlContext={{
            name: "yamlData",
            editor: yamlEditor,
            sanitizeTo: () =>
              sanitizeToYaml(
                values.formData,
                _.merge({}, nodeHealthCheck, load(values.yamlData))
              ),
          }}
          lastViewUserSettingKey={LAST_VIEWED_EDITOR_TYPE_USERSETTING_KEY}
          noMargin
        />
      </FormBody>

      <FormFooter
        handleSubmit={handleSubmit}
        handleReset={values.isCreateFlow ? null : onReload}
        errorMessage={status?.submitError}
        successMessage={status?.submitSuccess}
        showAlert={isStale}
        infoTitle={t("This object has been updated.")}
        infoMessage={t("Click reload to see the new version.")}
        isSubmitting={isSubmitting}
        submitLabel={values.isCreateFlow ? t("Create") : t("Save")}
        disableSubmit={disableSubmit}
        handleCancel={handleCancel}
        sticky
      />
    </FlexForm>
  );
};
