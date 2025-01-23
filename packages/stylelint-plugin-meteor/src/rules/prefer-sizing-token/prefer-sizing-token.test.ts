import { testRule } from "stylelint-test-rule-node";

import plugin from "./index.js";

const {
  // @ts-expect-error - Cannot infer type correctly
  rule: { ruleName },
} = plugin;

testRule({
  plugins: [plugin],
  ruleName,
  config: true,
  fix: true,

  accept: [
    { code: ".a { margin: var(--scale-size-0); }" },
    { code: ".a { margin: 0; }" },
    { code: ".a { height: 0px; }" },
    { code: ".a { padding: 50%; }" },
    { code: ".a { margin: auto; }" },
    { code: ".a { margin: inherit; }" },
    { code: ".a { margin: initial; }" },
    { code: ".a { margin: revert; }" },
    { code: ".a { margin: revert-layer; }" },
    { code: ".a { margin: unset; }" },
    { code: ".a { margin: 55ch; }" },
    { code: ".a { margin: 1.55lh; }" },
    { code: ".a { margin: 10vh; }" },
    { code: ".a { margin: 10vw; }" },
    { code: ".a { margin: 10vmax; }" },
    { code: ".a { margin: 10vmin; }" },
    { code: ".a { margin: 10vb; }" },
    { code: ".a { margin: 10vi; }" },
    { code: ".a { margin: 0 auto; }" },
    { code: ".a { margin: var(--scale-size-4) var(--scale-size-8); }" },
    { code: ".a { margin: -4px; }" },
    { code: ".a { margin: -1rem; }" },
  ],

  reject: [
    {
      code: ".a { padding: 8px; }",
      message:
        'Unexpected hard-coded sizing of "8px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
      fixed: ".a { padding: var(--scale-size-8); }",
    },
    {
      code: ".a { padding: 7px; }",
      message:
        'Unexpected hard-coded sizing of "7px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
      unfixable: true,
    },
    {
      code: ".a { margin: 1rem; }",
      message:
        'Unexpected hard-coded sizing of "1rem" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
      fixed: ".a { margin: var(--scale-size-16); }",
    },
    {
      code: ".a { padding: 3cap; }",
      message:
        'Unexpected hard-coded sizing of "3cap" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 20,
      unfixable: true,
    },
    {
      code: ".a { padding: 1em; }",
      message:
        'Unexpected hard-coded sizing of "1em" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
      unfixable: true,
    },
    {
      code: ".a { padding: 1ex; }",
      message:
        'Unexpected hard-coded sizing of "1ex" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
      unfixable: true,
    },
    {
      code: ".a { padding: 1ic; }",
      message:
        'Unexpected hard-coded sizing of "1ic" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
      unfixable: true,
    },
    {
      code: ".a { padding: 1cm; }",
      message:
        'Unexpected hard-coded sizing of "1cm" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
      unfixable: true,
    },
    {
      code: ".a { padding: 1mm; }",
      message:
        'Unexpected hard-coded sizing of "1mm" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
      unfixable: true,
    },
    {
      code: ".a { padding: 1Q; }",
      message:
        'Unexpected hard-coded sizing of "1Q" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 18,
      unfixable: true,
    },
    {
      code: ".a { padding: 1in; }",
      message:
        'Unexpected hard-coded sizing of "1in" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
      unfixable: true,
    },
    {
      code: ".a { padding: 1pc; }",
      message:
        'Unexpected hard-coded sizing of "1pc" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
      unfixable: true,
    },
    {
      code: ".a { padding: 1pt; }",
      message:
        'Unexpected hard-coded sizing of "1pt" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
      unfixable: true,
    },
    {
      code: ".a { width: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 17,
      unfixable: true,
    },
    {
      code: ".a { height: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 18,
      unfixable: true,
    },
    {
      code: ".a { top: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 15,
      unfixable: true,
    },
    {
      code: ".a { right: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 17,
      unfixable: true,
    },
    {
      code: ".a { bottom: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 18,
      unfixable: true,
    },
    {
      code: ".a { left: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 16,
      unfixable: true,
    },
    {
      code: ".a { margin-block: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 24,
      unfixable: true,
    },
    {
      code: ".a { margin-inline: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
      unfixable: true,
    },
    {
      code: ".a { margin-inline-start: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 31,
      unfixable: true,
    },
    {
      code: ".a { margin-inline-end: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 29,
      unfixable: true,
    },
    {
      code: ".a { margin-block-end: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 28,
      unfixable: true,
    },
    {
      code: ".a { margin-block-start: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 30,
      unfixable: true,
    },
    {
      code: ".a { margin-top: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 22,
      unfixable: true,
    },
    {
      code: ".a { margin-right: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 24,
      unfixable: true,
    },
    {
      code: ".a { margin-bottom: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
      unfixable: true,
    },
    {
      code: ".a { margin-left: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 23,
      unfixable: true,
    },
    {
      code: ".a { padding-block: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
      unfixable: true,
    },
    {
      code: ".a { padding-inline: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 26,
      unfixable: true,
    },
    {
      code: ".a { padding-inline-start: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 32,
      unfixable: true,
    },
    {
      code: ".a { padding-inline-end: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 30,
      unfixable: true,
    },
    {
      code: ".a { padding-block-start: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 31,
      unfixable: true,
    },
    {
      code: ".a { padding-block-end: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 29,
      unfixable: true,
    },
    {
      code: ".a { padding-top: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 23,
      unfixable: true,
    },
    {
      code: ".a { padding-right: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
      unfixable: true,
    },
    {
      code: ".a { padding-bottom: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 26,
      unfixable: true,
    },
    {
      code: ".a { padding-left: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 24,
      unfixable: true,
    },
    {
      code: ".a { gap: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 15,
      unfixable: true,
    },
    {
      code: ".a { row-gap: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 19,
      unfixable: true,
    },
    {
      code: ".a { column-gap: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 22,
      unfixable: true,
    },
    {
      code: ".a { flex-basis: 1px; }",
      message:
        'Unexpected hard-coded sizing of "1px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 22,
      unfixable: true,
    },
    {
      code: ".a { margin: $spacing-1; }",
      message:
        'Unexpected SCSS sizing variable "$spacing-1" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
      unfixable: true,
    },
    {
      code: ".a { padding: $spacing-4 $spacing-8; }",
      warnings: [
        {
          message:
            'Unexpected SCSS sizing variable "$spacing-4" (meteor/prefer-sizing-token)',
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 37,
        },
        {
          message:
            'Unexpected SCSS sizing variable "$spacing-8" (meteor/prefer-sizing-token)',
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 37,
        },
      ],
      unfixable: true,
    },
    {
      code: ".a { padding: 4px var(--scale-size-1); }",
      message:
        'Unexpected hard-coded sizing of "4px" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 39,
      fixed: ".a { padding: var(--scale-size-4) var(--scale-size-1); }",
    },
    {
      code: ".a { padding: 4px 8px; }",
      warnings: [
        {
          message:
            'Unexpected hard-coded sizing of "4px" (meteor/prefer-sizing-token)',
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 23,
        },
        {
          message:
            'Unexpected hard-coded sizing of "8px" (meteor/prefer-sizing-token)',
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 23,
        },
      ],
      fixed: ".a { padding: var(--scale-size-4) var(--scale-size-8); }",
    },
    {
      code: ".a { padding: 1rem 0.5rem; }",
      warnings: [
        {
          message:
            'Unexpected hard-coded sizing of "1rem" (meteor/prefer-sizing-token)',
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 27,
        },
        {
          message:
            'Unexpected hard-coded sizing of "0.5rem" (meteor/prefer-sizing-token)',
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 27,
        },
      ],
      fixed: ".a { padding: var(--scale-size-16) var(--scale-size-8); }",
    },
    {
      code: ".a { margin: 2.125rem; }",
      message:
        'Unexpected hard-coded sizing of "2.125rem" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 23,
      unfixable: true,
    },
    {
      code: ".a { margin: $spacing-1; }",
      message:
        'Unexpected SCSS sizing variable "$spacing-1" (meteor/prefer-sizing-token)',
      line: 1,
      column: 6,
      endLine: 1,
      endColumn: 25,
      unfixable: true,
    },
    {
      code: ".a { padding: $spacing-4 $spacing-8; }",
      warnings: [
        {
          message:
            'Unexpected SCSS sizing variable "$spacing-4" (meteor/prefer-sizing-token)',
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 37,
        },
        {
          message:
            'Unexpected SCSS sizing variable "$spacing-8" (meteor/prefer-sizing-token)',
          line: 1,
          column: 6,
          endLine: 1,
          endColumn: 37,
        },
      ],
      unfixable: true,
    },
    // {
    //   code: ".a { padding: $spacing-4 8px; }",
    //   warnings: [
    //     {
    //       message:
    //         'Unexpected SCSS sizing variable "$spacing-4" (meteor/prefer-sizing-token)',
    //       line: 1,
    //       column: 6,
    //       endLine: 1,
    //       endColumn: 30,
    //     },
    //     {
    //       message:
    //         'Unexpected hard-coded sizing of "8px" (meteor/prefer-sizing-token)',
    //     },
    //   ],
    //   fixed: ".a { padding: $spacing-4 var(--scale-size-8); }",
    // },
  ],
});
