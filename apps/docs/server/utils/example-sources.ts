import { readFileSync } from "node:fs";
import bundledExampleSources from "#meteor-example-sources";

export type ExampleSources = Record<string, { code: string }>;

/**
 * The bundled alias snapshot is baked in when the nitro server is built, so
 * in dev the sources are read from the regenerated template file instead.
 */
export function getExampleSources(): ExampleSources {
  const path = useRuntimeConfig().meteorExampleSourcesPath;

  if (import.meta.dev && typeof path === "string" && path) {
    try {
      return JSON.parse(readFileSync(path, "utf8"));
    } catch {
      // fall back to the bundled snapshot
    }
  }

  return bundledExampleSources;
}
