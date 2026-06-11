import { defineEventHandler, getRouterParams } from "h3";
import { renderRawMarkdown } from "../../utils/raw-markdown";

export default defineEventHandler((event) =>
  renderRawMarkdown(event, getRouterParams(event)["slug.md"]),
);
