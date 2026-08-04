import { pascalCase } from "scule";

/**
 * Canonical lookup key for a component example.
 *
 * The build module (modules/component-examples.ts) writes each example's JSON
 * keyed by Nuxt's filename-derived PascalName (e.g. SearchBasicExample.vue ->
 * "SearchBasicExample"). Every runtime consumer (the API route, the raw/llms
 * markdown transform, and the ComponentExample component) must derive the same
 * key from the example's kebab-case name, so they all funnel through here
 * instead of re-implementing the conversion. pascalCase("search-basic-example")
 * === "SearchBasicExample", matching the build-time name.
 */
export function exampleKey(name: string): string {
  return pascalCase(name);
}
