export interface LessonProseTokenText {
  type: "text";
  value: string;
}

export interface LessonProseTokenCode {
  type: "code";
  value: string;
}

export interface LessonProseTokenLink {
  type: "link";
  value: string;
  href: string;
}

export type LessonProseToken =
  | LessonProseTokenText
  | LessonProseTokenCode
  | LessonProseTokenLink;

export interface LessonProseHeadingBlock {
  type: "heading";
  value: string;
}

export interface LessonProseParagraphBlock {
  type: "paragraph";
  paragraphs: LessonProseToken[];
}

export interface LessonProseBulletBlock {
  type: "bullet";
  bullets: LessonProseToken[][];
}

export type LessonProseBlock =
  | LessonProseHeadingBlock
  | LessonProseParagraphBlock
  | LessonProseBulletBlock;

const inlinePattern = /`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;

export function stripLeadingTitle(markdown: string): string {
  return markdown.replace(/^#\s+[^\n]+\n+/, "").trim();
}

function parseInlineTokens(value: string): LessonProseToken[] {
  const tokens: LessonProseToken[] = [];
  let previousIndex = 0;

  for (const match of value.matchAll(inlinePattern)) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > previousIndex) {
      tokens.push({
        type: "text",
        value: value.slice(previousIndex, matchIndex),
      });
    }

    if (match[1]) {
      tokens.push({
        type: "code",
        value: match[1],
      });
    } else if (match[2] && match[3]) {
      tokens.push({
        type: "link",
        value: match[2],
        href: match[3],
      });
    }

    previousIndex = matchIndex + match[0].length;
  }

  if (previousIndex < value.length) {
    tokens.push({
      type: "text",
      value: value.slice(previousIndex),
    });
  }

  return tokens.length > 0 ? tokens : [{ type: "text", value }];
}

export function formatLessonProse(markdown: string): LessonProseBlock[] {
  const prose = stripLeadingTitle(markdown);

  if (!prose) {
    return [];
  }

  const blocks: LessonProseBlock[] = [];
  const sections = prose.split(/\n{2,}/);

  for (const section of sections) {
    const trimmedSection = section.trim();

    if (!trimmedSection) {
      continue;
    }

    if (trimmedSection.startsWith("## ")) {
      blocks.push({
        type: "heading",
        value: trimmedSection.slice(3).trim(),
      });
      continue;
    }

    const lines = trimmedSection.split("\n");
    const bulletLines = lines.filter((line) => /^[-*]\s+/.test(line.trim()));

    if (bulletLines.length === lines.length) {
      blocks.push({
        type: "bullet",
        bullets: bulletLines.map((line) => parseInlineTokens(line.trim().replace(/^[-*]\s+/, ""))),
      });
      continue;
    }

    blocks.push({
      type: "paragraph",
      paragraphs: parseInlineTokens(lines.join(" ")),
    });
  }

  return blocks;
}
