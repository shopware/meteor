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
    limit: "1100 kb",
    name: "index.js",
    ignore: ignore
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtButton }",
    name: "MtButton",
    limit: "35 kb",
    ignore: ignore
  },
  {
    path: "dist/esm/MtButton.js",
    name: "MtButton direct import",
    limit: "3 kb",
    ignore: ignore
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtCard }",
    name: "MtCard",
    limit: "250 kb",
    ignore: ignore
  },
  {
    path: "dist/esm/MtCard.js",
    name: "MtCard direct import",
    limit: "230 kb",
    ignore: ignore
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtIcon }",
    name: "MtIcon",
    limit: "200 kb",
    ignore: ignore
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtTextEditor }",
    name: "MtTextEditor",
    limit: "810 kb",
    ignore: ignore
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtDataTable }",
    name: "MtDataTable",
    limit: "270 kb",
    ignore: ignore
  }
] satisfies SizeLimitConfig