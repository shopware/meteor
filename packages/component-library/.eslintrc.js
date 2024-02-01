require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
  ],
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: './tsconfig.json',
    extraFileExtensions: ['.vue'],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: "@typescript-eslint/parser",
        project: './tsconfig.json',
        extraFileExtensions: ['.vue'],
      },
      extends: [
        'eslint:recommended',
        'plugin:vue/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/strict',
      ],
      rules: {
        /** 
         * Rules need to be disabled because we can't differ between
         * JS and TS .vue files: https://github.com/vuejs/vue-eslint-parser/issues/104
         */
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-dynamic-delete': 'off',
        'no-prototype-builtins': 'off',
        'vue/v-slot-style': ['error', {
          'atComponent': 'shorthand',
          'default': 'shorthand',
          'named': 'shorthand'
        }]
      }
    }
  ]
}