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
  opts?: { parseFromBeautified?: boolean },
): Promise<HtmlParseDiffResult> {
  const parseFromBeautified = opts?.parseFromBeautified === true;

  const originalBeautified = await formatHtmlForDiff(html ?? "");
  const sourceForParse = parseFromBeautified ? originalBeautified : html ?? "";

  const parsedRaw = await parseWithTiptap(sourceForParse, extensions);
  const parsedBeautified = await formatHtmlForDiff(parsedRaw);

  return {
    hasDiff: originalBeautified !== parsedBeautified,
    originalBeautified,
    parsedBeautified,
    parsedRaw,
  };
}
