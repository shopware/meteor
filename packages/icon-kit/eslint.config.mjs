// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config([
  {
    // src/autocrop is vendored third-party CommonJS (see src/autocrop/README.md)
    ignores: ["node_modules/", "dist/", "src/autocrop/"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
