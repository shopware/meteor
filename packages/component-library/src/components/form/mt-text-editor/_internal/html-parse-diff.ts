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

function normalizeHtmlForDiff(input: string): string {
  const src = input ?? "";
  if (!src) return "";

  const withoutEmptyParagraphs = src.replace(
    /<p>(?:\s|<br\s*\/?>)*<\/p>/gi,
    "",
  );
  const compacted = withoutEmptyParagraphs.replace(/\n\s*\n+/g, "\n");

  if (typeof DOMParser === "undefined") {
    return compacted
      .split("\n")
      .map((line) => line.trim().length === 0 ? "" : line)
      .filter((line) => line.length > 0)
      .join("\n");
  }

  const doc = new DOMParser().parseFromString(compacted, "text/html");
  const skipTags = new Set(["PRE", "CODE", "TEXTAREA", "SCRIPT", "STYLE"]);
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const removeNodes: Text[] = [];
  let node = walker.nextNode() as Text | null;

  while (node) {
    const parent = node.parentElement;
    if (!parent || !skipTags.has(parent.tagName)) {
      if ((node.nodeValue ?? "").trim().length === 0) {
        removeNodes.push(node);
      }
    }
    node = walker.nextNode() as Text | null;
  }

  removeNodes.forEach((textNode) => textNode.parentNode?.removeChild(textNode));

  doc.body.querySelectorAll("p").forEach((paragraph) => {
    const hasNonWhitespaceText = Array.from(paragraph.childNodes).some(
      (node) => node.nodeType === Node.TEXT_NODE && (node.nodeValue ?? "").trim().length > 0,
    );
    const hasNonBrElement = Array.from(paragraph.children).some(
      (element) => element.tagName !== "BR",
    );

    if (!hasNonWhitespaceText && !hasNonBrElement) {
      paragraph.remove();
    }
  });

  return doc.body.innerHTML;
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

  const normalizedOriginal = normalizeHtmlForDiff(html ?? "");
  const normalizedParsed = normalizeHtmlForDiff(parsedRaw);

  return {
    hasDiff: normalizedOriginal !== normalizedParsed,
    originalBeautified,
    parsedBeautified,
    parsedRaw,
  };
}
