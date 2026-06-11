import type {
  Collections,
  MinimarkElement,
  MinimarkNode,
  MinimarkTree,
} from "@nuxt/content";
import { queryCollection } from "@nuxt/content/server";
import { createError, type H3Event, setHeader } from "h3";
import { stringify } from "minimark/stringify";
import { withLeadingSlash } from "ufo";
import collections from "#content/manifest";
import { useRuntimeConfig } from "#imports";
import { flattenMarkdown } from "./markdown-export";

type RawMarkdownConfig = false | { excludeCollections?: string[] };
type RuntimeLlmsConfig = { contentRawMarkdown?: RawMarkdownConfig };
type ContentLink = { label: string; to: string };

export async function renderRawMarkdown(
  event: H3Event,
  slug: string | undefined,
) {
  const config = useRuntimeConfig(event);
  const llmsConfig = config.llms as RuntimeLlmsConfig | undefined;

  if (!slug?.endsWith(".md") || llmsConfig?.contentRawMarkdown === false) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found",
      fatal: true,
    });
  }

  let path = withLeadingSlash(slug.replace(".md", ""));
  if (path.endsWith("/index")) {
    path = path.substring(0, path.length - 6);
  }

  const rawMarkdownOptions =
    typeof llmsConfig?.contentRawMarkdown === "object"
      ? llmsConfig.contentRawMarkdown
      : {};
  const excludeCollections = rawMarkdownOptions.excludeCollections || [];
  const collectionNames = Object.entries(collections)
    .filter(
      ([key, value]) =>
        value.type === "page" && !excludeCollections.includes(key),
    )
    .map(([key]) => key);

  let page: Awaited<ReturnType<typeof findPage>> = null;
  for (const collection of collectionNames) {
    page = await findPage(event, collection, path);
    if (page) break;
  }

  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found",
      fatal: true,
    });
  }

  const body = structuredClone(page.body) as MinimarkTree;
  body.type = "minimark";

  if (!isElement(body.value[0], "h1")) {
    body.value.unshift(["blockquote", {}, page.description || ""]);
    body.value.unshift(["h1", {}, page.title || ""]);
  }

  const pageWithLinks = page as typeof page & {
    links?: unknown;
    meta?: { links?: unknown };
  };
  const links = Array.isArray(pageWithLinks.links)
    ? pageWithLinks.links
    : pageWithLinks.meta?.links;
  if (Array.isArray(links)) {
    const linkItems = links
      .filter(isContentLink)
      .map(
        (link): MinimarkNode => [
          "li",
          {},
          ["a", { href: link.to }, link.label],
        ],
      );

    if (linkItems.length > 0) {
      body.value.push(["hr", {}]);
      body.value.push(["ul", {}, ...linkItems]);
    }
  }

  const markdown = stringify(body, { format: "markdown/html" });

  setHeader(event, "Content-Type", "text/markdown; charset=utf-8");
  return `${flattenMarkdown(markdown)}\n`;
}

function findPage(event: H3Event, collection: string, path: string) {
  return queryCollection(event, collection as keyof Collections)
    .path(path)
    .first();
}

function isElement(
  node: MinimarkNode | undefined,
  tagName: string,
): node is MinimarkElement {
  return Array.isArray(node) && node[0] === tagName;
}

function isContentLink(link: unknown): link is ContentLink {
  return (
    typeof link === "object" &&
    link !== null &&
    "label" in link &&
    "to" in link &&
    typeof link.label === "string" &&
    typeof link.to === "string"
  );
}
