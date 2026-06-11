export default defineAppConfig({
  seo: {
    title: "Meteor Design System",
    description:
      "Meteor is Shopware's open-source design system that drives our commerce solutions.",
  },
  header: {
    title: "Meteor Design System",
    logo: {
      light: "/shopware-logo.svg",
      dark: "/shopware-logo.svg",
      alt: "Shopware Design",
      class: "h-7",
      favicon: "/shopware-signet.svg",
      brandAssetsUrl: "https://brand.shopware.com",
    },
  },
  socials: {
    github: "https://github.com/shopware/meteor",
  },
  github: {
    url: "https://github.com/shopware/meteor",
    branch: "main",
    rootDir: "apps/docs",
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
