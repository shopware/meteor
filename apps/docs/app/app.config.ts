export default defineAppConfig({
  seo: {
    title: "Meteor Design System",
    description:
      "Meteor is Shopware's open-source design system that drives our commerce solutions.",
  },
  navigation: {
    // Scope the docs sidebar to the current top-level section only.
    sub: "aside",
  },
  assistant: {
    floatingInput: false,
    explainWithAi: false,
  },
  header: {
    title: "Meteor Design System",
    logo: {
      light: "/shopware-meteor-logo.svg",
      dark: "/shopware-meteor-logo.svg",
      alt: "Shopware Design",
      class: "h-7",
      favicon: "/shopware-signet.svg",
      brandAssetsUrl: "https://brand.shopware.com",
    },
  },
  toc: {
    bottom: {
      title: "Useful resources",
      links: [
        {
          label: "Shopware docs",
          to: "https://developer.shopware.com/",
          target: "_blank",
        },
        {
          label: "Admin SDK docs",
          to: "https://developer.shopware.com/resources/admin-extension-sdk/",
          target: "_blank",
        },
        {
          label: "Brand guidelines",
          to: "https://brand.shopware.com/",
          target: "_blank",
        },
      ],
    },
  },
  github: {
    url: "https://github.com/shopware/meteor",
    branch: "main",
    rootDir: "apps/docs",
  },
  storybook: {
    // Base URL of the deployed component-library Storybook. Component pages link
    // to their autodocs page here (see DocsPageHeaderLinks.vue).
    url: "https://storybook.meteor.shopware.com",
  },
  ui: {
    colors: {
      primary: "brand",
      secondary: "purple",
      success: "green",
      info: "blue",
      warning: "orange",
      error: "red",
      neutral: "zinc",
    },
    pageHeader: {
      slots: {
        root: "border-b-0 pb-0",
        headline: "hidden",
        description: "hidden",
      },
    },
    contentToc: {
      compoundVariants: [
        {
          active: true,
          class: {
            link: "text-[var(--color-text-primary-default)]",
          },
        },
      ],
      defaultVariants: {
        highlightVariant: "straight",
        highlightColor: "neutral",
      },
    },
  },
});
