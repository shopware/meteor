import type { SizeLimitConfig } from 'size-limit'

module.exports = [
  {
    path: "dist/esm/index.js",
    limit: "10 kb"
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtButton }",
    limit: "10 kb"
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtCard }",
    limit: "10 kb"
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtIcon }",
    limit: "10 kb"
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtTextEditor }",
    limit: "10 kb"
  },
  {
    path: "dist/esm/index.js",
    import: "{ MtDataTable }",
    limit: "10 kb"
  }
] satisfies SizeLimitConfig