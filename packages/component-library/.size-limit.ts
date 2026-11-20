import type { SizeLimitConfig } from "size-limit";
import { external } from "./vite.config";

const ignore = [...external];

module.exports = [
  {
    path: "dist/esm/index.js",
    limit: "1050 kb",
    name: "index.js",
    ignore: ignore,
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtButton }",
    name: "MtButton",
    limit: "40 kb",
    ignore: ignore,
  },
  {
    path: "dist/esm/MtButton.js",
    name: "MtButton direct import",
    limit: "4 kb",
    ignore: ignore,
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtCard }",
    name: "MtCard",
    limit: "265 kb",
    ignore: ignore,
  },
  {
    path: "dist/esm/MtCard.js",
    name: "MtCard direct import",
    limit: "240 kb",
    ignore: ignore,
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtIcon }",
    name: "MtIcon",
    limit: "225 kb",
    ignore: ignore,
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtTextEditor }",
    name: "MtTextEditor",
    limit: "880 kb",
    ignore: ignore,
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtDataTable }",
    name: "MtDataTable",
    limit: "290 kb",
    ignore: ignore,
  },
] satisfies SizeLimitConfig;
