import type { NavigationMenuItem } from "@nuxt/ui";

// Top-level header navigation, shared between AppHeaderCenter (desktop) and
// AppHeaderBody (mobile menu). `active` matches the whole section, not just the
// linked landing page.
export function useMainNav() {
  const route = useRoute();
  return computed<NavigationMenuItem[]>(() => [
    {
      label: "Documentation",
      to: "/documentation",
      active: route.path.startsWith("/documentation"),
    },
    {
      label: "Components",
      to: "/components",
      active: route.path.startsWith("/components"),
    },
  ]);
}
