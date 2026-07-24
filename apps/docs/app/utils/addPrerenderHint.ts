/**
 * On the server, register a JSON endpoint to be prerendered alongside the
 * current page (via the x-nitro-prerender response header), so its payload is
 * baked in at build time and the client can read it from the static payload.
 * No-op on the client.
 */
export function addPrerenderHint(path: string) {
  if (!import.meta.server) return;

  const event = useRequestEvent();
  if (!event) return;

  const existing = event.node.res.getHeader("x-nitro-prerender");
  const prev = Array.isArray(existing)
    ? existing.join(",")
    : existing
      ? String(existing)
      : "";

  event.node.res.setHeader(
    "x-nitro-prerender",
    [prev, path].filter(Boolean).join(","),
  );
}
