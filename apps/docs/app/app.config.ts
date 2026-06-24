export default defineAppConfig({
  seo: {
    title: "Meteor Design System",
    description:
      "Meteor is Shopware's open-source design system that drives our commerce solutions.",
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
          icon: "i-lucide-book-open",
          to: "https://developer.shopware.com/",
          target: "_blank",
        },
        {
          label: "Brand guidelines",
          icon: "i-lucide-palette",
          to: "https://brand.shopware.com/",
          target: "_blank",
        },
        {
          label: "Admin SDK",
          icon: "i-lucide-plug",
          to: "https://developer.shopware.com/resources/admin-extension-sdk/",
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
