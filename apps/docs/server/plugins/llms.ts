import { transformMeteorMdc } from "../utils/transformMeteorMdc";

interface LlmsSection {
  links?: { href: string }[];
}

function toRawMarkdownLink(href: string) {
  // Leave non-page links (e.g. the llms-full.txt documentation set) alone.
  if (href.endsWith(".txt") || href.endsWith(".md")) {
    return href;
  }
  return (
    href
      .replace(
        /^(https?:\/\/[^/]+)?(\/.*?)\/?$/,
        (_match, origin, path) => `${origin ?? ""}/raw${path}.md`,
      )
      // The index page has an empty path, yielding "/raw/.md"; map it to the
      // index document the raw route expects (matches the built-in behavior).
      .replace(/\/raw\/\.md$/, "/raw/index.md")
  );
}

/**
 * Applies the meteor MDC transform when @nuxt/content generates documents
 * for llms-full.txt, so dynamic components are exported as real markdown.
 * Also rewrites llms.txt links to the /raw/*.md endpoints, which the
 * built-in rewriting no longer does because contentRawMarkdown is disabled
 * in favor of our own raw route.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook(
    "content:llms:generate:document" as never,
    (_event: unknown, doc: unknown) => {
      transformMeteorMdc(doc as never, { tableAs: "node" });
    },
  );

  nitroApp.hooks.hook(
    "llms:generate" as never,
    (_event: unknown, llms: { sections?: LlmsSection[] }) => {
      for (const section of llms.sections ?? []) {
        section.links = section.links?.map((link) => ({
          ...link,
          href: toRawMarkdownLink(link.href),
        }));
      }
    },
  );
});
