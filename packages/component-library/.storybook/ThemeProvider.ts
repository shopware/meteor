import { useGlobals, useEffect } from "@storybook/preview-api";

export function ThemeProvider(Story) {
  const [globals] = useGlobals();
  const theme: "light" | "dark" = globals.theme ?? "light";

  useEffect(() => {
    const body = document.querySelector("body");
    if (!body) throw new Error("Failed to render story: Root element not found");
    body.setAttribute("data-theme", theme);
    body.style.backgroundColor = "var(--color-elevation-surface-default)";
  }, [theme]);

  return Story();
}
