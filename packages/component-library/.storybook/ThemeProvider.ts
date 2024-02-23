import { useGlobals, useEffect } from "@storybook/preview-api";

type BackgroundsGlobal = null | {
  value: string;
};

export const LIGHT_THEME_BACKGROUND_VALUE = "#FFFFFF";
export const DARK_THEME_BACKGROUND_VALUE = "#141418";

export function ThemeProvider(Story) {
  const [globals] = useGlobals();
  const backgrounds: BackgroundsGlobal = globals.backgrounds;
  const theme = useThemeStyle(backgrounds?.value);

  useEffect(() => {
    const rootStoryElement = document.querySelector("body");
    if (!rootStoryElement) throw new Error("Failed to render story: Root element not found");

    rootStoryElement.setAttribute("data-theme", theme);
  }, [backgrounds]);

  return Story();
}

function useThemeStyle(value: string | undefined): "dark" | "light" | "auto" {
  switch (value) {
    case DARK_THEME_BACKGROUND_VALUE:
      return "dark";
    case LIGHT_THEME_BACKGROUND_VALUE:
      return "light";
    default:
      return "auto";
  }
}
