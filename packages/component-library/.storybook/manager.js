import React from "react";
import { addons, types, useStorybookApi, useStorybookState } from "@storybook/manager-api";
import { IconButton } from "@storybook/components";
import { ShareAltIcon } from "@storybook/icons";
import { shopwareTheme } from "./shopwareTheme";

const DOCS_BASE_URL = "https://meteor.shopware.com";

// Map the active Storybook entry to its page on the docs site. Component titles follow
// "Components/<Name>" and the docs URL uses the kebab-cased name, e.g.
// "Components/Data Table" -> https://meteor.shopware.com/components/data-table.
// Anything outside the Components section (directives, composables) links to the docs home.
function getDocsUrl(title) {
  const segments = (title ?? "").split("/");
  if (segments[0] !== "Components" || !segments[1]) {
    return DOCS_BASE_URL;
  }
  const slug = segments[1].trim().toLowerCase().replace(/\s+/g, "-");
  return `${DOCS_BASE_URL}/components/${slug}`;
}

function DocsLink() {
  const api = useStorybookApi();
  // Subscribe to state so the link updates as the user navigates between stories.
  const { storyId } = useStorybookState();
  const data = api.getCurrentStoryData();
  const href = getDocsUrl(data && data.title);

  return React.createElement(
    IconButton,
    {
      key: storyId,
      as: "a",
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      title: "Open in the Meteor documentation",
    },
    React.createElement("span", { style: { marginRight: 6 } }, "Documentation"),
    React.createElement(ShareAltIcon, null),
  );
}

addons.setConfig({
  theme: shopwareTheme,
  sidebar: {
    collapsedRoots: ["composables", "directives"],
  },
});

addons.register("meteor/docs-link", () => {
  addons.add("meteor/docs-link", {
    type: types.TOOL,
    title: "Meteor documentation",
    match: () => true,
    render: () => React.createElement(DocsLink),
  });
});
