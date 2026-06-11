import { defineNitroPlugin } from "nitropack/runtime";
import type { MinimarkNode } from "@nuxt/content";
import {
  flattenMarkdown,
  getMeteorPageMeta,
  renderMeteorPageMetaNodes,
} from "../utils/markdown-export";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook(
    "content:llms:generate:document",
    (_event, doc: { body?: { value?: MinimarkNode[] } }) => {
      const metadataNodes = renderMeteorPageMetaNodes(
        getMeteorPageMeta(doc),
      ) as MinimarkNode[];

      if (metadataNodes.length > 0 && Array.isArray(doc.body?.value)) {
        doc.body.value.unshift(...metadataNodes);
      }
    },
  );

  nitroApp.hooks.hook("llms:generate:full", (_event, _options, contents) => {
    for (let index = 0; index < contents.length; index += 1) {
      contents[index] = flattenMarkdown(contents[index]);
    }
  });
});
