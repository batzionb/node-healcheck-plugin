import { EditorType } from "components/copiedFromConsole/synced-editor/editor-toggle";
import { getFormData } from "./formData";
import { initialNodeHealthCheckData } from "./initialNodeHealthCheckData";
import { NodeHealthCheck, NodeHealthCheckFormValues } from "./types";
import { dump } from "js-yaml";

export const fromNodeHealthCheck = (
  existingNodeHealthCheck: NodeHealthCheck,
  isCreateFlow: boolean
): NodeHealthCheckFormValues => {
  const nodeHealthCheck = {
    ...initialNodeHealthCheckData,
    ...existingNodeHealthCheck,
  };
  const yamlData = dump(nodeHealthCheck, "", {
    skipInvalid: true,
  });
  let formParsingError = null;
  let formData = null;
  let editorType = EditorType.YAML;
  try {
    formData = getFormData(nodeHealthCheck, false);
    editorType = EditorType.Form;
  } catch (err) {
    if (typeof err === "string") {
      formParsingError = err;
    } else {
      formParsingError = "Unexpected parsing error";
      console.error(err);
    }
  }
  return {
    isCreateFlow,
    editorType,
    yamlData,
    formData,
    resourceVersion: existingNodeHealthCheck?.metadata?.resourceVersion ?? null,
    formReloadCount: 0,
    formParsingError: formParsingError,
  };
};
