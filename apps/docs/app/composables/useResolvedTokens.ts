import { toValue, type MaybeRefOrGetter } from "vue";

/**
 * Resolve a list of CSS custom properties to their computed values for the
 * light theme and (optionally) the dark theme.
 *
 * Resolution requires the browser (getComputedStyle), so the maps are empty
 * during SSR and fill in after mount. Treat the returned values as progressive
 * enhancement: render the visual previews from `var(--token)` directly (which
 * works server-side) and use these resolved strings only for the value labels.
 *
 * Centralises the getComputedStyle logic previously duplicated across the
 * ColorPalette and TokenBrowser components.
 */
export function useResolvedTokens(
  tokens: MaybeRefOrGetter<string[]>,
  options: { dark?: boolean } = {},
) {
  const light = ref<Record<string, string>>({});
  const dark = ref<Record<string, string>>({});
  const ready = ref(false);

  function resolveWith(style: CSSStyleDeclaration, list: string[]) {
    const map: Record<string, string> = {};
    for (const token of list) map[token] = style.getPropertyValue(token).trim();
    return map;
  }

  onMounted(() => {
    const list = toValue(tokens);

    light.value = resolveWith(getComputedStyle(document.documentElement), list);

    if (options.dark) {
      // Resolve dark values from a hidden, dark-themed element so we don't have
      // to toggle the page theme.
      const darkEl = document.createElement("div");
      darkEl.setAttribute("data-theme", "dark");
      darkEl.style.cssText =
        "position:absolute;visibility:hidden;pointer-events:none";
      document.body.appendChild(darkEl);
      dark.value = resolveWith(getComputedStyle(darkEl), list);
      document.body.removeChild(darkEl);
    }

    ready.value = true;
  });

  return { light, dark, ready };
}
