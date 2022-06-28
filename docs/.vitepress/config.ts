import { defineConfigWithTheme } from "vitepress";
import type { Config as ThemeConfig } from "vitepress-shopware-docs";
import baseConfig from "vitepress-shopware-docs/config";
import sidebar from "./sidebar";
import ViteRequireContext from '@originjs/vite-plugin-require-context'

const nav = [
  {
    text: "Apps",
    link: '/apps'
  },
  {
    text: "Themes",
    link: "/themes",
  },
  {
    text: "Frontends",
    link: "/themes",
  },
  {
    text: "Integrations",
    link: "/themes",
  },
  {
    text: "Resources",
    activeMatch: `^/(api)`,
    items: [
      {
        text: "Admin Extension API",
        link: "/resources/admin-extension-api",
      },
      {
        text: "Store API",
        link: "/resources/admin-extension-api",
      },
      {
        text: "Admin API",
        link: "/resources/admin-extension-api",
      }
    ]
  },
];

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  lang: "en-US",
  title: "Shopware",
  description: "Documentation for Shopware developers",
  srcDir: ".",
  // srcExclude: ["tutorial/**/description.md"], In case we need something to be excluded
  scrollOffset: "header",

  head: [],

  themeConfig: {
    // TODO: Add once we have something to link to
    //nav,
    sidebar,

    algolia: {
      indexName: "",
      appId: "",
      apiKey: "",
      // searchParameters: {
      //   facetFilters: ["version:v1"],
      // },
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/shopware/" },
      { icon: "twitter", link: "https://twitter.com/ShopwareDevs" },
      { icon: "slack", link: "https://slack.shopware.com" },
    ],

    // remove if edit not needed
    editLink: {
      repo: "shopware/meteor-icon-kit",
      text: "Edit this page on GitHub",
    },
    appearance: false,
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false,
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ["../.."],
      },
    },
    build: {
      minify: "terser",
      chunkSizeWarningLimit: Infinity,
    },
    json: {
      stringify: true,
    },
    plugins: [
        ViteRequireContext()
    ]
  },

  vue: {
    reactivityTransform: true,
  },
});
