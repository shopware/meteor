import { defineNitroPlugin } from "nitropack/runtime";
import { flattenMarkdown } from "../utils/markdown-export";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("llms:generate:full", (_event, _options, contents) => {
    for (let index = 0; index < contents.length; index += 1) {
      contents[index] = flattenMarkdown(contents[index]);
    }
  });
});
