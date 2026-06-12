export default defineEventHandler((event) => {
  const name = (getRouterParam(event, "name") || "").replace(/\.json$/, "");
  const example = getExampleSources()[name];

  if (!example) {
    throw createError({ statusCode: 404, statusMessage: "Example not found" });
  }

  return example;
});
