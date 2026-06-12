import { pascalCase } from "scule";
// eslint and typescript resolve this at build time via the nitro virtual module
// @ts-expect-error virtual module provided by modules/component-examples.ts
import { getComponentExample } from "#component-example/nitro";

export default defineEventHandler((event) => {
  const name = getRouterParam(event, "name")?.replace(/\.json$/, "") ?? "";
  const example = getComponentExample(pascalCase(name));

  if (!example) {
    throw createError({
      statusCode: 404,
      statusMessage: "Component example not found",
    });
  }

  return example as { code: string; pascalName: string };
});
