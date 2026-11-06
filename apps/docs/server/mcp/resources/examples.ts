// @ts-expect-error virtual module provided by modules/component-examples.ts
import { listComponentExamples } from "#component-example/nitro";

export default defineMcpResource({
  description:
    "Catalog of all documented Meteor examples and blocks (name, pascalName, kind, owning component or block group).",
  uri: "meteor://examples",
  metadata: { mimeType: "application/json" },
  cache: "1h",
  handler: async (uri) => {
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(listComponentExamples()),
        },
      ],
    };
  },
});
