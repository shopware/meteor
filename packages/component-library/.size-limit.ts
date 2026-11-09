import type { SizeLimitConfig } from "size-limit";

// Each check measures what an app loads up front: the entry file and the files it imports. Files
// loaded later with import(), such as the icons and the date-fns locales, don't count.
// Dependencies count too, except these, as before.
const ignore = ["vue", "vue-i18n", "apexcharts"];

// Rolldown can't bundle CSS, so the budgets measure JavaScript only
const modifyRolldownConfig = (config: object) => ({
  ...config,
  moduleTypes: { ".css": "empty" },
});

const check = { ignore, modifyRolldownConfig };

export default [
  {
    ...check,
    path: "dist/index.js",
    entry: "index",
    limit: "740 kb",
    name: "index.js",
  },
  {
    ...check,
    path: "dist/index.js",
    import: "{ MtButton }",
    entry: "index",
    name: "MtButton",
    limit: "1.5 kb",
  },
  {
    ...check,
    path: "dist/exports/MtButton.js",
    entry: "MtButton",
    name: "MtButton direct import",
    limit: "1.5 kb",
  },
  {
    ...check,
    path: "dist/index.js",
    import: "{ MtCard }",
    entry: "index",
    name: "MtCard",
    limit: "36 kb",
  },
  {
    ...check,
    path: "dist/exports/MtCard.js",
    entry: "MtCard",
    name: "MtCard direct import",
    limit: "36 kb",
  },
  {
    ...check,
    path: "dist/index.js",
    import: "{ MtIcon }",
    entry: "index",
    name: "MtIcon",
    limit: "17.5 kb",
  },
  {
    ...check,
    path: "dist/index.js",
    import: "{ MtTextEditor }",
    entry: "index",
    name: "MtTextEditor",
    limit: "605 kb",
  },
  {
    ...check,
    path: "dist/index.js",
    import: "{ MtDataTable }",
    entry: "index",
    name: "MtDataTable",
    limit: "78 kb",
  },
] satisfies SizeLimitConfig;
