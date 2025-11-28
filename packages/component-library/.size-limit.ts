import type { SizeLimitConfig } from 'size-limit'

const ignore = [
  "vue",
  // "@vue/",
  // "@shopware-ag/meteor-icon-kit",
  // "packages/icon-kit/icons/"
];

module.exports = [
  {
    path: "dist/esm/index.js",
    limit: "10 kb",
    name: "index.js",
    ignore: ignore
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtButton }",
    name: "MtButton",
    limit: "1.5 kb",
    ignore: ignore
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtCard }",
    name: "MtCard",
    limit: "10 kb",
    ignore: ignore
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtIcon }",
    name: "MtIcon",
    limit: "10 kb",
    ignore: ignore
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtTextEditor }",
    name: "MtTextEditor",
    limit: "10 kb",
    ignore: ignore
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtDataTable }",
    name: "MtDataTable",
    limit: "10 kb",
    ignore: ignore
  }
] satisfies SizeLimitConfig