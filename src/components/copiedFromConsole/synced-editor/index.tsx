import * as React from "react";
import { Alert, Button } from "@patternfly/react-core";
import * as _ from "lodash";
import { useNodeHealthcheckTranslation } from "useNodeHealthCheckTranslation";
import { EditorType, EditorToggle } from "./editor-toggle";
import { useEditorType } from "./useEditorType";
import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
//import { asyncYAMLToJS } from "src/components/yaml";
import { LoadingBox } from "../status-box";
import { dump } from "js-yaml";

const YAML_KEY_ORDER = ["apiVerion", "kind", "metadata", "spec", "status"];
export const YAML_TO_JS_OPTIONS = {
  skipInvalid: true,
  sortKeys: (a, b) =>
    _.indexOf(YAML_KEY_ORDER, a) - _.indexOf(YAML_KEY_ORDER, b),
};
type K8sResourceKind = K8sResourceCommon & {
  spec?: {
    [key: string]: any;
  };
  status?: { [key: string]: any };
  data?: { [key: string]: any };
};
// Provides toggling and syncing between a form and yaml editor. The formData state is the source
// of truth. Both the form editor and the yaml editor update the formData state. Here's the basic logic of this component:
// In the form view:
//   - formData is both rendered and updated by the form component
//   - on toggle to YAML editor, yaml is parsed from current formData state.
// In the YAML view:
//   - on each yaml change, attempt to parse yaml to js:
//       - If it fails, nothing happens. formData remains unchanged.
//       - If successful, formData is updated to resulting js
//   - on toggle to form view, no action needs to be taken to sync because formData has remained up to date with each yaml change
//
//  This means that when switching from YAML to Form, you can lose changes if the YAML editor contains unparsable YAML
//  TODO Add an extra step when switching from yaml to form to warn user if they are about to lose changes.
export const SyncedEditor: React.FC<SyncedEditorProps> = ({
  context = {},
  FormEditor,
  initialType = EditorType.Form,
  initialData = {},
  onChangeEditorType = _.noop,
  onChange = _.noop,
  prune,
  YAMLEditor,
  lastViewUserSettingKey,
  displayConversionError,
}) => {
  const { formContext } = context;
  const { t } = useNodeHealthcheckTranslation();
  const [formData, setFormData] = React.useState<K8sResourceKind>(initialData);
  const [yaml, setYAML] = React.useState(dump(initialData));
  const [switchError, setSwitchError] = React.useState<string | undefined>();
  const [yamlWarning, setYAMLWarning] = React.useState<boolean>(false);
  const [editorType, setEditorType, loaded] = useEditorType(
    lastViewUserSettingKey,
    initialType
  );

  const handleFormDataChange = (newFormData: K8sResourceKind = {}) => {
    if (!_.isEqual(newFormData, formData)) {
      setFormData(newFormData);
      onChange(newFormData);
    }
  };

  // const handleYAMLChange = (newYAML: string = "") => {
  //   asyncYAMLToJS(newYAML)
  //     .then((js) => {
  //       setSwitchError(undefined);
  //       handleFormDataChange(js);
  //     })
  //     .catch((err) => setSwitchError(String(err)));
  // };

  const changeEditorType = (newType: EditorType): void => {
    setEditorType(newType);
    onChangeEditorType(newType);
  };

  const handleToggleToForm = () => {
    if (switchError === undefined) {
      changeEditorType(EditorType.Form);
    } else {
      setYAMLWarning(true);
    }
  };

  const handleToggleToYAML = () => {
    setYAML(dump(prune?.(formData) ?? formData, yaml, YAML_TO_JS_OPTIONS));
    changeEditorType(EditorType.YAML);
  };

  const onClickYAMLWarningConfirm = () => {
    setSwitchError(undefined);
    setYAMLWarning(false);
    changeEditorType(EditorType.Form);
  };

  const onClickYAMLWarningCancel = () => {
    setYAMLWarning(false);
  };

  const onChangeType = (newType) => {
    switch (newType) {
      case EditorType.YAML:
        handleToggleToYAML();
        break;
      case EditorType.Form:
        handleToggleToForm();
        break;
      default:
        break;
    }
  };

  return loaded ? (
    <>
      <EditorToggle value={editorType} onChange={onChangeType} />
      {yamlWarning && (
        <Alert
          className="co-synced-editor__yaml-warning"
          variant="danger"
          isInline
          title={t("Invalid YAML cannot be persisted")}
        >
          {displayConversionError && <p>{switchError}</p>}
          <p>{t("Switching to form view will delete any invalid YAML.")}</p>
          <Button variant="danger" onClick={onClickYAMLWarningConfirm}>
            {t("Switch and delete")}
          </Button>
          &nbsp;
          <Button variant="secondary" onClick={onClickYAMLWarningCancel}>
            {t("Cancel")}
          </Button>
        </Alert>
      )}
      {editorType === EditorType.Form ? (
        <FormEditor
          formData={formData}
          onChange={handleFormDataChange}
          prune={prune}
          {...formContext}
        />
      ) : (
        // <YAMLEditor
        //   initialYAML={yaml}
        //   onChange={handleYAMLChange}
        //   {...yamlContext}
        // />
        <div>YAML editor placeholder</div>
      )}
    </>
  ) : (
    <LoadingBox />
  );
};

type FormEditorProps = {
  formData?: K8sResourceKind;
  onChange?: (data: K8sResourceKind) => void;
  prune?: (data: K8sResourceKind) => any;
};

type YAMLEditorProps = {
  initialYAML?: string;
  onChange?: (yaml: string) => void;
};

type SyncedEditorProps = {
  context: {
    formContext: { [key: string]: any };
    yamlContext: { [key: string]: any };
  };
  FormEditor: React.ComponentType<FormEditorProps>;
  initialType?: EditorType;
  initialData?: K8sResourceKind;
  onChangeEditorType?: (newType: EditorType) => void;
  onChange?: (data: K8sResourceKind) => void;
  prune?: (data: K8sResourceKind) => any;
  YAMLEditor: React.ComponentType<YAMLEditorProps>;
  lastViewUserSettingKey: string;
  displayConversionError?: boolean;
};
