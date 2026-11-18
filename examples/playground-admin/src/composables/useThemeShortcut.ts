import { onBeforeUnmount, onMounted } from "vue";
import { useTheme } from "@shopware-ag/meteor-component-library";

export function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/** `D` switches between the light and the dark theme. */
export function useThemeShortcut() {
  const { resolvedTheme, setTheme } = useTheme();

  function onKeydown(event: KeyboardEvent) {
    if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
    if (isTyping(event.target) || event.key.toLowerCase() !== "d") return;
    setTheme(resolvedTheme.value === "dark" ? "light" : "dark");
  }

  onMounted(() => window.addEventListener("keydown", onKeydown));
  onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
}
