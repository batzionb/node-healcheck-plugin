import { NodeHealthCheckFormValues } from "./types";
import * as yup from "yup";
import i18next from "i18next";
import { EditorType } from "components/copiedFromConsole/synced-editor/editor-toggle";
//TODO: add minHealthy validation
const formDataSchema = (values: NodeHealthCheckFormValues) =>
  yup.object({
    name: yup.string().required(i18next.t("Required")),
  });

export const validationSchema = () =>
  yup.mixed().test({
    test(values: NodeHealthCheckFormValues) {
      const formYamlDefinition = yup.object({
        editorType: yup
          .string()
          .oneOf(Object.values(EditorType))
          .required(i18next.t("Required")),
        formData: yup.mixed().when("editorType", {
          is: EditorType.Form,
          then: formDataSchema(values),
        }),
        yamlData: yup.mixed().when("editorType", {
          is: EditorType.YAML,
          then: yup.string().required(i18next.t("Required")),
        }),
      });

      return formYamlDefinition.validate(values, { abortEarly: false });
    },
  });
