import { DESCRIPTIONS, tokenGroups } from "#shared/data/tokens";

const tokens = tokenGroups.map((group) => ({
  group: group.name,
  tokens: group.tokens.map((token) => ({
    token,
    description: DESCRIPTIONS[token] || "",
  })),
}));

export default defineMcpResource({
  description:
    "Catalog of Meteor design tokens grouped by category, each with its description.",
  uri: "meteor://tokens",
  metadata: { mimeType: "application/json" },
  cache: "1h",
  handler: async (uri) => {
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(tokens),
        },
      ],
    };
  },
});
