import iconMeta from "@icon-kit/icons/meta.json";

interface IconMetaEntry {
  name: string;
  mode: "regular" | "solid";
  tags?: string[];
}

const icons = (iconMeta as IconMetaEntry[]).map((icon) => ({
  name: icon.name,
  mode: icon.mode,
  fullName: `${icon.mode}-${icon.name}`,
  tags: icon.tags ?? [],
}));

export default defineMcpResource({
  description:
    "Catalog of all Meteor icon-kit icons (name, mode, fullName, tags) for use with MtIcon.",
  uri: "meteor://icons",
  metadata: { mimeType: "application/json" },
  cache: "1h",
  handler: async (uri) => {
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(icons),
        },
      ],
    };
  },
});
