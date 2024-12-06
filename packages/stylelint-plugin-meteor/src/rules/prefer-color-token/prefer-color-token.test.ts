import { testRule } from "stylelint-test-rule-node";

import plugin from "./index.js";

const {
  rule: { ruleName },
} = plugin;

testRule({
  plugins: [plugin],
  ruleName,
  config: true,

  accept: [
    { code: "a { text-size: 1rem; }" },
    { code: "a { color: var(--color-primary); }" },
    { code: "a { color: inherit; }" },
    { code: "a { color: initial; }" },
    { code: "a { color: revert; }" },
    { code: "a { color: revert-layer; }" },
    { code: "a { color: unset; }" },
    { code: "a { color: none; }" },
    { code: "a { color: currentColor; }" },
    { code: "a { color: currentcolor; }" },
    { code: "a { color: transparent; }" },
  ],

  reject: [
    {
      code: "a { color: #000; }",
      message:
        'Unexpected hard-coded color of "#000", use a color token instead (meteor/prefer-color-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 17,
    },
    {
      code: "a { color: red; }",
      message:
        'Unexpected hard-coded color of "red", use a color token instead (meteor/prefer-color-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 16,
    },
    {
      code: "a { color: hsl(0, 0%, 0%); }",
      message:
        'Unexpected hard-coded color of "hsl(0, 0%, 0%)", use a color token instead (meteor/prefer-color-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 27,
    },
    {
      code: "a { color: rgb(0, 0, 0); }",
      message:
        'Unexpected hard-coded color of "rgb(0, 0, 0)", use a color token instead (meteor/prefer-color-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 25,
    },
    {
      code: "a { color: rgba(0, 0, 0, 0); }",
      message:
        'Unexpected hard-coded color of "rgba(0, 0, 0, 0)", use a color token instead (meteor/prefer-color-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 29,
    },
    {
      code: "a { color: hsla(0, 0%, 0%, 0); }",
      message:
        'Unexpected hard-coded color of "hsla(0, 0%, 0%, 0)", use a color token instead (meteor/prefer-color-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 31,
    },
    {
      code: "a { color: hwb(0, 0%, 0%); }",
      message:
        'Unexpected hard-coded color of "hwb(0, 0%, 0%)", use a color token instead (meteor/prefer-color-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 27,
    },
    {
      code: "a { color: light-dark(red, blue); }",
      message:
        'Unexpected hard-coded color of "light-dark(red, blue)", use a color token instead (meteor/prefer-color-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 34,
    },
    {
      code: "a { color: $green-500; }",
      message:
        'Unexpected hard-coded color of "$green-500", use a color token instead (meteor/prefer-color-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 23,
    },
    {
      code: "a { color: lighten($color-primary); }",
      message:
        'Unexpected hard-coded color of "lighten($color-primary)", use a color token instead (meteor/prefer-color-token)',
      line: 1,
      column: 5,
      endLine: 1,
      endColumn: 36,
    },
    {
      code: "a { color: darken($color-primary); }",
      message:
        'Unexpected hard-coded color of "darken($color-primary)", use a color token instead (meteor/prefer-color-token)',
      line: 1,
      column: 5,
      endLine: 1,
    },
  ],
});
