/**
 * Minimal HTML beautifier for readable diffs.
 *
 * Goals:
 * - Insert consistent newlines and indentation between tags
 * - Preserve raw content for pre/code/textarea/script/style
 * - Avoid changing attribute order or text content
 * - No external dependencies; small and fast
 */
export function beautifyHtml(input: string, indentSize = 2): string {
  const html = (input ?? '').replace(/\r\n?/g, '\n');

  const voidTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
    'meta', 'param', 'source', 'track', 'wbr'
  ]);
  const rawTags = new Set(['pre', 'code', 'textarea', 'script', 'style']);

  type Token = { type: 'tag' | 'text' | 'raw'; value: string };
  const tokens: Token[] = [];

  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt === -1) {
      const text = html.slice(i);
      if (text) tokens.push({ type: 'text', value: text });
      break;
    }
    if (lt > i) {
      const text = html.slice(i, lt);
      if (text) tokens.push({ type: 'text', value: text });
      i = lt;
    }

    const gt = html.indexOf('>', i);
    if (gt === -1) {
      // Malformed; append rest as text
      const rest = html.slice(i);
      tokens.push({ type: 'text', value: rest });
      break;
    }

    const tag = html.slice(i, gt + 1);
    tokens.push({ type: 'tag', value: tag });

    // Raw tag handling: capture inner content verbatim until matching closing tag
    const openMatch = tag.match(/^<([a-zA-Z0-9:-]+)(\s|>|\/)*/);
    const tagName = openMatch?.[1]?.toLowerCase();
    if (tagName && rawTags.has(tagName) && !tag.startsWith(`</`)) {
      const closeSeq = new RegExp(`</${tagName}\\s*>`, 'i');
      const rest = html.slice(gt + 1);
      const closeMatch = rest.match(closeSeq);
      if (closeMatch && closeMatch.index !== undefined) {
        const inner = rest.slice(0, closeMatch.index);
        if (inner) tokens.push({ type: 'raw', value: inner });
        const closeTag = rest.slice(closeMatch.index, closeMatch.index + closeMatch[0].length);
        tokens.push({ type: 'tag', value: closeTag });
        i = gt + 1 + closeMatch.index + closeMatch[0].length;
        continue;
      }
    }

    i = gt + 1;
  }

  const lines: string[] = [];
  let indent = 0;
  const pad = () => ' '.repeat(indent * indentSize);

  for (let idx = 0; idx < tokens.length; idx++) {
    const tok = tokens[idx];
    if (tok.type === 'raw') {
      // Output raw content exactly without adding indentation to avoid altering content
      if (tok.value.length > 0) {
        // Ensure raw content starts on its own line
        if (lines.length === 0 || lines[lines.length - 1].length > 0) {
          lines.push('');
        }
        lines.push(tok.value);
      }
      continue;
    }

    if (tok.type === 'text') {
      const value = tok.value.replace(/\s+/g, ' ');
      const trimmed = value.trim();
      if (trimmed) {
        lines.push(pad() + trimmed);
      }
      continue;
    }

    const tag = tok.value;
    const isComment = tag.startsWith('<!--') || tag.startsWith('<!DOCTYPE') || tag.startsWith('<!doctype');
    const isClosing = /^<\//.test(tag);
    const openMatch = tag.match(/^<([a-zA-Z0-9:-]+)/);
    const tName = openMatch?.[1]?.toLowerCase() ?? '';
    const isVoid = voidTags.has(tName);
    const isSelfClose = /\/>\s*$/.test(tag) || isVoid;

    if (isClosing) {
      indent = Math.max(0, indent - 1);
      lines.push(pad() + tag);
      continue;
    }

    if (isComment) {
      lines.push(pad() + tag);
      continue;
    }

    // Opening tag
    lines.push(pad() + tag);
    if (!isSelfClose) {
      indent += 1;
    }
  }

  // Trim trailing blank lines
  while (lines.length && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  return lines.join('\n');
}


