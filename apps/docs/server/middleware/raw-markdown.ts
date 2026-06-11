import { defineEventHandler, getRequestURL } from "h3";
import { renderRawMarkdown } from "../utils/raw-markdown";

export default defineEventHandler((event) => {
  const pathname = getRequestURL(event).pathname;

  if (!pathname.startsWith("/raw/") || !pathname.endsWith(".md")) {
    return;
  }

  return renderRawMarkdown(
    event,
    decodeURIComponent(pathname.slice("/raw/".length)),
  );
});
