import type { Extension } from "@tiptap/core";
import { parseWithTiptap } from "./parse-with-tiptap";

export interface HtmlParseDiffResult {
  hasDiff: boolean;
  originalBeautified: string;
  parsedBeautified: string;
  parsedRaw: string;
}

export async function formatHtmlForDiff(input: string): Promise<string> {
  const src = input ?? "";
  if (!src) return "";
  try {
    const mod: any = await import("js-beautify");
    const beautifyHtml = mod.html as (s: string, o?: Record<string, unknown>) => string;
    return beautifyHtml(src, {
      indent_size: 2,
      preserve_newlines: true,
      content_unformatted: ["pre", "code", "textarea", "script", "style"],
      wrap_line_length: 0,
      end_with_newline: false,
      extra_liners: [],
    });
  } catch {
    return src;
  }
}

export async function getHtmlParseDiff(
  html: string,
  extensions: Extension[],
  opts?: { parseFromBeautified?: boolean; ignoreBlankLines?: boolean },
): Promise<HtmlParseDiffResult> {
  const parseFromBeautified = opts?.parseFromBeautified === true;
  const ignoreBlankLines = opts?.ignoreBlankLines === true;

  const originalBeautified = await formatHtmlForDiff(html ?? "");
  const sourceForParse = parseFromBeautified ? originalBeautified : html ?? "";

  const parsedRaw = await parseWithTiptap(sourceForParse, extensions);
  const parsedBeautified = await formatHtmlForDiff(parsedRaw);
  const normalizeForDiff = (value: string) => {
    if (!ignoreBlankLines) return value;
    const src = value ?? "";
    const domNormalized =
      typeof DOMParser === "undefined"
        ? src
        : new DOMParser().parseFromString(src, "text/html").body.innerHTML;
    const withoutEmptyParagraphs = domNormalized.replace(
      /<p[^>]*>(\s|&nbsp;|<br[^>]*>)*<\/p>/gi,
      "",
    );
    const withoutBlankLines = withoutEmptyParagraphs
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
      .join("\n");
    return withoutBlankLines.replace(/>\s+</g, "><").trim();
  };

  const hasDiff = normalizeForDiff(originalBeautified) !== normalizeForDiff(parsedBeautified);

  return {
    hasDiff,
    originalBeautified,
    parsedBeautified,
    parsedRaw,
  };
}
