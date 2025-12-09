import type { SizeLimitConfig } from "size-limit";
import { external } from "./vite.config";

const ignore = [...external];

module.exports = [
  {
    path: "dist/esm/index.js",
    limit: "950 kb",
    name: "index.js",
    ignore: ignore,
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtButton }",
    name: "MtButton",
    limit: "35 kb",
    ignore: ignore,
  },
  {
    path: "dist/esm/MtButton.js",
    name: "MtButton direct import",
    limit: "3 kb",
    ignore: ignore,
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtCard }",
    name: "MtCard",
    limit: "240 kb",
    ignore: ignore,
  },
  {
    path: "dist/esm/MtCard.js",
    name: "MtCard direct import",
    limit: "210 kb",
    ignore: ignore,
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtIcon }",
    name: "MtIcon",
    limit: "200 kb",
    ignore: ignore,
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtTextEditor }",
    name: "MtTextEditor",
    limit: "800 kb",
    ignore: ignore,
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtDataTable }",
    name: "MtDataTable",
    limit: "260 kb",
    ignore: ignore,
  },
] satisfies SizeLimitConfig;
