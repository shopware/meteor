import { withLeadingSlash } from "ufo";
import { stringify } from "minimark/stringify";
import { queryCollection } from "@nuxt/content/server";
import type { Collections, PageCollectionItemBase } from "@nuxt/content";
import collections from "#content/manifest";
import { transformMeteorMdc } from "../../utils/transformMeteorMdc";

/**
 * Overrides @nuxt/content's built-in raw markdown route. The built-in route
 * serializes the parsed AST as-is, which would leave dynamic MDC components
 * like :component-api as unreadable tags. This version runs the meteor
 * MDC transform first so the export contains real markdown tables.
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParams(event)["slug.md"];
  if (!slug?.endsWith(".md")) {
    throw createError({ statusCode: 404 });
  }

  let path = withLeadingSlash(slug.replace(".md", ""));
  if (path.endsWith("/index")) {
    path = path.substring(0, path.length - 6) || "/";
  }

  const pageCollections = Object.entries(
    collections as unknown as Record<string, { type: string }>,
  )
    .filter(([, value]) => value.type === "page")
    .map(([key]) => key);

  let page: PageCollectionItemBase | null = null;
  for (const collection of pageCollections) {
    page = (await queryCollection(event, collection as keyof Collections)
      .path(path)
      .first()) as PageCollectionItemBase | null;
    if (page) break;
  }

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: "Page not found" });
  }

  transformMeteorMdc(page as never, { tableAs: "string" });

  const body = page.body as { value: unknown[][] };
  if (body.value[0]?.[0] !== "h1") {
    if (page.description) {
      body.value.unshift(["blockquote", {}, page.description]);
    }
    body.value.unshift(["h1", {}, page.title]);
  }

  setHeader(event, "Content-Type", "text/markdown; charset=utf-8");
  return stringify(
    { ...page.body, type: "minimark" },
    { format: "markdown/html" },
  );
});
