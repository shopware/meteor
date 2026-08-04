import { listComponentPages } from "../../utils/mcpComponents";

export default defineMcpResource({
  description:
    "Catalog of all Meteor Design System components (name, slug, title, description, docs URL).",
  uri: "meteor://components",
  metadata: { mimeType: "application/json" },
  cache: "1h",
  handler: async (uri) => {
    const event = useEvent();
    const components = await listComponentPages(event);
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(components),
        },
      ],
    };
  },
});
