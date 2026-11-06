/** A page, or a folder of pages when it has `children`. */
export interface PageNode {
  id: string;
  label: string;
  children?: PageNode[];
}

// Placeholder content: a small documentation site, up to three levels deep like `mt-nav`.
export const pageTree: PageNode[] = [
  { id: "getting-started", label: "Getting started" },
  {
    id: "guides",
    label: "Guides",
    children: [
      { id: "installation", label: "Installation" },
      { id: "configuration", label: "Configuration" },
      {
        id: "deployment",
        label: "Deployment",
        children: [
          { id: "staging", label: "Staging" },
          { id: "production", label: "Production" },
        ],
      },
    ],
  },
  {
    id: "reference",
    label: "Reference",
    children: [
      { id: "components", label: "Components" },
      { id: "tokens", label: "Tokens" },
      { id: "icons", label: "Icons" },
    ],
  },
  { id: "release-notes", label: "Release notes" },
];

/** The folders down to the page and the page itself, or `undefined` for an unknown id. */
export function findPagePath(
  id: string,
  nodes: PageNode[] = pageTree,
): PageNode[] | undefined {
  for (const node of nodes) {
    if (node.id === id && !node.children) return [node];

    const path = node.children && findPagePath(id, node.children);
    if (path) return [node, ...path];
  }

  return undefined;
}
