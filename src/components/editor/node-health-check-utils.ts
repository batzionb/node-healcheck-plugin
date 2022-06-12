// import * as _ from "lodash";
// import * as yup from "yup";
// import i18next from "i18next";
// import {
//   Labels,
//   NodeHealthCheck,
//   NodeHealthCheckFormData,
//   NodeHealthCheckFormValues,
// } from "../../data/types";
// import { dump } from "../../utils/yaml";
// import { EditorType } from "../copiedFromConsole/synced-editor/editor-toggle";
// import { getLabelDisplayName } from "./formView/nodeSelectionField/utils";
// import {
//   initialFormData,
//   initialNodeHealthCheckData,
// } from "../../data/initialValues";

// const getFormDataLabelDisplayNames = (labelsMap: Labels): string[] => {
//   return Object.entries(labelsMap).map(([key, value]) =>
//     getLabelDisplayName(key, value)
//   );
// };

// export const getNodeHealthCheckFormData = (
//   formData: NodeHealthCheckFormData,
//   yamlData: NodeHealthCheck
// ): NodeHealthCheckFormData => {
//   if (!yamlData) {
//     return { ...initialFormData };
//   }
//   return {
//     ...formData,
//     name: _.isString(yamlData?.metadata?.name) ? yamlData?.metadata?.name : "",
//     selector: getFormDataLabelDisplayNames(
//       yamlData.spec?.selector?.matchLabels
//     ),
//   };
// };

// const getNodeHealthCheckSelector = (
//   labelDisplayNames: string[]
// ): NodeHealthCheck["spec"]["selector"] | undefined => {
//   const labels: Labels = {};
//   for (const displayName of labelDisplayNames) {
//     const [key, value] = displayName.split("=");
//     labels[key] = value;
//   }
//   if (Object.keys(labels).length === 0) {
//     return undefined;
//   }
//   return {
//     matchLabels: labels,
//   };
// };

// export const getNodeHealthCheckData = (
//   values: { formData: NodeHealthCheckFormData },
//   existingNodeHealthCheck: NodeHealthCheck
// ): NodeHealthCheck => {
//   const { name, selector, minHealthy } = values.formData;
//   return _.merge<{}, NodeHealthCheck, NodeHealthCheck>(
//     {},
//     initialNodeHealthCheckData,
//     {
//       ...existingNodeHealthCheck,
//       metadata: {
//         ...existingNodeHealthCheck?.metadata,
//         name,
//       },
//       spec: {
//         ...existingNodeHealthCheck?.spec,
//         selector: getNodeHealthCheckSelector(selector),
//         minHealthy,
//       },
//     }
//   );
// };

// export const sanitizeToYaml = (
//   formData: NodeHealthCheckFormData,
//   NodeHealthCheck?: NodeHealthCheck
// ): string => {
//   const NodeHealthCheckObj = getNodeHealthCheckData(
//     { formData },
//     NodeHealthCheck
//   );
//   return dump(NodeHealthCheckObj, "yamlData", {
//     skipInvalid: true,
//   });
// };

// export const sanitizeToForm = (
//   formData: NodeHealthCheckFormData,
//   yamlData?: NodeHealthCheck
// ): NodeHealthCheckFormData => {
//   const newFormData = getNodeHealthCheckFormData(formData, yamlData);
//   return _.merge({}, initialFormData, newFormData);
// };

// export const getNodeHealthCheckInitialValues = (
//   NodeHealthCheck: NodeHealthCheck,
//   isCreateFlow: boolean
// ): NodeHealthCheckFormValues => {
//   const initialNodeHealthCheckFormData =
//     getInitialNodeHealthCheckFormData(NodeHealthCheck);
//   const initialYamData = sanitizeToYaml(
//     initialNodeHealthCheckFormData,
//     NodeHealthCheck
//   );
//   return {
//     isCreateFlow,
//     editorType: EditorType.Form,
//     yamlData: initialYamData,
//     formData: {
//       ...initialNodeHealthCheckFormData,
//     },
//     resourceVersion: NodeHealthCheck?.metadata?.resourceVersion ?? null,
//     formReloadCount: 0,
//   };
// };

// //TODO: add minHealthy validation
// const formDataSchema = (values: NodeHealthCheckFormValues) =>
//   yup.object({
//     name: yup.string().required(i18next.t("Required")),
//   });

// export const validationSchema = () =>
//   yup.mixed().test({
//     test(values: NodeHealthCheckFormValues) {
//       const formYamlDefinition = yup.object({
//         editorType: yup
//           .string()
//           .oneOf(Object.values(EditorType))
//           .required(i18next.t("Required")),
//         formData: yup.mixed().when("editorType", {
//           is: EditorType.Form,
//           then: formDataSchema(values),
//         }),
//         yamlData: yup.mixed().when("editorType", {
//           is: EditorType.YAML,
//           then: yup.string().required(i18next.t("Required")),
//         }),
//       });

//       return formYamlDefinition.validate(values, { abortEarly: false });
//     },
//   });
