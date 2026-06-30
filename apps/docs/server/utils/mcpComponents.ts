import type { H3Event } from "h3";
import type { Collections } from "@nuxt/content";
import { queryCollection } from "@nuxt/content/server";
import { joinURL } from "ufo";
import { pascalCase } from "scule";

export interface ComponentSummary {
  /** kebab-case slug and URL segment, e.g. "action-menu". */
  slug: string;
  /** Library component name, e.g. "MtActionMenu". */
  name: string;
  title: string;
  description: string;
  /** Docs path, e.g. "/components/action-menu". */
  path: string;
  /** Absolute URL to the docs page. */
  url: string;
}

/** All component documentation pages, for the components MCP resource. */
export async function listComponentPages(
  event: H3Event,
): Promise<ComponentSummary[]> {
  const config = useRuntimeConfig(event);
  const baseURL = config.app?.baseURL || "/";
  const siteUrl = getRequestURL(event).origin;

  const pages = await queryCollection(event, "docs" as keyof Collections)
    .where("path", "LIKE", "/components/%")
    .where("path", "NOT LIKE", "%.navigation")
    .select("title", "path", "description")
    .all();

  return pages.map((page) => {
    const slug = page.path.split("/").filter(Boolean).pop() ?? "";
    return {
      slug,
      name: `Mt${pascalCase(slug)}`,
      title: page.title ?? "",
      description: page.description ?? "",
      path: page.path,
      url: siteUrl
        ? joinURL(siteUrl, baseURL, page.path)
        : joinURL(baseURL, page.path),
    };
  });
}
